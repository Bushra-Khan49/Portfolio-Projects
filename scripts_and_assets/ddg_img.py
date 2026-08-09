import urllib.request
import urllib.parse
import re
import json

def get_images(query):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}&t=h_&iar=images&iax=images&ia=images"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            # Extract image tokens
            vqd = re.search(r'vqd=([\d-]+)', html)
            if vqd:
                vqd = vqd.group(1)
                api_url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&vqd={vqd}"
                api_req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(api_req) as api_res:
                    data = json.loads(api_res.read())
                    results = data.get('results', [])
                    for i, res in enumerate(results[:3]):
                        img_url = res['image']
                        print(f"Downloading {img_url}")
                        urllib.request.urlretrieve(img_url, f"/Users/bushrakhan/.gemini/antigravity/brain/580b815d-1b54-4c06-9015-c2953d2df965/temp_pmc_{i}.jpg")
    except Exception as e:
        print(f"Error: {e}")

get_images("DNA polymerase I primer removal nick translation Okazaki textbook")
