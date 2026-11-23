"""App Store Connect helper run by .github/workflows/app-store-connect.yml.

Uses the ASC API key stored in GitHub secrets (never printed) to manage TestFlight.
Actions:
  status       - show builds, processing and beta-review state, groups and testers
  add-testers  - add the given emails to the app's internal TestFlight group
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
        emails = [t['attributes'].get('email') for t in testers['data']]
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


if __name__ == '__main__':
    action = sys.argv[1] if len(sys.argv) > 1 else 'status'
    if action == 'add-testers':
        add_testers([e.strip() for e in sys.argv[2].split(',') if e.strip()])
    status()
