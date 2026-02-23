import requests

url = 'https://smartreceptionai.xyz/sitemap.xml'
print(f"Fetching: {url}\n")

try:
    r = requests.get(url, headers={'Cache-Control': 'no-cache'})
    print(f"Status Code: {r.status_code}")
    print(f"Content-Type: {r.headers.get('content-type', 'N/A')}")
    print("\n" + "="*60)
    print("FIRST 800 CHARACTERS OF RAW RESPONSE:")
    print("="*60)
    print(r.text[:800])
    print("="*60)
    
    # Check if XML declaration is present
    if r.text.startswith('<?xml'):
        print("\n✓ XML DECLARATION IS PRESENT")
    else:
        print("\n✗ XML DECLARATION IS MISSING!")
        print(f"File starts with: {repr(r.text[:50])}")
        
except Exception as e:
    print(f"Error: {e}")
