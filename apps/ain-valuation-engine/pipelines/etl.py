import pandas as pd

def etl():
    df = pd.read_csv("../data/sample.csv")
    df = df.dropna()
    df.to_csv("../data/processed.csv", index=False)

if __name__ == "__main__":
    etl()
    print("ETL complete")
