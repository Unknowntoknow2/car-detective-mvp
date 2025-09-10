#!/usr/bin/env python3
import sys, json, statistics

REQ_KEYS=["source","year","make","model","price","mileage"]
def i(x, d=0):
    try: return int(str(x).replace(",",""))
    except: return d

def main():
    if len(sys.argv)<2:
        print("usage: validate_comps.py in_out/merged_camry_comps.json"); sys.exit(2)
    p=sys.argv[1]
    d=json.load(open(p))
    L=d.get("listings",[])
    if not L: raise SystemExit("No listings in comps.")
    missing=0; bad=0; prices=[]; miles=[]
    for idx,l in enumerate(L):
        for k in REQ_KEYS:
            if k not in l: missing+=1; print(f"[MISS] idx={idx} missing={k}")
        y=i(l.get("year")); pz=i(l.get("price"));
        mi = i(l.get("mileage")) if "mileage" in l else i(l.get("miles"))
        if not (1990<=y<=2100) or not (1000<=pz<=200000) or not (0<=mi<=400000):
            bad+=1; print(f"[RANGE] idx={idx} year={y} price={pz} miles={mi}")
        prices.append(pz); miles.append(mi)
    print(f"Listings: {len(L)}  missing_fields: {missing}  bad_ranges: {bad}")
    print(f"Price median: {statistics.median(prices):,.0f}  Miles median: {statistics.median(miles):,}")
if __name__=="__main__":
    main()
