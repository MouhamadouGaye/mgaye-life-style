import pandas as pd

url = "URL_DU_CSV_ICI"

df = pd.read_csv(url)

json_data = df.to_dict(orient="records")

print(json_data[:5])

