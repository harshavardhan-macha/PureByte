"""Computer vision module: detects visual spoilage signs in food images."""

from __future__ import annotations

import io

import cv2
import numpy as np
from PIL import Image


def _load_bgr(image_bytes: bytes) -> np.ndarray:
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    rgb = np.array(pil_img)
    return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)


def _resize_for_analysis(bgr: np.ndarray, max_side: int = 640) -> np.ndarray:
    h, w = bgr.shape[:2]
    scale = min(1.0, max_side / max(h, w))
    if scale < 1.0:
        bgr = cv2.resize(bgr, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    return bgr


def detect_spoilage(image_bytes: bytes) -> dict:
    """
    Analyze food image for spoilage indicators using color/texture heuristics.
    Returns spoilage_score (0-1), detected flag, confidence, and human-readable flags.
    """
    bgr = _resize_for_analysis(_load_bgr(image_bytes))
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    total_pixels = bgr.shape[0] * bgr.shape[1]
    flags: list[str] = []
    signals: list[float] = []

    # Mold-like green / blue-green regions
    mold_mask = cv2.inRange(hsv, (35, 40, 30), (95, 255, 255))
    mold_ratio = float(np.count_nonzero(mold_mask)) / total_pixels
    if mold_ratio > 0.02:
        flags.append("Possible mold discoloration")
        signals.append(min(1.0, mold_ratio * 12))

    # Dark brown / black decay spots
    decay_mask = cv2.inRange(hsv, (0, 30, 0), (25, 255, 80))
    decay_ratio = float(np.count_nonzero(decay_mask)) / total_pixels
    if decay_ratio > 0.04:
        flags.append("Dark decay spots detected")
        signals.append(min(1.0, decay_ratio * 8))

    # Unusual dullness / low saturation (wilted, oxidized produce)
    sat = hsv[:, :, 1].astype(np.float32)
    low_sat_ratio = float(np.mean(sat < 35))
    if low_sat_ratio > 0.45:
        flags.append("Low freshness color profile")
        signals.append(min(1.0, (low_sat_ratio - 0.45) * 4))

    # Texture irregularity (fuzzy / patchy spoilage)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    if laplacian_var > 900:
        flags.append("Uneven surface texture")
        signals.append(min(1.0, (laplacian_var - 900) / 2500))

    # Whitish fuzzy patches (high L, low chroma in LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)
    fuzzy_mask = (l_channel > 175) & (np.abs(a_channel.astype(int) - 128) < 12) & (
        np.abs(b_channel.astype(int) - 128) < 12
    )
    fuzzy_ratio = float(np.count_nonzero(fuzzy_mask)) / total_pixels
    if fuzzy_ratio > 0.05:
        flags.append("Whitish fuzzy patches")
        signals.append(min(1.0, fuzzy_ratio * 6))

    spoilage_score = float(np.clip(max(signals) if signals else 0.0, 0.0, 1.0))
    # Boost when multiple independent signals fire
    if len(signals) >= 2:
        spoilage_score = float(np.clip(spoilage_score * 1.15, 0.0, 1.0))

    detected = spoilage_score >= 0.35
    confidence = round(0.55 + spoilage_score * 0.4, 3)

    return {
        "detected": detected,
        "score": round(spoilage_score, 3),
        "confidence": confidence,
        "flags": flags,
    }
