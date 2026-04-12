import requests

url = "https://www.ansd.sn/views/ajax"

# headers = {
#     "User-Agent": "Mozilla/5.0",
#     "X-Requested-With": "XMLHttpRequest",
#     "Content-Type": "application/x-www-form-urlencoded"
# }
session = requests.Session()
headers = {
    "User-Agent": "Mozilla/5.0",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Referer": "https://www.ansd.sn/"
}

payload = {
    "view_name": "donnees_recensements",
    "view_display_id": "page_1",
    "field_liste_annee_value": "2023",
    "field_regions_value": "DAKAR",
    "field_departements_value": "DAKAR"
}

r = requests.post(url, data=payload, headers=headers, verify=False)

print(r.text[:1000])