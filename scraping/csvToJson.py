# import pandas as pd

# url = "URL_DU_CSV_ICI"

# df = pd.read_csv(url)

# json_data = df.to_dict(orient="records")

# print(json_data[:5])


########------------------------------------------------------------------------------------------########
# import csv
# import json

# # Structure temporaire
# regions_map = {}

# with open("data-recensement.csv", newline="", encoding="utf-8") as f:
#     reader = csv.DictReader(f)

#     for row in reader:
#         region = row["Region"].strip()
#         dept = row["Department"].strip()
#         arr = row["COM_ARRT_VILLE"].strip()
#         commune = row["COMMUNE"].strip()
#         district = row["QUARTIER_VILLAGE_HAMEAU"].strip()

#         # REGION
#         if region not in regions_map:
#             regions_map[region] = {}

#         # DEPARTMENT
#         if dept not in regions_map[region]:
#             regions_map[region][dept] = {}

#         # ARRONDISSEMENT
#         if arr not in regions_map[region][dept]:
#             regions_map[region][dept][arr] = {}

#         # COMMUNE
#         if commune not in regions_map[region][dept][arr]:
#             regions_map[region][dept][arr][commune] = set()

#         # DISTRICT (set = éviter doublons)
#         regions_map[region][dept][arr][commune].add(district)

# # Conversion vers le format final
# final = {"regions": []}

# for region_name, depts in regions_map.items():
#     region_obj = {
#         "name": region_name,
#         "departments": []
#     }

#     for dept_name, arrs in depts.items():
#         dept_obj = {
#             "name": dept_name,
#             "arrondissements": []
#         }

#         for arr_name, comms in arrs.items():
#             arr_obj = {
#                 "name": arr_name,
#                 "communes": []
#             }

#             for commune_name, districts in comms.items():
#                 arr_obj["communes"].append({
#                     "name": commune_name,
#                     "districts": sorted(list(districts))  # tri propre
#                 })

#             dept_obj["arrondissements"].append(arr_obj)

#         region_obj["departments"].append(dept_obj)

#     final["regions"].append(region_obj)

# # Sauvegarde
# with open("structured.json", "w", encoding="utf-8") as f:
#     json.dump(final, f, indent=2, ensure_ascii=False)

# print("🔥 JSON parfait généré : structured.json")

########------------------------------------------------------------------------------------------######


import csv
import json

result = {"regions": []}

def find_or_create(lst, name, key="name"):
    for item in lst:
        if item[key] == name:
            return item
    new_item = {"name": name}
    lst.append(new_item)
    return new_item

with open("data-recensement-mbak.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        # Nettoyage des valeurs
        region_name = row["Region"].strip()
        dept_name = row["Departement"].strip()
        arr_name = row["COM_ARRT_VILLE"].strip()
        commune_name = row["COMMUNE"].strip()
        district_name = row["QUARTIER_VILLAGE_HAMEAU"].strip()

        # REGION
        region = find_or_create(result["regions"], region_name)
        region.setdefault("departments", [])

        # DEPARTMENT
        dept = find_or_create(region["departments"], dept_name)
        dept.setdefault("arrondissements", [])

        # ARRONDISSEMENT
        arr = find_or_create(dept["arrondissements"], arr_name)
        arr.setdefault("communes", [])

        # COMMUNE
        commune = find_or_create(arr["communes"], commune_name)
        commune.setdefault("districts", [])

        # DISTRICT
        if district_name and district_name not in commune["districts"]:
            commune["districts"].append(district_name)

# Sauvegarde JSON
with open("senegal.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("✅ JSON généré avec succès !")