from typing import List, Dict, Any

from app.services.risk_database import FLAGGED_INGREDIENTS, SEVERITY_DEDUCTION, lookup_all_names
from app.services.text_extractor import isolate_ingredients_section, tokenize_ingredients
from app.services.ml_model import predict_unsafe_probability

# How much weight the deterministic rule-engine vs the ML model gets in the
# final blended score. Rule-based stays dominant so the score stays
# explainable ("Deterministic Score" per the product's own description).
RULE_WEIGHT = 0.7
ML_WEIGHT = 0.3


def find_flagged_ingredients(tokens: List[str]) -> List[Dict[str, Any]]:
    name_map = lookup_all_names()
    flagged = []
    seen_canonical = set()

    for token in tokens:
        for alias, canonical in name_map.items():
            if alias in token and canonical not in seen_canonical:
                meta = FLAGGED_INGREDIENTS[canonical]
                flagged.append({
                    "ingredient": canonical,
                    "matchedText": token,
                    "severity": meta["severity"],
                    "reason": meta["reason"],
                    "relatedConditions": meta["conditions"],
                    "deduction": SEVERITY_DEDUCTION[meta["severity"]],
                })
                seen_canonical.add(canonical)
    return flagged


def compute_rule_based_score(flagged: List[Dict[str, Any]]) -> int:
    score = 100
    for item in flagged:
        score -= item["deduction"]
    return max(score, 0)


def build_personalized_warnings(flagged: List[Dict[str, Any]], user_conditions: List[str]) -> List[Dict[str, str]]:
    if not user_conditions:
        return []
    user_conditions_set = {c.lower() for c in user_conditions}
    warnings = []
    for item in flagged:
        overlap = user_conditions_set.intersection(set(item["relatedConditions"]))
        for condition in overlap:
            warnings.append({
                "condition": condition,
                "ingredient": item["ingredient"],
                "message": f"Contains {item['ingredient']}, which is a concern for {condition.replace('_', ' ')}: {item['reason']}",
            })
    return warnings


def analyze_ingredients(raw_text: str, user_conditions: List[str] = None) -> Dict[str, Any]:
    user_conditions = user_conditions or []

    ingredients_section = isolate_ingredients_section(raw_text)
    tokens = tokenize_ingredients(ingredients_section)

    flagged = find_flagged_ingredients(tokens)
    rule_score = compute_rule_based_score(flagged)

    ml_unsafe_prob = predict_unsafe_probability(ingredients_section)
    ml_score = 100 * (1 - ml_unsafe_prob)

    # Extra personalized penalty: each condition-relevant hit nudges the
    # score down further, since it matters more to THIS person than to
    # the general population.
    personalized_warnings = build_personalized_warnings(flagged, user_conditions)
    personalization_penalty = min(len(personalized_warnings) * 5, 25)

    blended = (RULE_WEIGHT * rule_score) + (ML_WEIGHT * ml_score) - personalization_penalty
    final_score = int(max(min(round(blended), 100), 0))

    return {
        "safetyScore": final_score,
        "ruleBasedScore": rule_score,
        "mlUnsafeProbability": round(ml_unsafe_prob, 3),
        "flaggedIngredients": [
            {
                "ingredient": f["ingredient"],
                "severity": f["severity"],
                "reason": f["reason"],
                "relatedConditions": f["relatedConditions"],
                "deduction": f["deduction"],
            }
            for f in flagged
        ],
        "personalizedWarnings": personalized_warnings,
        "totalIngredientsParsed": len(tokens),
    }
