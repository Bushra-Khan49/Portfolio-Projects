import urllib.request

images = {
    "primase.jpg": "https://www.nature.com/scitable/content/ne0000/ne0000/ne0000/ne0000/14266013/f1_albertsnature01407-f1.2.jpg",
    "pol3.jpg": "http://www.nature.com/scitable/content/ne0000/ne0000/ne0000/ne0000/14266059/albertsnature01407_1_2.jpg",
    "nick_translation.jpg": "https://www.nature.com/scitable/content/ne0000/ne0000/ne0000/ne0000/105292327/44350_36a.jpg",
    "ligase.jpg": "http://www.nature.com/scitable/content/ne0000/ne0000/ne0000/ne0000/119362254/4609_91.jpg"
}

for name, url in images.items():
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            with open(f"Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/{name}", 'wb') as f:
                f.write(response.read())
            print(f"Successfully downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")

