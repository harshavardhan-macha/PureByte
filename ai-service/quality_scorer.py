"""Quality scoring model: maps safety + spoilage analysis to score 0-10 and verdict."""

from __future__ import annotations


def compute_quality_score(
    safety: dict,
    spoilage: dict,
    *,
    analysis_mode: str = "both",
) -> dict:
    combined_risk = float(safety.get("combined_risk", 0.0))
    spoilage_score = float(spoilage.get("score", 0.0))
    spoilage_detected = bool(spoilage.get("detected", False))
    critical = bool(safety.get("critical", False))

    # Quality score: 10 = best, 0 = worst
    raw_score = 10.0 * (1.0 - combined_risk)
    if spoilage_detected and spoilage_score >= 0.35:
        raw_score -= 1.5
    if critical:
        raw_score -= 2.0

    score = round(max(0.0, min(10.0, raw_score)), 1)

    # Binary verdict per product requirements
    unsafe_reasons: list[str] = []
    if analysis_mode in ("both", "food_only") and spoilage_detected and spoilage_score >= 0.45:
        unsafe_reasons.append("Visual spoilage indicators")
    if analysis_mode in ("both", "label_only") and float(safety.get("ingredient_risk", 0.0)) >= 0.5:
        unsafe_reasons.append("High-risk ingredients")
    if score < 4.0:
        unsafe_reasons.append("Quality score below safety threshold")
    if critical:
        unsafe_reasons.append("Critical safety risk detected")

    verdict = "Unsafe" if unsafe_reasons else "Safe"

    confidence_by_mode = {"both": 0.9, "food_only": 0.82, "label_only": 0.85}
    confidence = confidence_by_mode.get(analysis_mode, 0.8)
    if not safety.get("flags"):
        confidence -= 0.05
    if analysis_mode != "food_only" and "Could not read label" in " ".join(
        safety.get("flags", [])
    ):
        confidence -= 0.2
    confidence = round(max(0.45, min(0.95, confidence)), 3)

    flags = list(dict.fromkeys(safety.get("flags", []) + spoilage.get("flags", [])))
    if unsafe_reasons:
        flags = list(dict.fromkeys(flags + unsafe_reasons))

    return {
        "score": score,
        "verdict": verdict,
        "confidence": confidence,
        "flags": flags,
        "unsafe_reasons": unsafe_reasons,
    }
