import urllib.request
import urllib.parse
import json
import re

def get_vqd(query):
    url = f"https://duckduckgo.com/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'vqd=([\d-]+)', html)
        if match:
            return match.group(1)
    except:
        pass
    return None

def search_images(query):
    vqd = get_vqd(query)
    if not vqd:
        print(f"Failed to get vqd for {query}")
        return
    url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json&vqd={vqd}&f=,,,"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"--- Results for: {query} ---")
            for res in data.get('results', [])[:5]:
                print(res.get('image'))
    except Exception as e:
        print(f"Error: {e}")

search_images("Okazaki fragment DNA replication site:nature.com")
search_images("DNA primase mechanism site:nature.com")
search_images("DNA polymerase I nick translation site:nature.com")
search_images("DNA ligase mechanism site:nature.com")
