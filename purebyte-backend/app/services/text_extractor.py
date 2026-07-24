import io
import re
from typing import List

import pytesseract
from PIL import Image

from app.config import TESSERACT_CMD

if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def extract_text_from_image(image_bytes: bytes) -> str:
    """OCR an uploaded label photo into raw text."""
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != "RGB":
        image = image.convert("RGB")
    text = pytesseract.image_to_string(image)
    return text


def isolate_ingredients_section(raw_text: str) -> str:
    """
    Labels often contain nutrition facts, allergen warnings, barcodes, etc.
    Try to isolate just the 'Ingredients: ...' section if present, otherwise
    fall back to the full text.
    """
    match = re.search(r"ingredients?\s*[:\-]\s*(.+)", raw_text, re.IGNORECASE | re.DOTALL)
    if match:
        return match.group(1)
    return raw_text


def tokenize_ingredients(text: str) -> List[str]:
    """
    Split an ingredients string into individual normalized ingredient tokens.
    Handles commas, semicolons, and nested parentheses like
    'natural flavors (contains soy, wheat)'.
    """
    # Flatten parentheses content back into the comma-separated stream
    text = text.replace("(", ",").replace(")", ",")
    text = re.sub(r"[\n\r]+", " ", text)
    raw_tokens = re.split(r"[,;]", text)

    tokens = []
    for token in raw_tokens:
        cleaned = token.strip().lower()
        cleaned = re.sub(r"[%*]+$", "", cleaned).strip()
        cleaned = re.sub(r"^\d+\.?\d*\s*(mg|g|ml)\s+", "", cleaned)
        cleaned = cleaned.rstrip(".").strip()
        if cleaned and len(cleaned) > 1:
            tokens.append(cleaned)
    return tokens
