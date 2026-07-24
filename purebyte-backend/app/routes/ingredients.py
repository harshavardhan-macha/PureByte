from fastapi import APIRouter, Depends
from app.auth import get_current_user
# Import your ingredients collection
from app.database import users_collection, ingredients_collection 
from app.models.schemas import HealthProfile
from bson import ObjectId

router = APIRouter(prefix="/api", tags=["ingredients"])


@router.get("/ingredients")
def list_ingredients(q: str = None, severity: str = None):
    """Frontend: /ingredients browse page. Optional ?q= search from MongoDB."""
    query = {}

    if q:
        search_regex = {"$regex": q, "$options": "i"}
        query["$or"] = [
            {"name": search_regex},
            {"aliases": search_regex},
        ]

    if severity and severity in ("high", "medium", "low"):
        query["severity"] = severity
    
    # Fetch from MongoDB (excluding the MongoDB '_id' field so FastAPI can serialize it cleanly)
    cursor = ingredients_collection.find(query, {"_id": 0})
    items = list(cursor)
    
    return {"items": items, "count": len(items)}


@router.get("/ingredients/{name}")
def get_ingredient(name: str):
    """Fetch a single ingredient from MongoDB by name (case-insensitive)."""
    # Find matching ingredient in MongoDB
    ingredient = ingredients_collection.find_one(
        {"name": {"$regex": f"^{name}$", "$options": "i"}}, 
        {"_id": 0}
    )
    
    if not ingredient:
        return {"error": "Not found"}
        
    return ingredient


@router.put("/users/health-profile")
def update_health_profile(payload: HealthProfile, user=Depends(get_current_user)):
    """Lets a logged-in user set conditions like ['diabetes','hypertension']
    and allergies like ['peanut','shellfish'] used to personalize every scan."""
    users_collection.update_one(
        {"_id": ObjectId(user["id"])},
        {"$set": {"healthProfile": payload.model_dump()}},
        upsert=False,
    )
    return {"success": True, "healthProfile": payload.model_dump()}


@router.get("/users/health-profile")
def get_health_profile(user=Depends(get_current_user)):
    doc = users_collection.find_one({"_id": ObjectId(user["id"])})
    return (doc or {}).get("healthProfile", {"conditions": [], "allergies": [], "notes": None})
