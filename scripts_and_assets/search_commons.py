import urllib.request
import urllib.parse
import json

def search_commons(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit=5&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            print(f"--- Results for: {query} ---")
            for item in data["query"]["search"]:
                title = item['title'].replace("File:", "")
                print(title)
    except Exception as e:
        print(f"Error: {e}")

search_commons("Okazaki fragment svg")
search_commons("DNA primase svg")
search_commons("Nick translation svg")
search_commons("DNA ligase svg")
search_commons("DNA polymerase I svg")
