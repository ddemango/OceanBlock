"""App Store Connect helper run by .github/workflows/app-store-connect.yml.

Uses the ASC API key stored in GitHub secrets (never printed) to manage TestFlight.
Actions:
  status       - show builds, processing and beta-review state, groups and testers
  add-testers  - add the given emails to the app's internal TestFlight group
  invite       - resend TestFlight invitations
  gamecenter   - enable Game Center and create the Daily Challenge leaderboard
  rename       - set the App Store name (passed in the second argument)
  prepare      - fill in version 1.0 for App Store review from store/listing.json + store/*.png
"""
import hashlib, json, os, sys, time, urllib.request, urllib.error
import jwt  # PyJWT

APP_ID = os.environ.get('ASC_APP_ID', '6838143219')
API = 'https://api.appstoreconnect.apple.com/v1'


def token():
    now = int(time.time())
    return jwt.encode(
        {'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1200, 'aud': 'appstoreconnect-v1'},
        os.environ['ASC_KEY_P8'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})


def call(method, path, body=None):
    url = path if path.startswith('http') else API + path
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body else None,
                                 headers={'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        msg = e.read().decode()
        print(f'!! {method} {path} -> HTTP {e.code}: {msg[:600]}')
        return None


def call_raw(method, path, body=None):
    url = path if path.startswith('http') else API + path
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body else None,
                                 headers={'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return r.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode())
        except Exception:
            return e.code, {}


def internal_group():
    groups = call('GET', f'/apps/{APP_ID}/betaGroups?limit=50') or {'data': []}
    internal = [g for g in groups['data'] if g['attributes'].get('isInternalGroup')]
    if internal:
        return internal[0]
    print('No internal group yet - creating "Internal Testers"')
    r = call('POST', '/betaGroups', {'data': {'type': 'betaGroups', 'attributes': {
        'name': 'Internal Testers', 'isInternalGroup': True, 'hasAccessToAllBuilds': True},
        'relationships': {'app': {'data': {'type': 'apps', 'id': APP_ID}}}}})
    return r['data'] if r else None


def status():
    app = call('GET', f'/apps/{APP_ID}')
    if not app:
        return
    print('App:', app['data']['attributes']['name'], app['data']['attributes']['bundleId'])
    builds = call('GET', f'/builds?filter[app]={APP_ID}&sort=-uploadedDate&limit=5&include=buildBetaDetail,betaAppReviewSubmission') or {}
    inc = {(i['type'], i['id']): i['attributes'] for i in builds.get('included', [])}
    for b in builds.get('data', []):
        a = b['attributes']
        rel = b['relationships']
        det = rel.get('buildBetaDetail', {}).get('data')
        sub = rel.get('betaAppReviewSubmission', {}).get('data')
        d = inc.get((det['type'], det['id']), {}) if det else {}
        s = inc.get((sub['type'], sub['id']), {}) if sub else {}
        print(f"Build {a['version']}: processing={a['processingState']} expired={a['expired']} "
              f"internal={d.get('internalBuildState')} external={d.get('externalBuildState')} "
              f"betaReview={s.get('betaReviewState')}")
    groups = call('GET', f'/apps/{APP_ID}/betaGroups?limit=50') or {'data': []}
    for g in groups['data']:
        ga = g['attributes']
        testers = call('GET', f"/betaGroups/{g['id']}/betaTesters?limit=50") or {'data': []}
        emails = [(t['attributes'].get('email'), t['attributes'].get('state')) for t in testers['data']]
        print(f"Group '{ga['name']}' internal={ga.get('isInternalGroup')} allBuilds={ga.get('hasAccessToAllBuilds')} testers={emails}")


def add_testers(emails):
    g = internal_group()
    if not g:
        return
    gid = g['id']
    print('Using internal group:', g['attributes']['name'])
    if not g['attributes'].get('hasAccessToAllBuilds'):
        call('PATCH', f'/betaGroups/{gid}', {'data': {'type': 'betaGroups', 'id': gid, 'attributes': {'hasAccessToAllBuilds': True}}})
    for email in emails:
        r = call('POST', '/betaTesters', {'data': {'type': 'betaTesters', 'attributes': {'email': email},
                 'relationships': {'betaGroups': {'data': [{'type': 'betaGroups', 'id': gid}]}}}})
        if r:
            print('Added', email)
        else:
            # tester may already exist: look them up and attach to the group
            found = call('GET', f'/betaTesters?filter[email]={email}') or {'data': []}
            for t in found['data']:
                if call('POST', f'/betaGroups/{gid}/relationships/betaTesters',
                        {'data': [{'type': 'betaTesters', 'id': t['id']}]}) is not None:
                    print('Attached existing tester', email)


def invite(emails):
    for email in emails:
        found = call('GET', f'/betaTesters?filter[email]={email}&filter[apps]={APP_ID}') or {'data': []}
        for t in found['data']:
            r = call('POST', '/betaTesterInvitations', {'data': {'type': 'betaTesterInvitations', 'relationships': {
                'app': {'data': {'type': 'apps', 'id': APP_ID}},
                'betaTester': {'data': {'type': 'betaTesters', 'id': t['id']}}}}})
            print('Invitation sent to' if r is not None else 'Invite failed for', email)


LEADERBOARD_ID = 'tidebreaker.daily'


def gamecenter():
    det = call('GET', f'/apps/{APP_ID}/gameCenterDetail')
    if not det or not det.get('data'):
        print('Enabling Game Center for the app')
        det = call('POST', '/gameCenterDetails', {'data': {'type': 'gameCenterDetails', 'relationships': {
            'app': {'data': {'type': 'apps', 'id': APP_ID}}}}})
        if not det:
            return
    gid = det['data']['id']
    print('Game Center detail:', gid)
    boards = call('GET', f'/gameCenterDetails/{gid}/gameCenterLeaderboards?limit=50') or {'data': []}
    for b in boards['data']:
        if b['attributes'].get('vendorIdentifier') == LEADERBOARD_ID:
            print('Leaderboard already exists:', b['id'], b['attributes'])
            return
    base = {'defaultFormatter': 'INTEGER', 'referenceName': 'Daily Challenge', 'vendorIdentifier': LEADERBOARD_ID,
            'submissionType': 'BEST_SCORE', 'scoreSortType': 'DESC', 'scoreRangeStart': '0', 'scoreRangeEnd': '100000000'}
    rel = {'gameCenterDetail': {'data': {'type': 'gameCenterDetails', 'id': gid}}}
    # a leaderboard that resets every day; fall back to an all-time board if recurring isn't accepted
    start = time.strftime('%Y-%m-%dT00:00:00Z', time.gmtime(time.time() + 86400))
    r = call('POST', '/gameCenterLeaderboards', {'data': {'type': 'gameCenterLeaderboards', 'attributes': {
        **base, 'recurrenceStartDate': start, 'recurrenceDuration': 'P1D', 'recurrenceRule': 'FREQ=DAILY;INTERVAL=1'},
        'relationships': rel}})
    if not r:
        print('Recurring leaderboard refused; creating an all-time leaderboard instead')
        r = call('POST', '/gameCenterLeaderboards', {'data': {'type': 'gameCenterLeaderboards', 'attributes': base, 'relationships': rel}})
    if not r:
        return
    lid = r['data']['id']
    print('Created leaderboard', lid)
    loc = call('POST', '/gameCenterLeaderboardLocalizations', {'data': {'type': 'gameCenterLeaderboardLocalizations',
        'attributes': {'locale': 'en-US', 'name': 'Daily Challenge', 'formatterSuffix': ' pts', 'formatterSuffixSingular': ' pt'},
        'relationships': {'gameCenterLeaderboard': {'data': {'type': 'gameCenterLeaderboards', 'id': lid}}}}})
    print('Added English name' if loc else 'Localization failed')


def register_app(bundle, name):
    """Register the bundle id and try to create the App Store Connect app record."""
    found = call('GET', f'/bundleIds?filter[identifier]={bundle}&limit=5') or {'data': []}
    match = [b for b in found['data'] if b['attributes']['identifier'] == bundle]
    if match:
        bid = match[0]['id']
        print('Bundle id already registered:', bundle)
    else:
        r = call('POST', '/bundleIds', {'data': {'type': 'bundleIds', 'attributes': {
            'identifier': bundle, 'name': name, 'platform': 'IOS'}}})
        if not r:
            print('Could not register the bundle id.')
            return False
        bid = r['data']['id']
        print('Registered bundle id:', bundle)
    apps = call('GET', f'/apps?filter[bundleId]={bundle}&limit=1') or {'data': []}
    if apps['data']:
        print('App record already exists:', apps['data'][0]['attributes']['name'], apps['data'][0]['id'])
        return True
    r = call('POST', '/apps', {'data': {'type': 'apps', 'attributes': {
        'name': name, 'sku': bundle.replace('.', '-'), 'primaryLocale': 'en-US', 'bundleId': bundle},
        'relationships': {'bundleId': {'data': {'type': 'bundleIds', 'id': bid}}}}})
    if r:
        print('Created app record:', r['data']['id'])
        return True
    print('APP_RECORD_NOT_CREATED: Apple rejected creating the app record through the API.')
    return False


def team_id(bundle):
    """The Apple team (App ID prefix) that owns a registered bundle id."""
    r = call('GET', f'/bundleIds?filter[identifier]={bundle}&limit=5') or {'data': []}
    for b in r['data']:
        if b['attributes']['identifier'] == bundle:
            return b['attributes'].get('seedId')
    return None


def preflight(bundle):
    """Print TEAM_ID=... for the workflow, and fail clearly if the app record is missing."""
    tid = team_id(bundle)
    if not tid:
        print(f'::error::Bundle id {bundle} is not registered on this Apple account.')
        return False
    print(f'TEAM_ID={tid}')
    apps = call('GET', f'/apps?filter[bundleId]={bundle}&limit=1') or {'data': []}
    if not apps['data']:
        print(f'::error::No App Store Connect app record uses {bundle} yet. Create it once at appstoreconnect.apple.com → Apps → + → New App, choosing this bundle id, then run this workflow again.')
        return False
    print('App record:', apps['data'][0]['attributes']['name'])
    return True


def resolve_app():
    """Optionally target another app by bundle id (ASC_BUNDLE_ID), e.g. Unwind with Ma Dukes."""
    global APP_ID
    bundle = os.environ.get('ASC_BUNDLE_ID', '').strip()
    if not bundle:
        return True
    r = call('GET', f'/apps?filter[bundleId]={bundle}&limit=1')
    if not r or not r.get('data'):
        print(f'No App Store Connect app found for bundle id {bundle}. Create the app record first.')
        return False
    APP_ID = r['data'][0]['id']
    return True


def rename(new_name):
    infos = call('GET', f'/apps/{APP_ID}/appInfos?include=appInfoLocalizations') or {'data': []}
    locs = {i['id']: i for i in infos.get('included', []) if i['type'] == 'appInfoLocalizations'}
    done = False
    for info in infos['data']:
        state = info['attributes'].get('appStoreState') or info['attributes'].get('state')
        for ref in info['relationships']['appInfoLocalizations']['data']:
            loc = locs.get(ref['id'])
            if not loc:
                continue
            print(f"appInfo {info['id']} state={state} locale={loc['attributes'].get('locale')} name={loc['attributes'].get('name')!r}")
            r = call('PATCH', f"/appInfoLocalizations/{loc['id']}", {'data': {'type': 'appInfoLocalizations', 'id': loc['id'], 'attributes': {'name': new_name}}})
            if r:
                print('Renamed to', r['data']['attributes']['name'])
                done = True
    if not done:
        print('Could not rename the app listing')


EDITABLE = ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED', 'INVALID_BINARY')


def all_pages(path):
    out, url = [], path
    while url:
        r = call('GET', url) or {}
        out += r.get('data', [])
        url = (r.get('links') or {}).get('next')
    return out


def upload_screens(loc_id, display_type, files):
    sets = call('GET', f'/appStoreVersionLocalizations/{loc_id}/appScreenshotSets') or {'data': []}
    sset = next((x for x in sets['data'] if x['attributes']['screenshotDisplayType'] == display_type), None)
    if not sset:
        r = call('POST', '/appScreenshotSets', {'data': {'type': 'appScreenshotSets', 'attributes': {'screenshotDisplayType': display_type},
                 'relationships': {'appStoreVersionLocalization': {'data': {'type': 'appStoreVersionLocalizations', 'id': loc_id}}}}})
        if not r:
            return False
        sset = r['data']
    for old in (call('GET', f"/appScreenshotSets/{sset['id']}/appScreenshots") or {'data': []})['data']:
        call('DELETE', f"/appScreenshots/{old['id']}")
    for path in files:
        data = open(path, 'rb').read()
        r = call('POST', '/appScreenshots', {'data': {'type': 'appScreenshots', 'attributes': {'fileName': os.path.basename(path), 'fileSize': len(data)},
                 'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': sset['id']}}}}})
        if not r:
            return False
        shot = r['data']
        for op in shot['attributes']['uploadOperations']:
            chunk = data[op['offset']:op['offset'] + op['length']]
            req = urllib.request.Request(op['url'], data=chunk, method=op['method'],
                                         headers={h['name']: h['value'] for h in op.get('requestHeaders', [])})
            urllib.request.urlopen(req).read()
        call('PATCH', f"/appScreenshots/{shot['id']}", {'data': {'type': 'appScreenshots', 'id': shot['id'],
             'attributes': {'uploaded': True, 'sourceFileChecksum': hashlib.md5(data).hexdigest()}}})
        print('  uploaded', os.path.basename(path), 'to', display_type)
    return True


def prepare():
    L = json.load(open('store/listing.json'))
    ok = {}
    # 1. app-level settings
    ok['content rights'] = call('PATCH', f'/apps/{APP_ID}', {'data': {'type': 'apps', 'id': APP_ID,
        'attributes': {'contentRightsDeclaration': 'DOES_NOT_USE_THIRD_PARTY_CONTENT'}}}) is not None
    # 2. version 1.0
    versions = (call('GET', f'/apps/{APP_ID}/appStoreVersions?filter[platform]=IOS&limit=10') or {'data': []})['data']
    ver = next((v for v in versions if (v['attributes'].get('appStoreState') or v['attributes'].get('appVersionState')) in EDITABLE), None)
    if not ver:
        r = call('POST', '/appStoreVersions', {'data': {'type': 'appStoreVersions', 'attributes': {'platform': 'IOS', 'versionString': '1.0'},
                 'relationships': {'app': {'data': {'type': 'apps', 'id': APP_ID}}}}})
        ver = r['data'] if r else None
    if not ver:
        print('!! no editable App Store version'); return
    vid = ver['id']
    print('Version', ver['attributes'].get('versionString'), vid)
    ok['copyright'] = call('PATCH', f'/appStoreVersions/{vid}', {'data': {'type': 'appStoreVersions', 'id': vid,
        'attributes': {'copyright': L['copyright']}}}) is not None
    locs = (call('GET', f'/appStoreVersions/{vid}/appStoreVersionLocalizations') or {'data': []})['data']
    loc = next((l for l in locs if l['attributes']['locale'] == 'en-US'), locs[0] if locs else None)
    ok['description/keywords'] = call('PATCH', f"/appStoreVersionLocalizations/{loc['id']}", {'data': {'type': 'appStoreVersionLocalizations', 'id': loc['id'],
        'attributes': {'description': L['description'], 'keywords': L['keywords'], 'supportUrl': L['supportUrl'], 'promotionalText': L['promotionalText']}}}) is not None
    # 3. app info: categories, subtitle, privacy URL, age rating
    infos = (call('GET', f'/apps/{APP_ID}/appInfos') or {'data': []})['data']
    info = next((i for i in infos if (i['attributes'].get('appStoreState') or i['attributes'].get('state')) in EDITABLE), infos[0])
    iid = info['id']
    cat = lambda c: {'data': {'type': 'appCategories', 'id': c}}
    ok['category'] = call('PATCH', f'/appInfos/{iid}', {'data': {'type': 'appInfos', 'id': iid, 'relationships': {
        'primaryCategory': cat('GAMES'), 'primarySubcategoryOne': cat('GAMES_ACTION'), 'primarySubcategoryTwo': cat('GAMES_CASUAL')}}}) is not None
    for il in (call('GET', f'/appInfos/{iid}/appInfoLocalizations') or {'data': []})['data']:
        ok['subtitle/privacy URL'] = call('PATCH', f"/appInfoLocalizations/{il['id']}", {'data': {'type': 'appInfoLocalizations', 'id': il['id'],
            'attributes': {'name': L['name'], 'subtitle': L['subtitle'], 'privacyPolicyUrl': L['privacyPolicyUrl']}}}) is not None
    ard = call('GET', f'/appInfos/{iid}/ageRatingDeclaration')
    if ard and ard.get('data'):
        aid = ard['data']['id']
        skip = ('kidsAgeBand', 'ageRatingOverride', 'ageRatingOverrideV2', 'koreaAgeRatingOverride', 'developerAgeRatingInfoUrl', 'gracRatingClassificationNumber')
        attrs = {k: 'NONE' for k in ard['data']['attributes'] if k not in skip}
        attrs['gunsOrOtherWeapons'] = 'INFREQUENT_OR_MILD'  # a cartoon cannon (fired only at cargo) - declared honestly
        # Apple's form mixes yes/no and none/mild/frequent questions: let its error messages tell us which is which
        done = False
        for _ in range(6):
            st, body = call_raw('PATCH', f'/ageRatingDeclarations/{aid}', {'data': {'type': 'ageRatingDeclarations', 'id': aid, 'attributes': attrs}})
            if st < 300:
                done = True
                break
            changed = False
            for e in body.get('errors', []):
                field = (e.get('source') or {}).get('pointer', '').split('/')[-1]
                if 'Expected a BOOLEAN' in e.get('detail', '') and field in attrs:
                    attrs[field] = False; changed = True
                elif field and field not in attrs and 'required' in e.get('detail', '').lower():
                    attrs[field] = 'NONE'; changed = True
            if not changed:
                print('!! age rating:', json.dumps(body)[:800]); break
        ok['age rating'] = done
        if done:
            print('Age rating answers:', json.dumps(attrs))
    # 4. price: free
    existing = call('GET', f'/apps/{APP_ID}/appPriceSchedule')
    if existing and existing.get('data'):
        ok['price: free'] = True
    else:
        pts = (call('GET', f'/apps/{APP_ID}/appPricePoints?filter[territory]=USA&limit=200') or {'data': []})['data']
        free = next((p for p in pts if float(p['attributes'].get('customerPrice') or 0) == 0), None)
        ok['price: free'] = bool(free) and call('POST', '/appPriceSchedules', {'data': {'type': 'appPriceSchedules', 'relationships': {
            'app': {'data': {'type': 'apps', 'id': APP_ID}}, 'baseTerritory': {'data': {'type': 'territories', 'id': 'USA'}},
            'manualPrices': {'data': [{'type': 'appPrices', 'id': '${price1}'}]}}},
            'included': [{'type': 'appPrices', 'id': '${price1}', 'attributes': {'startDate': None},
                          'relationships': {'appPricePoint': {'data': {'type': 'appPricePoints', 'id': free['id']}}}}]}) is not None
    # 5. availability: every country
    av = call('GET', f'/apps/{APP_ID}/appAvailabilityV2')
    if av and av.get('data'):
        ok['available worldwide'] = True
    else:
        terrs = all_pages('/territories?limit=200')
        inc = [{'type': 'territoryAvailabilities', 'id': '${t' + t['id'] + '}', 'attributes': {'available': True},
                'relationships': {'territory': {'data': {'type': 'territories', 'id': t['id']}}}} for t in terrs]
        ok['available worldwide'] = call('POST', 'https://api.appstoreconnect.apple.com/v2/appAvailabilities', {'data': {'type': 'appAvailabilities',
            'attributes': {'availableInNewTerritories': True}, 'relationships': {'app': {'data': {'type': 'apps', 'id': APP_ID}},
            'territoryAvailabilities': {'data': [{'type': 'territoryAvailabilities', 'id': i['id']} for i in inc]}}}, 'included': inc}) is not None
    # 6. screenshots
    iphone = [f'store/screenshot-{i}.png' for i in range(1, 7)]
    ipad = [f'store/ipad-screenshot-{i}.png' for i in range(1, 7)]
    ok['iPhone screenshots'] = upload_screens(loc['id'], 'APP_IPHONE_67', iphone) or upload_screens(loc['id'], 'APP_IPHONE_69', iphone)
    ok['iPad screenshots'] = upload_screens(loc['id'], 'APP_IPAD_PRO_3GEN_129', ipad)
    # 7. newest processed build
    b = (call('GET', f'/builds?filter[app]={APP_ID}&filter[processingState]=VALID&sort=-uploadedDate&limit=1') or {'data': []})['data']
    if b:
        ok[f"build {b[0]['attributes']['version']} attached"] = call('PATCH', f'/appStoreVersions/{vid}/relationships/build',
            {'data': {'type': 'builds', 'id': b[0]['id']}}) is not None
    # 8. review contact
    R = {k: v for k, v in L['review'].items() if v}
    R['demoAccountRequired'] = False
    det = call('GET', f'/appStoreVersions/{vid}/appStoreReviewDetail')
    if det and det.get('data'):
        ok['review contact'] = call('PATCH', f"/appStoreReviewDetails/{det['data']['id']}", {'data': {'type': 'appStoreReviewDetails',
            'id': det['data']['id'], 'attributes': R}}) is not None
    else:
        ok['review contact'] = call('POST', '/appStoreReviewDetails', {'data': {'type': 'appStoreReviewDetails', 'attributes': R,
            'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': vid}}}}}) is not None
    print('Review phone set:', bool(L['review'].get('contactPhone')))
    # 9. Game Center on this version
    gcv = call('POST', '/gameCenterAppVersions', {'data': {'type': 'gameCenterAppVersions', 'relationships': {
        'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': vid}}}}})
    print('Game Center app version:', 'created' if gcv else 'not created (may already exist)')
    print('\n==== READINESS ====')
    for k, v in ok.items():
        print(('OK   ' if v else 'FAIL ') + k)


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'preflight':
        sys.exit(0 if preflight(os.environ.get('ASC_BUNDLE_ID', '').strip()) else 1)
    if len(sys.argv) > 1 and sys.argv[1] == 'register-app':
        ok = register_app(os.environ.get('ASC_BUNDLE_ID', '').strip(), os.environ.get('ASC_APP_NAME', 'Unwind with Ma Dukes'))
        sys.exit(0 if ok else 1)
    if not resolve_app():
        sys.exit(1)
    action = sys.argv[1] if len(sys.argv) > 1 else 'status'
    if action == 'add-testers':
        add_testers([e.strip() for e in sys.argv[2].split(',') if e.strip()])
    if action == 'invite':
        invite([e.strip() for e in sys.argv[2].split(',') if e.strip()])
    if action == 'gamecenter':
        gamecenter()
    if action == 'rename':
        rename(sys.argv[2])
    if action == 'prepare':
        prepare()
    status()
