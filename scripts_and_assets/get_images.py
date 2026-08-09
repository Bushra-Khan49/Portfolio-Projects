import urllib.request
import json

def search(prefix):
    url = f"https://en.wikipedia.org/w/api.php?action=query&list=allimages&aiprop=url|mime&ailimit=50&aiprefix={prefix}&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        for img in data["query"]["allimages"]:
            if "svg" in img["mime"] or "png" in img["mime"] or "jpeg" in img["mime"]:
                print(f"{img['name']}: {img['url']}")

search("Okazaki")
search("DNA_polymerase")
