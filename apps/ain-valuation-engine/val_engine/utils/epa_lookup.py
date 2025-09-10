import pandas as pd, os

_CACHE = None

def load_epa(path="data/external/vehicles.csv"):
    global _CACHE
    if _CACHE is None:
        if not os.path.exists(path):
            return None
        df = pd.read_csv(path, low_memory=False, usecols=["year","make","model","comb08","fuelType1","VClass"])
        df.rename(columns={"comb08":"epa_mpg_combined","fuelType1":"epa_fuel_type","VClass":"epa_body"}, inplace=True)
        df["make"]=df["make"].astype(str).str.upper().str.strip()
        df["model"]=df["model"].astype(str).str.upper().str.strip()
        _CACHE = (df.sort_values(["year","make","model","epa_mpg_combined"], ascending=[True,True,True,False])
                    .groupby(["year","make","model"], as_index=False).first())
    return _CACHE

def attach_epa(vin_info):
    df = load_epa()
    if df is None: return vin_info
    try:
        y = int(vin_info.get("year"))
        mk = str(vin_info.get("make",""))
        md = str(vin_info.get("model",""))
        row = df[(df["year"]==y) & (df["make"]==mk.upper().strip()) & (df["model"]==md.upper().strip())]
        if len(row):
            r = row.iloc[0]
            vin_info["epa_mpg_combined"] = float(r["epa_mpg_combined"])
            vin_info["epa_fuel_type"] = r["epa_fuel_type"]
            vin_info["epa_body"] = r["epa_body"]
    except Exception:
        pass
    return vin_info
