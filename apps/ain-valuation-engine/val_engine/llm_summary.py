import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
import os


def generate_valuation_summary(vehicle_info, shap_data):
    prompt = f"""
    Please write a valuation summary for this vehicle:
    {vehicle_info}
    """
    response = client.chat.completions.create(model="gpt-4o",
    messages=[{"role": "user", "content": prompt}])
    return response.choices[0].message.content.strip()
