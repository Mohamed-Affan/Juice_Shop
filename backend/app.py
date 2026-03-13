from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Temporary product list (later this will come from database)
products = []

@app.route("/")
def home():
    return "Juice Shop Billing Backend Running 🚀"

# Add product
@app.route("/add-product", methods=["POST"])
def add_product():
    data = request.json
    products.append({
        "name": data["name"],
        "price": data["price"]
    })
    return jsonify({"message": "Product added successfully"})

# Get all products
@app.route("/products", methods=["GET"])
def get_products():
    return jsonify(products)

if __name__ == "__main__":
    app.run(debug=True)