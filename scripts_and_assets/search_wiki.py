import urllib.request
import json
import urllib.parse
query = urllib.parse.quote("DNA replication split")
url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={query}&utf8=&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read())
    print([item['title'] for item in data['query']['search']])
