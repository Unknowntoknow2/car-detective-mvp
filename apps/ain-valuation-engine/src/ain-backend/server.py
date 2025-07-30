from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/")
def home():
    return "AIN Valuation Engine API is running!"


@app.route("/api/valuate", methods=["POST"])
def valuate():
    data = request.json
    # Example: just echo back the price for now
    price = data.get("price", 0)
    return jsonify({"valuation": price})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)