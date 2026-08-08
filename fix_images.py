import urllib.request
import urllib.parse

images = {
    "primase.jpg": "DNA_replication_split.svg",
    "pol3.jpg": "DNA_polymerase.svg",
    "nick_translation.jpg": "Nick_translation.svg",
    "ligase.jpg": "Ligase.svg"
}

# The user actually PREFERRED the original Wikipedia SVGs over the random Nature images because the Nature images were totally wrong (e.g. Translation diagram). 
# The user's issue was that they thought I generated them and they didn't want generated things. They said "take from net". 
# The SVGs *are* from the net, but the CSS filter `invert` made them look generated. I will download the actual SVGs or PNGs from Wiki and just use them with NO filter. Or I'll use the raster PNG versions.

for name, title in images.items():
    url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{title}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(f"Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/{name}", 'wb') as f:
                f.write(response.read())
            print(f"Successfully downloaded {title}")
    except Exception as e:
        print(f"Failed to download {title}: {e}")

