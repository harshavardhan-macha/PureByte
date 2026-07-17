import os
import joblib
import sys
from app.config import MODEL_PATH, VECTORIZER_PATH
from app.services.risk_database import FLAGGED_INGREDIENTS, lookup_all_names
from app.services.text_extractor import tokenize_ingredients

_model = None
_vectorizer = None
_loaded = False


def _load():
    global _model, _vectorizer, _loaded
    if _loaded:
        return
    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        try:
            _model = joblib.load(MODEL_PATH)
            _vectorizer = joblib.load(VECTORIZER_PATH)
        except Exception as e:
            print(f"Warning: could not load trained model artifacts: {e}", file=sys.stderr)
            _model = None
            _vectorizer = None
    else:
        print(f"Model or vectorizer not found: {MODEL_PATH}, {VECTORIZER_PATH}", file=sys.stderr)
    _loaded = True


def _ingredient_based_probability(ingredients_text: str) -> float:
    tokens = tokenize_ingredients(ingredients_text)
    if not tokens:
        return 0.05

    name_map = lookup_all_names()
    flagged_hits = 0
    severity_score = 0.0
    for token in tokens:
        for alias, canonical in name_map.items():
            if alias in token and canonical in FLAGGED_INGREDIENTS:
                flagged_hits += 1
                severity = FLAGGED_INGREDIENTS[canonical]["severity"]
                if severity == "high":
                    severity_score += 0.35
                elif severity == "medium":
                    severity_score += 0.18
                else:
                    severity_score += 0.1
                break

    suspicious_keywords = [
        "natural flavor",
        "natural flavour",
        "artificial flavor",
        "artificial flavour",
        "flavor",
        "flavour",
        "preservative",
        "emulsifier",
        "stabilizer",
        "thickener",
        "color",
        "colour",
        "dye",
        "maltodextrin",
        "corn syrup",
        "high fructose",
        "modified",
        "hydrolyzed",
        "partially hydrogenated",
        "hydrogenated",
        "citric acid",
        "sodium",
        "monosodium",
        "natural flavors",
        "artificial flavors",
    ]
    suspicious_matches = 0
    for token in tokens:
        for keyword in suspicious_keywords:
            if keyword in token:
                suspicious_matches += 1
                break

    if flagged_hits == 0:
        base_prob = 0.1 + 0.05 * min(suspicious_matches, 4) + 0.02 * max(0, len(tokens) - 4)
        return min(0.85, max(0.05, base_prob))

    base_prob = 0.24 + severity_score + 0.04 * min(suspicious_matches, 4) + 0.01 * max(0, len(tokens) - 5)
    return min(0.95, max(0.1, base_prob))


def predict_unsafe_probability(ingredients_text: str) -> float:
    """
    Returns a probability (0-1) that this ingredient list is likely to be
    considered unsafe / highly processed.

    The project ships with a trained model artifact, but compatibility issues
    between the serialized sklearn version and the installed version can make
    it fail at runtime. In that case we fall back to a deterministic heuristic
    based on the actual flagged ingredients present in the text so the API still
    produces meaningful results.
    """
    _load()
    heuristic_prob = _ingredient_based_probability(ingredients_text)
    if _model is None or _vectorizer is None:
        return heuristic_prob

    try:
        X = _vectorizer.transform([ingredients_text.lower()])
        if hasattr(_model, "coef_") and X.shape[1] != _model.coef_.shape[1]:
            raise ValueError(
                f"Feature mismatch: vectorizer={X.shape[1]} vs model={_model.coef_.shape[1]}"
            )
        proba = _model.predict_proba(X)[0]
        prob = float(proba[1])
        blended = 0.65 * prob + 0.35 * heuristic_prob
        return min(max(blended, 0.0), 1.0)
    except Exception as e:
        print(f"Warning: model prediction failed, using ingredient heuristic: {e}", file=sys.stderr)
        return heuristic_prob
