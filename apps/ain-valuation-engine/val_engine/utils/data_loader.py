import pandas as pd
import os

def load_training_data():
    base_dir = os.path.dirname(__file__)
    path = os.path.join(base_dir, '..', 'training_data.csv')
    return pd.read_csv(os.path.abspath(path))

def preprocess_input(vehicle):
    return pd.DataFrame([{
        "year": int(vehicle["year"]),
        "mileage": int(vehicle["mileage"]),
        "make": str(vehicle["make"]),
        "model": str(vehicle["model"]),
        "zipcode": int(vehicle["zipcode"]),
        "condition": str(vehicle["condition"])
    }])
