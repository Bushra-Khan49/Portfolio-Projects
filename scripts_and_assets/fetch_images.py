import urllib.request
import urllib.parse
import json
import re

def download_commons(filename, out_name):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            pages = data['query']['pages']
            for page_id in pages:
                if 'imageinfo' in pages[page_id]:
                    img_url = pages[page_id]['imageinfo'][0]['url']
                    print(f"Downloading {img_url} to {out_name}")
                    urllib.request.urlretrieve(img_url, out_name)
                    return True
    except Exception as e:
        print(f"Failed to fetch {filename}: {e}")
    return False

# Download Image 1 (DNA_replication_en.svg)
download_commons("DNA_replication_en.svg", "/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/fig1_new.svg")

# Download Image 2 (DNA_replication_split.svg)
download_commons("DNA_replication_split.svg", "/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/fig2_split.svg")

# Download Image 3 (Campbell Biology diagram) using DDG
def get_ddg_image(query, out_name):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}&t=h_&iar=images&iax=images&ia=images"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
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
                    for res in results[:5]:
                        img_url = res['image']
                        print(f"Trying DDG image: {img_url}")
                        try:
                            urllib.request.urlretrieve(img_url, out_name)
                            print(f"Success downloaded {img_url}")
                            return True
                        except:
                            continue
    except Exception as e:
        print(f"DDG error: {e}")
    return False

get_ddg_image("Overview Origin of replication Leading strand Lagging strand Parental DNA Helicase", "/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/fig2_new.jpg")

