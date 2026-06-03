"""End-to-end analysis pipeline for PureByte."""

from __future__ import annotations

from ocr_extractor import extract_from_label
from quality_scorer import compute_quality_score
from safety_classifier import classify_safety
from spoilage_detector import detect_spoilage


def _empty_spoilage() -> dict:
    return {
        "detected": False,
        "score": 0.0,
        "confidence": 0.0,
        "flags": [],
        "skipped": True,
    }


def _empty_ocr() -> dict:
    return {
        "raw_text": "",
        "ingredients": [],
        "ocr_success": False,
        "skipped": True,
    }


def run_pipeline(
    food_image_bytes: bytes | None = None,
    label_image_bytes: bytes | None = None,
) -> dict:
    has_food = food_image_bytes is not None and len(food_image_bytes) > 0
    has_label = label_image_bytes is not None and len(label_image_bytes) > 0

    if not has_food and not has_label:
        raise ValueError("At least one of food_image or label_image is required")

    if has_food and has_label:
        analysis_mode = "both"
    elif has_food:
        analysis_mode = "food_only"
    else:
        analysis_mode = "label_only"

    spoilage = detect_spoilage(food_image_bytes) if has_food else _empty_spoilage()
    if has_food:
        spoilage["skipped"] = False

    ocr_result = extract_from_label(label_image_bytes) if has_label else _empty_ocr()
    if has_label:
        ocr_result["skipped"] = False

    safety = classify_safety(
        ocr_result["ingredients"],
        spoilage,
        ocr_result["ocr_success"],
        has_food_image=has_food,
        has_label_image=has_label,
    )
    quality = compute_quality_score(safety, spoilage, analysis_mode=analysis_mode)

    return {
        "score": quality["score"],
        "verdict": quality["verdict"],
        "confidence": quality["confidence"],
        "flags": quality["flags"],
        "analysis_mode": analysis_mode,
        "spoilage": spoilage,
        "ocr": {
            "raw_text": ocr_result["raw_text"],
            "success": ocr_result["ocr_success"],
            "skipped": ocr_result.get("skipped", False),
        },
        "ingredients": ocr_result["ingredients"],
        "safety": {
            "risk_level": safety["risk_level"],
            "ingredient_risk": safety["ingredient_risk"],
            "spoilage_risk": safety["spoilage_risk"],
            "combined_risk": safety["combined_risk"],
            "critical": safety["critical"],
            "flags": safety["flags"],
        },
        "unsafe_reasons": quality.get("unsafe_reasons", []),
    }
