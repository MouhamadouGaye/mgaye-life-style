import json
from collections import defaultdict

# 👉 charge ton fichier JSON plat
with open("ansd_clean.json", "r", encoding="utf-8") as f:
    flat_data = json.load(f)

# 🧠 structure temporaire
regions = {}

for row in flat_data:
    r = row["region"]
    d = row["department"]
    a = row["arrondissement"]
    c = row["commune"]
    dist = row["district"]

    if r not in regions:
        regions[r] = {}

    if d not in regions[r]:
        regions[r][d] = {}

    if a not in regions[r][d]:
        regions[r][d][a] = {}

    if c not in regions[r][d][a]:
        regions[r][d][a][c] = set()  # 🔥 set pour éviter doublons

    regions[r][d][a][c].add(dist)

# 🔄 transformation finale
result = {"regions": []}

for r_name, departments in regions.items():
    region_obj = {
        "name": r_name,
        "departments": []
    }

    for d_name, arrondissements in departments.items():
        dept_obj = {
            "name": d_name,
            "arrondissements": []
        }

        for a_name, communes in arrondissements.items():
            arr_obj = {
                "name": a_name,
                "communes": []
            }

            for c_name, districts in communes.items():
                com_obj = {
                    "name": c_name,
                    "districts": sorted(list(districts))
                }

                arr_obj["communes"].append(com_obj)

            dept_obj["arrondissements"].append(arr_obj)

        region_obj["departments"].append(dept_obj)

    result["regions"].append(region_obj)

# 💾 sauvegarde
with open("nested_data.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("✅ Données imbriquées générées !")



# resurlt -->>
##-------FROM-----------------------------------------------------------------------------------######
# {
#   "region": "DIOURBEL",
#   "department": "DIOURBEL",
#   "arrondissement": "NDINDY",
#   "commune": "NDANKH SENE",
#   "district": "NDIA 1",
#   "population": "76"
# }

##-------TO-------------------------------------------------------------------------------------######
# {
#   "regions": [
#     {
#       "name": "DIOURBEL",
#       "departments": [
#         {
#           "name": "DIOURBEL",
#           "arrondissements": [
#             {
#               "name": "NDINDY",
#               "communes": [
#                 {
#                   "name": "NDANKH SENE",
#                   "districts": ["NDIA 1", "NDIA 2"]
#                 }
#               ]
#             }
#           ]
#         }
#       ]
#     }
#   ]
# }
##-------END-----------------------------------------------------------------------------------######