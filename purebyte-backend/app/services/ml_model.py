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
    for token in tokens:
        for alias, canonical in name_map.items():
            if alias in token and canonical in FLAGGED_INGREDIENTS:
                flagged_hits += 1
                break

    if flagged_hits == 0:
        return 0.1
    if flagged_hits == 1:
        return 0.28
    if flagged_hits == 2:
        return 0.45
    return min(0.9, 0.2 + (flagged_hits * 0.12))


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
    if _model is None or _vectorizer is None:
        return _ingredient_based_probability(ingredients_text)

    try:
        X = _vectorizer.transform([ingredients_text.lower()])
        proba = _model.predict_proba(X)[0]
        return float(proba[1])
    except Exception as e:
        print(f"Warning: model prediction failed, using ingredient heuristic: {e}", file=sys.stderr)
        return _ingredient_based_probability(ingredients_text)
