import urllib.request
import re

url = "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5460595/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        imgs = set(re.findall(r'src="(//www\.ncbi\.nlm\.nih\.gov/pmc/articles/PMC5460595/bin/[^"]+\.jpg)"', html))
        
        for i, img in enumerate(list(imgs)[:3]):
            img_url = "https:" + img
            print(f"Downloading {img_url}")
            with urllib.request.urlopen(urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})) as res:
                with open(f"/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/temp_pmc_{i}.jpg", 'wb') as f:
                    f.write(res.read())
except Exception as e:
    print(f"Error: {e}")
