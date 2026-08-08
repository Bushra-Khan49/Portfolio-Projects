import urllib.request
import json
import urllib.parse

def search_epmc_images(query):
    # Search for articles with the query
    url = f"https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={urllib.parse.quote(query)}%20HAS_IMAGE:Y&format=json&resultType=lite"
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            for result in data.get('resultList', {}).get('result', [])[:3]:
                pmcid = result.get('pmcid')
                if pmcid:
                    print(f"Article: {result.get('title')} ({pmcid})")
                    # Fetch images for this PMCID
                    img_url = f"https://www.ebi.ac.uk/europepmc/webservices/rest/{pmcid}/image?format=json"
                    img_req = urllib.request.Request(img_url)
                    with urllib.request.urlopen(img_req) as img_resp:
                        img_data = json.loads(img_resp.read().decode('utf-8'))
                        for img in img_data.get('figureList', {}).get('figure', []):
                            print(f" - Image: {img.get('figureId')} -> {img.get('imageURL')}")
                            # Stop after 2 images per article
                            break
    except Exception as e:
        print(f"Error: {e}")

search_epmc_images('("okazaki fragment" OR "dna replication") diagram')
search_epmc_images('"DNA primase" diagram mechanism')
