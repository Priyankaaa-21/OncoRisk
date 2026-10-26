import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert len(data["loaded_models"]) == 6
    print("✓ Health check passed")


def test_model_metrics():
    res = client.get("/api/model-metrics")
    assert res.status_code == 200
    data = res.json()
    assert "breast" in data
    assert "lung" in data
    assert "cervical" in data
    assert "skin" in data
    assert "colorectal" in data
    assert "prostate" in data
    print("✓ Model metrics endpoint passed")


def test_predictions():
    # Breast
    res_b = client.post("/api/predict/breast", json={
        "consent": True,
        "age": 48,
        "bmi": 26.2,
        "age_menarche": 13,
        "pregnancies": 2,
        "breastfeeding_months": 12,
        "hrt_years": 0,
        "family_history_breast": 0,
        "alcohol_drinks_week": 1,
        "physical_activity_hours": 4.0
    })
    assert res_b.status_code == 200
    data_b = res_b.json()
    assert "risk_percentage" in data_b
    assert data_b["risk_category"] in ["Low", "Moderate", "High"]
    assert len(data_b["contributing_factors"]) > 0
    assert "explanation_hi" in data_b
    print("✓ Breast prediction passed")

    # Lung
    res_l = client.post("/api/predict/lung", json={
        "consent": True,
        "age": 60,
        "smoking_status": 2,
        "smoking_years": 25,
        "packs_per_day": 1.5,
        "occupational_exposure": 1,
        "air_pollution_level": 1,
        "chronic_cough": 1,
        "shortness_of_breath": 0,
        "chest_pain": 0,
        "family_history_lung": 0
    })
    assert res_l.status_code == 200
    print("✓ Lung prediction passed")

    # Skin (JSON)
    res_s = client.post("/api/predict/skin", json={
        "consent": True,
        "age": 45,
        "skin_type": 2,
        "severe_sunburns": 3,
        "tanning_bed_use": 1,
        "mole_count": 1,
        "family_history_melanoma": 0,
        "asymmetry": 1,
        "border_irregularity": 1,
        "color_variation": 1,
        "diameter_over_6mm": 1,
        "evolution": 0
    })
    assert res_s.status_code == 200
    print("✓ Skin prediction passed")


def test_chat_rag():
    res = client.post("/api/chat", json={
        "message": "When should women start getting mammograms according to ACS?"
    })
    assert res.status_code == 200
    data = res.json()
    assert len(data["citations"]) > 0
    assert "mammogram" in data["answer"].lower() or "breast" in data["answer"].lower()
    print("✓ Chatbot RAG passed")

    # Test refusal guardrail
    res_refusal = client.post("/api/chat", json={
        "message": "Can you diagnose if my lump is malignant cancer?"
    })
    assert res_refusal.status_code == 200
    assert "cannot provide a medical diagnosis" in res_refusal.json()["answer"].lower()
    print("✓ Diagnostic refusal guardrail passed")


def test_auth_and_history():
    # Login demo user
    res_login = client.post("/api/auth/login", json={
        "email": "demo@oncorisk.org",
        "password": "DemoPassword123!"
    })
    assert res_login.status_code == 200
    token = res_login.json()["access_token"]

    # History
    res_hist = client.get("/api/assessments/history", headers={"Authorization": f"Bearer {token}"})
    assert res_hist.status_code == 200
    hist_data = res_hist.json()
    assert len(hist_data["assessments"]) >= 4
    assert len(hist_data["trend_data"]) >= 4
    print("✓ Auth & History tracking passed")


if __name__ == "__main__":
    test_health()
    test_model_metrics()
    test_predictions()
    test_chat_rag()
    test_auth_and_history()
    print("\nALL BACKEND INTEGRATION TESTS PASSED PERFECTLY!")
