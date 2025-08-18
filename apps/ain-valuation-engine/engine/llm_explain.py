
import os
import openai
import threading
import time

SYSTEM_PROMPT = (
	"You are an expert vehicle valuation assistant. ONLY use the provided facts. "
	"If you are uncertain, say so. Do not invent or speculate."
)

def llm_explanation(numeric_output: dict, top_factors: list, method: str, data_sufficiency: bool, timeout=5, ensemble_factors=None):
	api_key = os.environ.get("OPENAI_API_KEY")
	if not api_key:
		return fallback_explanation(numeric_output, top_factors, method, data_sufficiency)
	openai.api_key = api_key
	user_prompt = (
		f"Valuation result: {numeric_output}.\n"
		f"Top factors: {top_factors}.\n"
		f"Method: {method}.\n"
		f"Data sufficiency: {data_sufficiency}.\n"
		f"Ensemble/multimodal factors: {ensemble_factors if ensemble_factors else 'N/A'}.\n"
		"Write a user-friendly, facts-only explanation."
	)
	result = {"text": None}
	def call_llm():
		try:
			response = openai.ChatCompletion.create(
				model="gpt-4o",
				messages=[
					{"role": "system", "content": SYSTEM_PROMPT},
					{"role": "user", "content": user_prompt}
				],
				max_tokens=120,
				temperature=0.2,
			)
			result["text"] = response.choices[0].message.content.strip()
		except Exception:
			result["text"] = None
	thread = threading.Thread(target=call_llm)
	thread.start()
	thread.join(timeout)
	if result["text"]:
		return result["text"]
	return fallback_explanation(numeric_output, top_factors, method, data_sufficiency)

def fallback_explanation(numeric_output, top_factors, method, data_sufficiency):
	value = numeric_output.get("value", "N/A")
	conf = numeric_output.get("confidence", "N/A")
	if not data_sufficiency:
		return f"The valuation is based on limited data. Estimated value: ${value} (confidence: {conf})."
	factors = ", ".join([f["feature"] for f in top_factors]) if top_factors else "various factors"
	return f"Estimated value: ${value} (confidence: {conf}). Top factors: {factors}."
