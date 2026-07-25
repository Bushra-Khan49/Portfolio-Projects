import urllib.request
import os

images = {
    "step1_primase.svg": "https://upload.wikimedia.org/wikipedia/commons/8/87/DNA_replication_en.svg",
    "step2_pol3.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/DNA_polymerase_III.svg/800px-DNA_polymerase_III.svg.png",
    "step3_pol1.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/DNA_polymerase_1_Klenow_fragment.png/800px-DNA_polymerase_1_Klenow_fragment.png",
    "step4_ligase.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/DNA_ligase_activity.svg/800px-DNA_ligase_activity.svg.png"
}

os.makedirs("Syllabus explained/Domain-1/Topic 3 Okazaki Fragments", exist_ok=True)
for filename, url in images.items():
    path = os.path.join("Syllabus explained/Domain-1/Topic 3 Okazaki Fragments", filename)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
