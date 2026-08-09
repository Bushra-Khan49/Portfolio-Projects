import urllib.request
import json

def get_images(page_title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=images&titles={urllib.parse.quote(page_title)}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            pages = data['query']['pages']
            for page_id in pages:
                images = pages[page_id].get('images', [])
                print(f"Images for {page_title}:")
                for img in images:
                    print(img['title'])
    except Exception as e:
        print(f"Error: {e}")

get_images("Okazaki fragments")
get_images("DNA polymerase I")
get_images("Nick translation")
