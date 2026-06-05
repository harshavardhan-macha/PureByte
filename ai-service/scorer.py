import requests

OPENFOODFACTS_API = "https://world.openfoodfacts.org/api/v0/product"


def _to_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def get_quality_score(data):
    product_data = {}

    if data.barcode:
        try:
            resp = requests.get(f"{OPENFOODFACTS_API}/{data.barcode}.json", timeout=8)
            if resp.status_code == 200:
                product_data = resp.json().get("product", {})
        except requests.RequestException:
            product_data = {}

    score = 100
    flags = []

    nutrients = product_data.get("nutriments", {}) or data.nutrients or {}

    sugar = _to_float(nutrients.get("sugars_100g", 0))
    if sugar > 20:
        score -= 25
        flags.append("Very high sugar")
    elif sugar > 10:
        score -= 10
        flags.append("High sugar")

    salt = _to_float(nutrients.get("salt_100g", 0))
    if salt > 1.5:
        score -= 20
        flags.append("High sodium")

    additives = product_data.get("additives_tags", [])
    if len(additives) > 5:
        score -= 15
        flags.append("Many additives")

    nutriscore = (product_data.get("nutrition_grade_fr", "") or "").lower()
    if nutriscore in ["d", "e"]:
        score -= 20
        flags.append(f"Nutriscore: {nutriscore.upper()}")

    score = max(0, min(100, score))

    if score >= 70:
        verdict = "Good to consume"
    elif score >= 40:
        verdict = "Consume in moderation"
    else:
        verdict = "Not recommended"

    return {
        "score": score,
        "verdict": verdict,
        "confidence": 0.85 if data.barcode else 0.60,
        "matched": product_data.get("product_name", data.product_name),
        "flags": flags,
    }
