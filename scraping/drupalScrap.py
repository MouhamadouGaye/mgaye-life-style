# import requests
# import certifi
# import json
# import time
# from bs4 import BeautifulSoup
# import ssl



# BASE_URL = "https://www.ansd.sn/views/ajax?_wrapper_format=drupal_ajax"

# # os.environ['SSL_CERT_FILE'] = certifi.where()

# session = requests.Session()

# headers = {
#     "User-Agent": "Mozilla/5.0",
#     "X-Requested-With": "XMLHttpRequest",
#     "Referer": "https://www.ansd.sn/",
#     "Accept": "application/json"
# }

# def fetch_page(region, page):
#     payload = {
#         "view_name": "recensements",
#         "view_display_id": "page_1",
#         "page": page,
#         "field_region_value": region
#     }

#     res = session.post(BASE_URL, data=payload, headers=headers, verify=False)
#     print(res.status_code)
#     print(res.text[:500])
#     return res.json()


# def extract_html_blocks(response):
#     """Drupal renvoie du HTML dans 'insert'"""
#     for block in response:
#         if block.get("command") == "insert":
#             return block.get("data", "")
#     return ""


# def parse_table(html):
#     soup = BeautifulSoup(html, "html.parser")
#     table = soup.find("table")
#     if not table:
#         return []

#     rows = table.find_all("tr")[1:]

#     data = []
#     for r in rows:
#         cols = [c.text.strip() for c in r.find_all("td")]
#         if len(cols) >= 5:
#             data.append({
#                 "region": cols[0],
#                 "department": cols[1],
#                 "arrondissement": cols[2],
#                 "commune": cols[3],
#                 "district": cols[4],
#                 "population": cols[-1]
#             })

#     return data


# def scrape_region(region):
#     print(f"🚀 Scraping {region}")

#     all_data = []
#     page = 0

#     while True:
#         try:
#             response = fetch_page(region, page)

#             html = extract_html_blocks(response)
#             if not html:
#                 break

#             rows = parse_table(html)

#             if not rows:
#                 break

#             all_data.extend(rows)

#             print(f"   page {page} -> {len(rows)} lignes")

#             page += 1
#             time.sleep(0.5)

#         except Exception as e:
#             print("error:", e)
#             break

#     return all_data


# regions = [
#     "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
#     "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
#     "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
#     "LOUGA", "DIOURBEL"
# ]

# final_data = []                                                                                                                                                                                                                           

# for r in regions:
#     final_data.extend(scrape_region(r))

# print("TOTAL:", len(final_data))

# with open("ansd_raw.json", "w", encoding="utf-8") as f:
#     json.dump(final_data, f, indent=2, ensure_ascii=False)


import requests
import urllib3
import json
import time
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed

# Désactiver warning SSL (site mal configuré)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://www.ansd.sn/views/ajax?_wrapper_format=drupal_ajax"

session = requests.Session()

headers = {
    "User-Agent": "Mozilla/5.0",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://www.ansd.sn/",
    "Accept": "application/json"
}

# ----------------------------
# FETCH avec retry automatique
# ----------------------------
def fetch_page(region, page, retries=3):
    payload = {
        "view_name": "recensements",
        "view_display_id": "page_1",
        "page": page,
        "field_region_value": region
    }

    for attempt in range(retries):
        try:
            res = session.post(
                BASE_URL,
                data=payload,
                headers=headers,
                verify=False,
                timeout=20
            )

            if res.status_code == 200:
                return res.json()

        except Exception as e:
            print(f"⚠️ retry {attempt+1} ({region}, page {page})")

        time.sleep(1)

    return None


# ----------------------------
# EXTRACTION HTML Drupal
# ----------------------------
def extract_html_blocks(response):
    for block in response:
        if block.get("command") == "insert":
            return block.get("data", "")
    return ""


# ----------------------------
# PARSING HTML
# ----------------------------
def parse_table(html):
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")
    if not table:
        return []

    rows = table.find_all("tr")[1:]

    data = []
    for r in rows:
        cols = [c.text.strip() for c in r.find_all("td")]
        if len(cols) >= 5:
            data.append({
                "region": cols[0],
                "department": cols[1],
                "arrondissement": cols[2],
                "commune": cols[3],
                "district": cols[4],
                "population": cols[-1]
            })

    return data


# ----------------------------
# SCRAPE 1 REGION
# ----------------------------
def scrape_region(region):
    print(f"\n🚀 {region}")
    all_data = []
    page = 0

    while True:
        response = fetch_page(region, page)

        if not response:
            break

        html = extract_html_blocks(response)
        if not html:
            break

        rows = parse_table(html)

        if not rows:
            break

        all_data.extend(rows)

        print(f"   page {page} → {len(rows)} lignes")

        page += 1
        time.sleep(0.3)  # anti-ban léger

    return all_data


# ----------------------------
# MULTI-THREAD (BOOST x5-x10)
# ----------------------------
def scrape_all(regions):
    results = []

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(scrape_region, r): r for r in regions}

        for future in as_completed(futures):
            region = futures[future]
            try:
                data = future.result()
                results.extend(data)
            except Exception as e:
                print(f"❌ erreur {region}: {e}")

    return results


# ----------------------------
# MAIN
# ----------------------------
regions = [
    "DAKAR", "THIES", "SAINT-LOUIS", "ZIGUINCHOR",
    "KAOLACK", "TAMBACOUNDA", "KOLDA", "MATAM",
    "FATICK", "KAFFRINE", "KEDOUGOU", "SEDHIOU",
    "LOUGA", "DIOURBEL"
]

data = scrape_all(regions)

print("\n✅ TOTAL:", len(data))

with open("ansd_clean.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)