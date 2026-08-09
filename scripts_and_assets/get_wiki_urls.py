import urllib.request
import json
import urllib.parse

def get_images(page_title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=images&titles={urllib.parse.quote(page_title)}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            pages = data['query']['pages']
            for page_id in pages:
                images = pages[page_id].get('images', [])
                for img in images:
                    title = img['title']
                    if title.lower().endswith(('.jpg', '.png')):
                        # Get URL
                        url2 = f"https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles={urllib.parse.quote(title)}&format=json"
                        with urllib.request.urlopen(urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})) as res2:
                            data2 = json.loads(res2.read())
                            pages2 = data2['query']['pages']
                            for pid2 in pages2:
                                if 'imageinfo' in pages2[pid2]:
                                    print(pages2[pid2]['imageinfo'][0]['url'])
    except Exception as e:
        print(f"Error: {e}")

get_images("Okazaki fragments")
get_images("DNA polymerase I")
get_images("DNA replication")
