import urllib.request
import urllib.parse
from html.parser import HTMLParser

class ImageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        
    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            attrs_dict = dict(attrs)
            if 'src' in attrs_dict and 'http' in attrs_dict['src']:
                self.images.append(attrs_dict['src'])

def search_images(query):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            parser = ImageParser()
            parser.feed(html)
            print(f"--- Results for: {query} ---")
            for img in set(parser.images):
                print(img)
    except Exception as e:
        print(f"Error: {e}")

search_images("Okazaki fragments DNA replication diagram png")
