import urllib.request
import urllib.parse
import json

def download_commons(filename, out_name):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AntigravityAgent/1.0 (https://google.com)'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            pages = data['query']['pages']
            for page_id in pages:
                if 'imageinfo' in pages[page_id]:
                    img_url = pages[page_id]['imageinfo'][0]['url']
                    print(f"Downloading {img_url} to {out_name}")
                    req2 = urllib.request.Request(img_url, headers={'User-Agent': 'AntigravityAgent/1.0 (https://google.com)'})
                    with urllib.request.urlopen(req2) as r2:
                        with open(out_name, 'wb') as f:
                            f.write(r2.read())
                    return True
    except Exception as e:
        print(f"Failed to fetch {filename}: {e}")
    return False

download_commons("DNA_replication_en.svg", "/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/fig1_new.svg")
download_commons("DNA_replication_split.svg", "/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/fig2_split.svg")
