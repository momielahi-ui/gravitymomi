import requests
from datetime import datetime

print("="*70)
print(f"Current Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("="*70)

url = 'https://smartreceptionai.xyz/sitemap.xml'

try:
    # Force fresh copy, no cache
    headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
    }
    r = requests.get(url, headers=headers)
    
    print(f"\nStatus: {r.status_code}")
    print(f"Content-Type: {r.headers.get('content-type')}")
    print(f"Content-Length: {len(r.text)} bytes")
    
    # Check XML declaration
    if r.text.startswith('<?xml'):
        print("\n✓ XML Declaration: PRESENT")
    else:
        print("\n✗ XML Declaration: MISSING")
    
    # Check closing tag
    if r.text.strip().endswith('</urlset>'):
        print("✓ Closing Tag: PRESENT")
    else:
        print("✗ Closing Tag: MISSING or MALFORMED")
    
    # Extract and display dates
    print("\n--- Date Analysis ---")
    lines = r.text.split('\n')
    lastmod_dates = [line.strip() for line in lines if '<lastmod>' in line]
    if lastmod_dates:
        print(f"First date in sitemap: {lastmod_dates[0]}")
        unique_dates = set(lastmod_dates)
        print(f"Unique dates found: {len(unique_dates)}")
        for date in sorted(unique_dates):
            print(f"  {date}")
    
    # Show first 500 chars
    print("\n--- First 500 Characters ---")
    print(r.text[:500])
    
    # Show last 300 chars
    print("\n--- Last 300 Characters ---")
    print(r.text[-300:])
    
except Exception as e:
    print(f"Error: {e}")
