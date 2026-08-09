import urllib.request
import urllib.parse
import re
import json

def get_images(query):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}&t=h_&iar=images&iax=images&ia=images"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            vqd = re.search(r'vqd=([\d-]+)', html)
            if vqd:
                vqd = vqd.group(1)
                api_url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&vqd={vqd}"
                api_req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(api_req) as api_res:
                    data = json.loads(api_res.read())
                    results = data.get('results', [])
                    for i, res in enumerate(results[1:10]): # SKIP THE FIRST ONE
                        img_url = res['image']
                        if 'favpng' in img_url or 'wikimedia' in img_url:
                            continue # Skip bad domains
                        print(f"Downloading {img_url}")
                        try:
                            req2 = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                            with urllib.request.urlopen(req2, timeout=5) as r2:
                                c = r2.read()
                                if len(c) > 10000:
                                    with open(f"/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/nick_translation_{i}.jpg", 'wb') as f:
                                        f.write(c)
                                    print("Success!")
                        except Exception as e:
                            print(f"Failed: {e}")
    except Exception as e:
        print(f"Error: {e}")

get_images("DNA polymerase I primer removal textbook diagram")
