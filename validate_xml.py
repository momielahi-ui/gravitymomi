import requests
import xml.etree.ElementTree as ET

print("="*70)
print("XML VALIDATION TEST")
print("="*70)

url = 'https://smartreceptionai.xyz/sitemap.xml'

try:
    # Fetch the sitemap
    r = requests.get(url, headers={'Cache-Control': 'no-cache'})
    
    print(f"Status: {r.status_code}")
    print(f"Content-Type: {r.headers.get('Content-Type')}")
    print(f"Length: {len(r.text)} characters\n")
    
    # Try to parse as XML
    print("Attempting to parse XML...")
    try:
        root = ET.fromstring(r.text)
        print("SUCCESS: XML is well-formed and parseable!")
        
        # Count URLs
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = root.findall('.//ns:url', namespace)
        print(f"Found {len(urls)} URLs in sitemap")
        
        # Check first URL
        if urls:
            first_url = urls[0]
            loc = first_url.find('ns:loc', namespace)
            if loc is not None:
                print(f"First URL: {loc.text}")
        
    except ET.ParseError as e:
        print(f"XML PARSE ERROR: {e}")
        print("This is why Google can't read it!")
        print("\nShowing area around error:")
        print(r.text[:500])
        
except Exception as e:
    print(f"Request failed: {e}")

print("="*70)
