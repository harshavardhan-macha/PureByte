from fastapi.testclient import TestClient
from app.main import app
from app import routes as routes_module


def test_community_stats_endpoint(monkeypatch):
    monkeypatch.setattr(routes_module.community.users_collection, "count_documents", lambda filter=None: 3)
    monkeypatch.setattr(routes_module.community.scans_collection, "count_documents", lambda filter=None: 7)

    client = TestClient(app)
    response = client.get("/api/community/stats")

    assert response.status_code == 200
    assert response.json() == {
        "activeMembers": 3,
        "foodsDetected": 7,
        "mealsAnalyzed": 7,
        "sharedExperiences": 7,
    }
