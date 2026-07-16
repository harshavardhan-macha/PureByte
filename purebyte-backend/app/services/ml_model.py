import os
import joblib
import sys
from app.config import MODEL_PATH, VECTORIZER_PATH

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
            print(f"Error loading model or vectorizer: {e}", file=sys.stderr)
            raise
    else:
        print(f"Model or vectorizer not found: {MODEL_PATH}, {VECTORIZER_PATH}", file=sys.stderr)
    _loaded = True


def predict_unsafe_probability(ingredients_text: str) -> float:
    """
    Returns the logistic regression's predicted probability (0-1) that this
    ingredient list belongs to the "unsafe / ultra-processed" class, based on
    ml/train_model.py. Falls back to a neutral 0.5 if the model hasn't been
    trained yet (run ml/train_model.py first), so the API never crashes.
    """
    _load()
    if _model is None or _vectorizer is None:
        return 0.5

    X = _vectorizer.transform([ingredients_text.lower()])
    proba = _model.predict_proba(X)[0]
    # class 1 = "unsafe / ultra-processed"
    return float(proba[1])
