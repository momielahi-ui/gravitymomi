import requests

try:
    r = requests.get('https://smartreceptionai.xyz/sitemap.xml')
    print(f"Status: {r.status_code}")
    print(f"Headers: {r.headers['content-type']}")
    print("--- Content Start ---")
    print(r.text[:500])
    print("--- Content End ---")
except Exception as e:
    print(e)
