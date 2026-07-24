from fastapi import APIRouter
from app.database import scans_collection, users_collection

router = APIRouter(prefix="/api/community", tags=["community"])


@router.get("/stats")
def get_community_stats():
    active_members = users_collection.count_documents({})
    scans_count = scans_collection.count_documents({})

    return {
        "activeMembers": active_members,
        "foodsDetected": scans_count,
        "mealsAnalyzed": scans_count,
        "sharedExperiences": scans_count,
    }
