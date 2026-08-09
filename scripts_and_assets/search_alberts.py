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
            for u in urls:
                print(u)
    except Exception as e:
        print(f"Error: {e}")

search_ddg("albertsnature site:nature.com")
search_ddg("albertsnature01407 site:nature.com")
search_ddg("RNA primer erased and replaced by DNA site:nature.com")
