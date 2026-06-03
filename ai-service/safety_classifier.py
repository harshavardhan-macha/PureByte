"""Safety classifier: fuses ingredient risks with spoilage signals."""

from __future__ import annotations

import re

# High-risk additives and preservatives (non-exhaustive rule set)
HIGH_RISK_PATTERNS: list[tuple[str, str, float]] = [
    (r"\bbha\b|\bbutylated hydroxyanisole\b", "BHA preservative", 0.35),
    (r"\bbht\b|\bbutylated hydroxytoluene\b", "BHT preservative", 0.35),
    (r"\bpotassium bromate\b", "Potassium bromate", 0.55),
    (r"\bsodium nitrite\b|\bsodium nitrate\b", "Nitrite/nitrate preservative", 0.4),
    (r"\bpartially hydrogenated\b", "Partially hydrogenated oils", 0.45),
    (r"\bhigh fructose corn syrup\b|\bhfcs\b", "High fructose corn syrup", 0.2),
    (r"\bred\s*40\b|\byellow\s*5\b|\byellow\s*6\b|\btartrazine\b", "Artificial color additive", 0.25),
    (r"\btitanium dioxide\b", "Titanium dioxide", 0.3),
    (r"\bpropylene glycol\b", "Propylene glycol", 0.25),
    (r"\bformaldehyde\b", "Formaldehyde", 0.9),
    (r"\btrans fat\b", "Trans fat", 0.5),
]

MODERATE_RISK_PATTERNS: list[tuple[str, str, float]] = [
    (r"\bmonosodium glutamate\b|\bmsg\b", "MSG", 0.15),
    (r"\baspartame\b|\bsucralose\b|\bsaccharin\b", "Artificial sweetener", 0.12),
    (r"\bsodium benzoate\b|\bpotassium sorbate\b", "Synthetic preservative", 0.12),
    (r"\bcarrageenan\b", "Carrageenan", 0.1),
    (r"\bpalm oil\b", "Palm oil", 0.08),
    (r"\bcorn syrup\b", "Corn syrup", 0.1),
    (r"\bdextrose\b", "Added sugar (dextrose)", 0.08),
]

ALLERGEN_PATTERNS: list[tuple[str, str]] = [
    (r"\bpeanut", "Peanuts"),
    (r"\btree nut|almond|walnut|cashew|hazelnut", "Tree nuts"),
    (r"\bmilk|lactose|whey|casein", "Dairy"),
    (r"\begg\b", "Eggs"),
    (r"\bsoy\b", "Soy"),
    (r"\bwheat|gluten", "Gluten/wheat"),
    (r"\bshellfish|shrimp|crab|lobster", "Shellfish"),
    (r"\bsesame\b", "Sesame"),
]


def _match_patterns(text: str, patterns: list[tuple[str, str, float]]) -> tuple[list[str], float]:
    flags: list[str] = []
    risk = 0.0
    for pattern, label, weight in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            flags.append(label)
            risk = max(risk, weight)
    return flags, risk


def classify_safety(
    ingredients: list[str],
    spoilage: dict,
    ocr_success: bool,
    *,
    has_food_image: bool = True,
    has_label_image: bool = True,
) -> dict:
    combined_text = " ".join(ingredients).lower()
    flags: list[str] = []
    ingredient_risk = 0.0

    high_flags, high_risk = _match_patterns(combined_text, HIGH_RISK_PATTERNS)
    mod_flags, mod_risk = _match_patterns(combined_text, MODERATE_RISK_PATTERNS)
    flags.extend(high_flags)
    flags.extend(mod_flags)
    ingredient_risk = max(high_risk, mod_risk * 0.85)

    allergen_flags = []
    for pattern, label in ALLERGEN_PATTERNS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            allergen_flags.append(f"Contains {label}")
    flags.extend(allergen_flags[:5])

    spoilage_score = float(spoilage.get("score", 0.0)) if has_food_image else 0.0
    spoilage_detected = bool(spoilage.get("detected", False)) if has_food_image else False
    spoilage_risk = spoilage_score
    if spoilage_detected:
        flags.extend(spoilage.get("flags", []))

    if has_label_image:
        if not ingredients and not ocr_success:
            flags.append("Could not read label — manual review recommended")
            ingredient_risk = max(ingredient_risk, 0.35)
        elif not ingredients and ocr_success:
            flags.append("No ingredient list parsed from label")
            ingredient_risk = max(ingredient_risk, 0.25)

    if has_food_image and has_label_image:
        combined_risk = max(
            spoilage_risk,
            ingredient_risk,
            spoilage_risk * 0.6 + ingredient_risk * 0.4,
        )
    elif has_food_image:
        combined_risk = spoilage_risk
    else:
        combined_risk = ingredient_risk

    if combined_risk >= 0.65:
        risk_level = "high"
    elif combined_risk >= 0.35:
        risk_level = "medium"
    else:
        risk_level = "low"

    critical = spoilage_detected and spoilage_score >= 0.5
    critical = critical or ingredient_risk >= 0.5

    return {
        "risk_level": risk_level,
        "ingredient_risk": round(ingredient_risk, 3),
        "spoilage_risk": round(spoilage_risk, 3),
        "combined_risk": round(float(combined_risk), 3),
        "critical": critical,
        "flags": list(dict.fromkeys(flags)),
    }
