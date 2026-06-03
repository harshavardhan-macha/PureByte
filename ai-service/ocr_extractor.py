"""OCR module: extracts text from label images and parses ingredient lists."""

from __future__ import annotations

import io
import re

import numpy as np
from PIL import Image

_ocr_engine = None


def _get_ocr_engine():
    global _ocr_engine
    if _ocr_engine is None:
        from rapidocr_onnxruntime import RapidOCR

        _ocr_engine = RapidOCR()
    return _ocr_engine


def _image_bytes_to_numpy(image_bytes: bytes) -> np.ndarray:
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return np.array(pil_img)


def _run_ocr(image_bytes: bytes) -> str:
    engine = _get_ocr_engine()
    image = _image_bytes_to_numpy(image_bytes)
    result, _ = engine(image)
    if not result:
        return ""
    lines = [item[1] for item in result if len(item) > 1 and item[1]]
    return "\n".join(lines)


def _parse_ingredients(raw_text: str) -> list[str]:
    text = raw_text.replace("\r", "\n").strip()

    section = text
    match = re.search(r"(?is)ingredients?\s*[:\-\.]?\s*(.+)", text)
    if match:
        section = match.group(1).strip()
    elif re.search(r"(?i)ingredients?", text):
        section = re.split(r"(?i)ingredients?\s*[:\-\.]?", text, maxsplit=1)[-1].strip()

    # Merge line breaks into comma-separated list for OCR layouts
    section = re.sub(r"\n+", ", ", section)
    section = re.sub(
        r"(?i)\s*(contains|allergen|nutrition|net wt|best before|expiry|manufactured).*$",
        "",
        section,
    ).strip()
    normalized = re.sub(r"\s+", " ", section).strip()
    section = normalized

    # Split on commas, semicolons, bullets, and numbered lists
    parts = re.split(r"[,;•·]|\d+\.\s*", section)
    ingredients: list[str] = []
    seen: set[str] = set()

    for part in parts:
        cleaned = re.sub(r"[^a-zA-Z0-9\s\-\(\)%\.]", " ", part).strip()
        cleaned = re.sub(r"\s+", " ", cleaned)
        if len(cleaned) < 2:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        ingredients.append(cleaned)

    return ingredients[:40]


def extract_from_label(image_bytes: bytes) -> dict:
    raw_text = _run_ocr(image_bytes)
    ingredients = _parse_ingredients(raw_text)

    return {
        "raw_text": raw_text,
        "ingredients": ingredients,
        "ocr_success": bool(raw_text.strip()),
    }
