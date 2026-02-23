import requests

url = 'https://smartreceptionai.xyz/sitemap.xml'

print("="*70)
print("BYTE-LEVEL DIAGNOSTIC")
print("="*70)

r = requests.get(url, headers={'Cache-Control': 'no-cache'})

# Check first 50 bytes in hex
first_bytes = r.content[:50]
print("\nFirst 50 bytes (hex):")
print(' '.join(f'{b:02x}' for b in first_bytes))

# Check for BOM
if first_bytes.startswith(b'\xef\xbb\xbf'):
    print("\n!!! BOM (Byte Order Mark) DETECTED - This could cause issues!")
else:
    print("\nNo BOM detected (good)")

# Check encoding
print(f"\nContent-Type header: {r.headers.get('Content-Type')}")
print(f"Apparent encoding: {r.apparent_encoding}")

# Check if starts with XML declaration
if r.content.startswith(b'<?xml'):
    print("File starts with XML declaration (correct)")
elif r.content.startswith(b'\xef\xbb\xbf<?xml'):
    print("File has BOM before XML declaration (BAD!)")
else:
    print(f"WARNING: File starts with: {r.content[:20]}")

# Show first line as bytes
first_line = r.content.split(b'\n')[0]
print(f"\nFirst line (bytes): {first_line}")
print(f"First line (text): {first_line.decode('utf-8')}")

# Check line endings
if b'\r\n' in r.content[:100]:
    print("Line endings: CRLF (Windows style)")
elif b'\n' in r.content[:100]:
    print("Line endings: LF (Unix style)")

print("="*70)
