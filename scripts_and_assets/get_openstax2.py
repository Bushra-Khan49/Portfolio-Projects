import urllib.request
import json

urls = [
    "https://upload.wikimedia.org/wikipedia/commons/4/4c/1414_DNA_Replication_Fork.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8f/0323_DNA_Replication.jpg",
    "https://s3-us-west-2.amazonaws.com/courses-images/wp-content/uploads/sites/1094/2016/11/03165243/OSC_Microbio_11_02_DNARep.jpg",
    "https://open.edu/openlearn/pluginfile.php/3313936/mod_oucontent/oucontent/111818/s320_v1_c2_f07.jpg"
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            content = r.read()
            if len(content) > 10000:
                with open("/Users/bushrakhan/Documents/antigravity/excited-newton/Portfolio-Projects/Syllabus explained/Domain-1/Topic 3 Okazaki Fragments/nick_translation.png", 'wb') as f:
                    f.write(content)
                print(f"Success! Downloaded {url}")
                break
    except Exception as e:
        print(f"Failed {url}: {e}")

