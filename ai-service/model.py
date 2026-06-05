"""
Optional model-loading utilities.

Keep this file if/when you train a custom ML model (e.g. scikit-learn + joblib).
The current service uses rule-based scoring in scorer.py.
"""


def predict_quality_from_model(_features: dict) -> dict | None:
    return None
