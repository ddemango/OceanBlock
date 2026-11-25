"""App Store Connect helper run by .github/workflows/app-store-connect.yml.

Uses the ASC API key stored in GitHub secrets (never printed) to manage TestFlight.
Actions:
  status       - show builds, processing and beta-review state, groups and testers
  add-testers  - add the given emails to the app's internal TestFlight group
  invite       - resend TestFlight invitations
  gamecenter   - enable Game Center and create the Daily Challenge leaderboard
  rename       - set the App Store name (passed in the second argument)
"""
import json, os, sys, time, urllib.request, urllib.error
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
    status()
