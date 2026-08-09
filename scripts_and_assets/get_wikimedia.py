import urllib.request
import urllib.parse
import json

query = urllib.parse.quote("OpenStax DNA replication")
url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={query}&utf8=&format=json&srnamespace=6"

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        for result in data['query']['search']:
            title = result['title']
            print(f"Found: {title}")
            
            # Get image URL
            img_info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
            img_info_req = urllib.request.Request(img_info_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_info_req) as info_res:
                info_data = json.loads(info_res.read())
                pages = info_data['query']['pages']
                for page_id in pages:
                    if 'imageinfo' in pages[page_id]:
                        img_url = pages[page_id]['imageinfo'][0]['url']
                        print(f"URL: {img_url}")
                        
                        # Download it
                        try:
                            dl_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                            with urllib.request.urlopen(dl_req) as dl_res:
                                content = dl_res.read()
                                if len(content) > 10000:
                                    with open("/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/nick_translation.png", 'wb') as f:
                                        f.write(content)
                                    print("Success! Downloaded.")
                                    exit(0)
                        except Exception as e:
                            print(f"Download failed: {e}")
except Exception as e:
    print(f"Error: {e}")

