import urllib.request
import os
import subprocess

urls = [
    "http://www.nature.com/scitable/content/ne0000/ne0000/ne0000/ne0000/14668888/U2.cp1.1_439542a-f1.2.jpg",
    "https://www.nature.com/scitable/content/ne0000/ne0000/ne0000/ne0000/105292500/44376_38a.jpg",
    "https://www.nature.com/scitable/content/ne0000/ne0000/ne0000/ne0000/6508808/EssGen1-3_Replication-Fig1_MID.jpg"
]

for i, url in enumerate(urls):
    filename = f"temp_img_{i}.jpg"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(filename, 'wb') as f:
                f.write(response.read())
        print(f"Downloaded {filename}")
        
        # We don't have tesseract installed by default usually on macOS runner, but we can try 
        # or we can use strings command! Text in standard JPEGs won't show in strings, but let's see.
    except Exception as e:
        print(f"Failed {url}: {e}")

