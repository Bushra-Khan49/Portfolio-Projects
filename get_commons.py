import urllib.request
import json
import urllib.parse

def search_commons(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            results = data['query']['search']
            for res in results:
                title = res['title']
                if title.lower().endswith(('.jpg', '.png')):
                    print(title)
    except Exception as e:
        print(f"Error: {e}")

search_commons("Okazaki fragment")
search_commons("DNA polymerase I")
search_commons("Nick translation")
