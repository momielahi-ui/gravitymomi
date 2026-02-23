import requests

print("="*70)
print("FINAL DIAGNOSTIC - Checking Static Sitemap Deployment")
print("="*70)

url = 'https://smartreceptionai.xyz/sitemap.xml'

# Test 1: Check with Googlebot user agent
print("\n[TEST 1] Fetching as Googlebot...")
headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
}

try:
    r = requests.get(url, headers=headers, timeout=10)
    print(f"Status: {r.status_code}")
    print(f"Content-Type: {r.headers.get('Content-Type', 'MISSING')}")
    print(f"Content-Length: {r.headers.get('Content-Length', 'MISSING')}")
    print(f"X-Vercel-Cache: {r.headers.get('X-Vercel-Cache', 'N/A')}")
    
    # Check first line
    first_line = r.text.split('\n')[0].strip()
    print(f"\nFirst line: {repr(first_line)}")
    
    if first_line == '<?xml version="1.0" encoding="UTF-8"?>':
        print("✓ XML declaration is correct")
    else:
        print(f"✗ PROBLEM: First line should be XML declaration, but got: {first_line}")
    
    # Check if it's actually XML
    if r.headers.get('Content-Type', '').startswith('application/xml') or r.headers.get('Content-Type', '').startswith('text/xml'):
        print("✓ Content-Type is XML")
    else:
        print(f"✗ PROBLEM: Content-Type is {r.headers.get('Content-Type')} (should be application/xml)")
    
    # Check for HTML instead of XML (server error page)
    if r.text.strip().startswith('<!DOCTYPE html>') or r.text.strip().startswith('<html'):
        print("✗ CRITICAL PROBLEM: Server returned HTML instead of XML!")
        print("This means Vercel is serving an error page or the wrong file.")
    else:
        print("✓ Response is XML (not HTML error page)")
        
    print(f"\nFirst 300 characters of response:")
    print(r.text[:300])
    
except Exception as e:
    print(f"✗ ERROR: {e}")
    print("This means the sitemap is not accessible!")

print("\n" + "="*70)
