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
                    for i, res in enumerate(results[:10]):
                        img_url = res['image']
                        print(f"Trying: {img_url}")
                        try:
                            # Try to download
                            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                            with urllib.request.urlopen(img_req, timeout=5) as r:
                                content = r.read()
                                if len(content) > 10000: # at least 10kb
                                    with open(f"/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/nick_translation.jpg", 'wb') as f:
                                        f.write(content)
                                    print(f"Success! Downloaded {img_url}")
                                    return
                        except Exception as e:
                            print(f"Failed: {e}")
    except Exception as e:
        print(f"Error: {e}")

get_images("DNA polymerase I Okazaki fragments textbook diagram")
