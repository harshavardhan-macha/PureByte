from fastapi import APIRouter, Depends, UploadFile, File, Form
from datetime import datetime

from app.models.schemas import AnalyzeTextRequest, AnalyzeResponse
from app.services.scoring_engine import analyze_ingredients
from app.services.text_extractor import extract_text_from_image
from app.auth import get_current_user
from app.database import users_collection, scans_collection
from bson import ObjectId

router = APIRouter(prefix="/api/scan", tags=["scan"])


def _get_user_conditions(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return []
    return user.get("healthProfile", {}).get("conditions", [])


def _save_scan(user_id: str, product_name, result: dict):
    doc = {
        "userId": user_id,
        "productName": product_name,
        "createdAt": datetime.utcnow(),
        **result,
    }
    inserted = scans_collection.insert_one(doc)
    return str(inserted.inserted_id)


@router.post("/analyze-text", response_model=AnalyzeResponse)
def analyze_text(payload: AnalyzeTextRequest, user=Depends(get_current_user)):
    """Paste-ingredients flow (frontend: /scan text tab)."""
    conditions = _get_user_conditions(user["id"])
    result = analyze_ingredients(payload.ingredientsText, conditions)
    _save_scan(user["id"], payload.productName, result)
    return {"productName": payload.productName, **result}


@router.post("/analyze-image", response_model=AnalyzeResponse)
async def analyze_image(
    file: UploadFile = File(...),
    productName: str = Form(None),
    user=Depends(get_current_user),
):
    """Photo-of-label flow (frontend: /scan photo tab). Runs OCR then the same pipeline."""
    image_bytes = await file.read()
    raw_text = extract_text_from_image(image_bytes)
    conditions = _get_user_conditions(user["id"])
    result = analyze_ingredients(raw_text, conditions)
    _save_scan(user["id"], productName, result)
    return {"productName": productName, **result}
