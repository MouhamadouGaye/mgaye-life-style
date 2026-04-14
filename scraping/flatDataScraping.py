# # # # import requests
# # # # from bs4 import BeautifulSoup
# # # # import json
# # # # import time
# # # # import urllib3

# # # # urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# # # # url = "https://www.ansd.sn/donnees-recensements"

# # # # regions = [
# # # #     "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
# # # #     "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
# # # #     "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
# # # #     "LOUGA", "DIOURBEL"
# # # # ]

# # # # all_data = []

# # # # for region in regions:
# # # #     print(f"Scraping {region}...")

# # # #     params = {
# # # #         "field_liste_annee_value": "2023",
# # # #         "field_regions_value": region,
# # # #         "field_departements_value": region
# # # #     }

# # # #     # res = requests.get(url, params=params)
# # # #     res = requests.get(url, params=params, verify=False)
# # # #     soup = BeautifulSoup(res.text, "lxml")

# # # #     table = soup.find("table")

# # # #     if not table:
# # # #         print(f"⚠️ Pas de table pour {region}")
# # # #         continue

# # # #     for row in table.find_all("tr")[1:]:
# # # #         cols = [td.text.strip() for td in row.find_all("td")]

# # # #         if len(cols) >= 5:
# # # #             all_data.append({
# # # #                 "region": cols[0],
# # # #                 "department": cols[1],
# # # #                 "arrondissement": cols[2],
# # # #                 "commune": cols[3],
# # # #                 "district": cols[4],
# # # #                 "population": cols[-1]
# # # #             })

# # # #     time.sleep(1)  # éviter blocage serveur

# # # # # Sauvegarde JSON
# # # # with open("senegal.json", "w", encoding="utf-8") as f:
# # # #     json.dump(all_data, f, ensure_ascii=False, indent=2)

# # # # print(f"✅ Données récupérées: {len(all_data)}")

# # import requests
# # from bs4 import BeautifulSoup
# # import json

# # url = "https://www.ansd.sn/donnees-recensements"

# # regions = [
# #     "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
# #     "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
# #     "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
# #     "LOUGA", "DIOURBEL"
# # ]

# # nested = {}

# # for region in regions:
# #     print(f"Scraping {region}...")

# #     params = {
# #         "field_liste_annee_value": "2023",
# #         "field_regions_value": region,
# #     }

# #     res = requests.get(url, params=params, verify=False)
# #     soup = BeautifulSoup(res.text, "lxml")

# #     table = soup.find("table")
# #     if not table:
# #         continue

# #     for row in table.find_all("tr")[1:]:
# #         cols = [td.text.strip() for td in row.find_all("td")]
# #         if not cols:
# #             continue

# #         region = cols[0]
# #         dept = cols[1]
# #         arr = cols[2]
# #         commune = cols[3]
# #         district = cols[4]

# #         # Build structure directement
# #         nested.setdefault(region, {})
# #         nested[region].setdefault(dept, {})
# #         nested[region][dept].setdefault(arr, {})
# #         nested[region][dept][arr].setdefault(commune, [])
# #         nested[region][dept][arr][commune].append(district)

# # # Convertir en JSON final
# # final = {"regions": []}

# # for region, depts in nested.items():
# #     region_obj = {"name": region, "departments": []}

# #     for dept, arrs in depts.items():
# #         dept_obj = {"name": dept, "arrondissements": []}

# #         for arr, communes in arrs.items():
# #             arr_obj = {"name": arr, "communes": []}

# #             for commune, districts in communes.items():
# #                 arr_obj["communes"].append({
# #                     "name": commune,
# #                     "districts": list(set(districts))
# #                 })

# #             dept_obj["arrondissements"].append(arr_obj)

# #         region_obj["departments"].append(dept_obj)

# #     final["regions"].append(region_obj)

# # # Save
# # with open("senegal.json", "w", encoding="utf-8") as f:
# #     json.dump(final, f, indent=2, ensure_ascii=False)

# # # print("✅ Structure prête pour ton API")


# # # import requests
# # # from bs4 import BeautifulSoup
# # # import json
# # # import certifi

# # # url = "https://www.ansd.sn/donnees-recensements"

# # # regions = [
# # #     "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
# # #     "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
# # #     "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
# # #     "LOUGA", "DIOURBEL"
# # # ]

# # # session = requests.Session()

# # # headers = {
# # #     "User-Agent": "Mozilla/5.0",
# # #     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
# # # }

# # # nested = {}

# # # for region_name in regions:
# # #     print(f"Scraping {region_name}...")

# # #     page = 0  # si pagination existe

# # #     while True:
# # #         params = {
# # #             "field_liste_annee_value": "2023",
# # #             "field_regions_value": region_name,
# # #             "page": page
# # #         }

# # #         res = session.get(url, params=params, headers=headers, verify=certifi.where())
# # #         soup = BeautifulSoup(res.text, "lxml")

# # #         table = soup.find("table")

# # #         # STOP si pas de table
# # #         if not table:
# # #             break

# # #         rows = table.find_all("tr")[1:]

# # #         # STOP pagination si aucune ligne
# # #         if not rows:
# # #             break

# # #         for row in rows:
# # #             cols = [td.get_text(strip=True) for td in row.find_all("td")]

# # #             if len(cols) < 5:
# # #                 continue

# # #             region = cols[0]
# # #             dept = cols[1]
# # #             arr = cols[2]
# # #             commune = cols[3]
# # #             district = cols[4]

# # #             nested.setdefault(region, {})
# # #             nested[region].setdefault(dept, {})
# # #             nested[region][dept].setdefault(arr, {})
# # #             nested[region][dept][arr].setdefault(commune, [])
# # #             nested[region][dept][arr][commune].append(district)

# # #         print(f"  Page {page} OK ({len(rows)} lignes)")

# # #         page += 1  # page suivante

# # # # JSON final propre
# # # final = {"regions": []}

# # # for region, depts in nested.items():
# # #     region_obj = {"name": region, "departments": []}

# # #     for dept, arrs in depts.items():
# # #         dept_obj = {"name": dept, "arrondissements": []}

# # #         for arr, communes in arrs.items():
# # #             arr_obj = {"name": arr, "communes": []}

# # #             for commune, districts in communes.items():
# # #                 arr_obj["communes"].append({
# # #                     "name": commune,
# # #                     "districts": list(set(districts))
# # #                 })

# # #             dept_obj["arrondissements"].append(arr_obj)

# # #         region_obj["departments"].append(dept_obj)

# # #     final["regions"].append(region_obj)

# # # with open("senegal.json", "w", encoding="utf-8") as f:
# # #     json.dump(final, f, indent=2, ensure_ascii=False)

# # # print("✅ Scraping terminé + JSON généré")



# import requests
# from bs4 import BeautifulSoup
# import json
# import time

# BASE_URL = "https://www.ansd.sn/donnees-recensements"

# regions = [
#     "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
#     "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
#     "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
#     "LOUGA", "DIOURBEL"
# ]

# result = {"regions": []}

# def find_or_create(lst, name):
#     for item in lst:
#         if item["name"] == name:
#             return item
#     new_item = {"name": name}
#     lst.append(new_item)
#     return new_item

# for region in regions:
#     print(f"🔥 Scraping région: {region}")

#     params = {
#         "field_liste_annee_value": "2023",
#         "field_regions_value": region
#     }

#     try:
#         res = requests.get(BASE_URL, params=params, verify=False)
#         soup = BeautifulSoup(res.text, "html.parser")

#         table = soup.find("table")
#         if not table:
#             print(f"❌ Pas de table pour {region}")
#             continue

#         for row in table.find_all("tr")[1:]:
#             cols = [td.text.strip() for td in row.find_all("td")]
#             if not cols:
#                 continue

#             region_name = cols[0]
#             dept_name = cols[1]
#             arr_name = cols[2]
#             commune_name = cols[3]
#             district_name = cols[4]

#             # STRUCTURE
#             region_obj = find_or_create(result["regions"], region_name)
#             region_obj.setdefault("departments", [])

#             dept_obj = find_or_create(region_obj["departments"], dept_name)
#             dept_obj.setdefault("arrondissements", [])

#             arr_obj = find_or_create(dept_obj["arrondissements"], arr_name)
#             arr_obj.setdefault("communes", [])

#             commune_obj = find_or_create(arr_obj["communes"], commune_name)
#             commune_obj.setdefault("districts", [])

#             if district_name and district_name not in commune_obj["districts"]:
#                 commune_obj["districts"].append(district_name)

#         time.sleep(1)  # éviter blocage serveur

#     except Exception as e:
#         print(f"❌ Erreur sur {region}: {e}")

# # Sauvegarde
# with open("senegal.json", "w", encoding="utf-8") as f:
#     json.dump(result, f, ensure_ascii=False, indent=2)

# print("✅ JSON global généré !")




import requests
from bs4 import BeautifulSoup
import json
import time

BASE_URL = "https://www.ansd.sn/donnees-recensements"

regions = [
    "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
    "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
    "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
    "LOUGA", "DIOURBEL"
]

all_data = []

for region in regions:
    print(f"🔥 Région: {region}")

    page = 0

    while True:
        print(f"   → Page {page}")

        params = {
            "field_liste_annee_value": "2023",
            "field_regions_value": region,
            "page": page
        }

        res = requests.get(BASE_URL, params=params, verify=False)
        soup = BeautifulSoup(res.text, "html.parser")

        table = soup.find("table")
        if not table:
            break

        rows = table.find_all("tr")[1:]

        # 🛑 STOP si plus de données
        if not rows:
            break

        for row in rows:
            cols = [td.text.strip() for td in row.find_all("td")]
            if cols:
                all_data.append({
                    "region": cols[0],
                    "department": cols[1],
                    "arrondissement": cols[2],
                    "commune": cols[3],
                    "district": cols[4],
                    "population": cols[-1]
                })

        page += 1
        time.sleep(0.5)

print(f"✅ Total lignes: {len(all_data)}")

with open("senegal_flat.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)