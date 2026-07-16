from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.database import scans_collection

router = APIRouter(prefix="/api/scan", tags=["history"])


@router.get("/history")
def get_history(user=Depends(get_current_user), limit: int = 20, skip: int = 0):
    cursor = (
        scans_collection.find({"userId": user["id"]})
        .sort("createdAt", -1)
        .skip(skip)
        .limit(limit)
    )
    items = []
    for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        items.append(doc)
    return {"items": items, "count": len(items)}


@router.delete("/history/{scan_id}")
def delete_scan(scan_id: str, user=Depends(get_current_user)):
    from bson import ObjectId
    result = scans_collection.delete_one({"_id": ObjectId(scan_id), "userId": user["id"]})
    if result.deleted_count == 0:
        return {"error": "Not found"}
    return {"success": True}


@router.get("/history/{scan_id}")
def get_scan(scan_id: str, user=Depends(get_current_user)):
    from bson import ObjectId
    doc = scans_collection.find_one({"_id": ObjectId(scan_id), "userId": user["id"]})
    if not doc:
        return {"error": "Not found"}
    doc["id"] = str(doc.pop("_id"))
    return doc
