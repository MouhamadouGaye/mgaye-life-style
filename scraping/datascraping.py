# # import requests
# # from bs4 import BeautifulSoup
# # import json
# # import time
# # import urllib3

# # urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# # url = "https://www.ansd.sn/donnees-recensements"

# # regions = [
# #     "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
# #     "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
# #     "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
# #     "LOUGA", "DIOURBEL"
# # ]

# # all_data = []

# # for region in regions:
# #     print(f"Scraping {region}...")

# #     params = {
# #         "field_liste_annee_value": "2023",
# #         "field_regions_value": region,
# #         "field_departements_value": region
# #     }

# #     # res = requests.get(url, params=params)
# #     res = requests.get(url, params=params, verify=False)
# #     soup = BeautifulSoup(res.text, "lxml")

# #     table = soup.find("table")

# #     if not table:
# #         print(f"⚠️ Pas de table pour {region}")
# #         continue

# #     for row in table.find_all("tr")[1:]:
# #         cols = [td.text.strip() for td in row.find_all("td")]

# #         if len(cols) >= 5:
# #             all_data.append({
# #                 "region": cols[0],
# #                 "department": cols[1],
# #                 "arrondissement": cols[2],
# #                 "commune": cols[3],
# #                 "district": cols[4],
# #                 "population": cols[-1]
# #             })

# #     time.sleep(1)  # éviter blocage serveur

# # # Sauvegarde JSON
# # with open("senegal.json", "w", encoding="utf-8") as f:
# #     json.dump(all_data, f, ensure_ascii=False, indent=2)

# # print(f"✅ Données récupérées: {len(all_data)}")

import requests
from bs4 import BeautifulSoup
import json

url = "https://www.ansd.sn/donnees-recensements"

regions = [
    "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
    "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
    "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
    "LOUGA", "DIOURBEL"
]

nested = {}

for region in regions:
    print(f"Scraping {region}...")

    params = {
        "field_liste_annee_value": "2023",
        "field_regions_value": region,
    }

    res = requests.get(url, params=params, verify=False)
    soup = BeautifulSoup(res.text, "lxml")

    table = soup.find("table")
    if not table:
        continue

    for row in table.find_all("tr")[1:]:
        cols = [td.text.strip() for td in row.find_all("td")]
        if not cols:
            continue

        region = cols[0]
        dept = cols[1]
        arr = cols[2]
        commune = cols[3]
        district = cols[4]

        # Build structure directement
        nested.setdefault(region, {})
        nested[region].setdefault(dept, {})
        nested[region][dept].setdefault(arr, {})
        nested[region][dept][arr].setdefault(commune, [])
        nested[region][dept][arr][commune].append(district)

# Convertir en JSON final
final = {"regions": []}

for region, depts in nested.items():
    region_obj = {"name": region, "departments": []}

    for dept, arrs in depts.items():
        dept_obj = {"name": dept, "arrondissements": []}

        for arr, communes in arrs.items():
            arr_obj = {"name": arr, "communes": []}

            for commune, districts in communes.items():
                arr_obj["communes"].append({
                    "name": commune,
                    "districts": list(set(districts))
                })

            dept_obj["arrondissements"].append(arr_obj)

        region_obj["departments"].append(dept_obj)

    final["regions"].append(region_obj)

# Save
with open("senegal.json", "w", encoding="utf-8") as f:
    json.dump(final, f, indent=2, ensure_ascii=False)

# print("✅ Structure prête pour ton API")


# import requests
# from bs4 import BeautifulSoup
# import json
# import certifi

# url = "https://www.ansd.sn/donnees-recensements"

# regions = [
#     "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
#     "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
#     "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
#     "LOUGA", "DIOURBEL"
# ]

# session = requests.Session()

# headers = {
#     "User-Agent": "Mozilla/5.0",
#     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
# }

# nested = {}

# for region_name in regions:
#     print(f"Scraping {region_name}...")

#     page = 0  # si pagination existe

#     while True:
#         params = {
#             "field_liste_annee_value": "2023",
#             "field_regions_value": region_name,
#             "page": page
#         }

#         res = session.get(url, params=params, headers=headers, verify=certifi.where())
#         soup = BeautifulSoup(res.text, "lxml")

#         table = soup.find("table")

#         # STOP si pas de table
#         if not table:
#             break

#         rows = table.find_all("tr")[1:]

#         # STOP pagination si aucune ligne
#         if not rows:
#             break

#         for row in rows:
#             cols = [td.get_text(strip=True) for td in row.find_all("td")]

#             if len(cols) < 5:
#                 continue

#             region = cols[0]
#             dept = cols[1]
#             arr = cols[2]
#             commune = cols[3]
#             district = cols[4]

#             nested.setdefault(region, {})
#             nested[region].setdefault(dept, {})
#             nested[region][dept].setdefault(arr, {})
#             nested[region][dept][arr].setdefault(commune, [])
#             nested[region][dept][arr][commune].append(district)

#         print(f"  Page {page} OK ({len(rows)} lignes)")

#         page += 1  # page suivante

# # JSON final propre
# final = {"regions": []}

# for region, depts in nested.items():
#     region_obj = {"name": region, "departments": []}

#     for dept, arrs in depts.items():
#         dept_obj = {"name": dept, "arrondissements": []}

#         for arr, communes in arrs.items():
#             arr_obj = {"name": arr, "communes": []}

#             for commune, districts in communes.items():
#                 arr_obj["communes"].append({
#                     "name": commune,
#                     "districts": list(set(districts))
#                 })

#             dept_obj["arrondissements"].append(arr_obj)

#         region_obj["departments"].append(dept_obj)

#     final["regions"].append(region_obj)

# with open("senegal.json", "w", encoding="utf-8") as f:
#     json.dump(final, f, indent=2, ensure_ascii=False)

# print("✅ Scraping terminé + JSON généré")