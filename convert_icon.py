from PIL import Image
import os

img_path = 'public/favicon.png'
ico_path = 'public/favicon.ico'

if os.path.exists(img_path):
    img = Image.open(img_path)
    img.save(ico_path)
    print(f"Converted {img_path} to {ico_path}")
else:
    print(f"Error: {img_path} not found")
