import urllib.request
import urllib.parse
import re

def search_ddg(query):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            # Extract URLs from the HTML
            urls = re.findall(r'href="([^"]+nature\.com[^"]+)"', html)
            for u in urls[:5]:
                print(u)
    except Exception as e:
        print(f"Error: {e}")

search_ddg("primer removal okazaki fragments site:nature.com")
search_ddg("DNA polymerase I site:nature.com")
search_ddg("RNA primer removal site:nature.com")
