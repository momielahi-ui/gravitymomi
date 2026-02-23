import requests
import time

print("="*70)
print("COMPREHENSIVE SITEMAP DIAGNOSTIC")
print("="*70)

sitemap_url = 'https://smartreceptionai.xyz/sitemap.xml'
robots_url = 'https://smartreceptionai.xyz/robots.txt'

# Test 1: Check robots.txt
print("\n[1] Checking robots.txt...")
try:
    r = requests.get(robots_url)
    print(f"Status: {r.status_code}")
    print("Content:")
    print(r.text)
except Exception as e:
    print(f"Error: {e}")

# Test 2: Check sitemap with different User-Agents
user_agents = [
    ('Regular Browser', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
    ('Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
    ('Googlebot-Image', 'Googlebot-Image/1.0'),
]

for name, ua in user_agents:
    print(f"\n[2.{user_agents.index((name, ua))+1}] Testing with {name}...")
    try:
        headers = {
            'User-Agent': ua,
            'Cache-Control': 'no-cache'
        }
        r = requests.get(sitemap_url, headers=headers, allow_redirects=False)
        print(f"Status Code: {r.status_code}")
        print(f"Content-Type: {r.headers.get('content-type', 'N/A')}")
        
        if r.status_code in [301, 302, 307, 308]:
            print(f"REDIRECT to: {r.headers.get('Location', 'N/A')}")
        
        if r.status_code == 200:
            print(f"First 100 chars: {r.text[:100]}")
            if r.text.startswith('<?xml'):
                print("✓ XML Declaration present")
            else:
                print("✗ Missing XML declaration!")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(0.5)

# Test 3: Check for security headers
print(f"\n[3] Checking security headers...")
try:
    r = requests.get(sitemap_url)
    security_headers = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Strict-Transport-Security',
        'X-Vercel-Cache',
        'X-Robots-Tag'
    ]
    for header in security_headers:
        value = r.headers.get(header, 'Not set')
        print(f"{header}: {value}")
except Exception as e:
    print(f"Error: {e}")

# Test 4: Test direct API endpoint
print(f"\n[4] Testing direct API endpoint...")
api_url = 'https://smartreceptionai.xyz/api/sitemap'
try:
    r = requests.get(api_url)
    print(f"Status: {r.status_code}")
    print(f"Content-Type: {r.headers.get('content-type', 'N/A')}")
    print(f"First 100 chars: {r.text[:100]}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*70)
print("DIAGNOSTIC COMPLETE")
print("="*70)
