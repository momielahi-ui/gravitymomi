import requests
from datetime import datetime

print(f"Time now: {datetime.now().strftime('%H:%M:%S')}")
print("Checking live deployment...\n")

r = requests.get('https://smartreceptionai.xyz/sitemap.xml', headers={'Cache-Control': 'no-cache'})

print(f"Status: {r.status_code}")
print(f"Content-Type: {r.headers.get('Content-Type')}")
print(f"X-Vercel-Cache: {r.headers.get('X-Vercel-Cache')}")

# Check first few lines
lines = r.text.split('\n')[:5]
for i, line in enumerate(lines, 1):
    print(f"Line {i}: {line.strip()}")
