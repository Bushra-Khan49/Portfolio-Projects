import urllib.request
import urllib.parse
import json

def search_pmc(query):
    # Search Europe PMC for open access papers
    url = f"https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={urllib.parse.quote(query)}%20AND%20OPEN_ACCESS:Y&format=json&resultType=lite"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            results = data.get('resultList', {}).get('result', [])
            for res in results[:3]:
                pmcid = res.get('pmcid')
                if pmcid:
                    print(f"Found PMCID: {pmcid}")
    except Exception as e:
        print(f"Error: {e}")

search_pmc("okazaki fragment maturation primer removal")
