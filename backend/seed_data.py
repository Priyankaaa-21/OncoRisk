"""
Seeds demo user account and realistic historical cancer assessments
for immediate evaluation and testing of user dashboard and trend charts.
"""

import json
from datetime import datetime, timedelta
from backend.database import SessionLocal, init_db, User, Assessment
from backend.auth import hash_password

def seed_demo_data():
    init_db()
    db = SessionLocal()
    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == "demo@oncorisk.org").first()
        if existing_user:
            print("Demo user 'demo@oncorisk.org' already exists.")
            return

        demo_user = User(
            email="demo@oncorisk.org",
            hashed_password=hash_password("DemoPassword123!"),
            full_name="Alex Morgan",
            created_at=datetime.utcnow() - timedelta(days=180)
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        print(f"Created demo user with ID: {demo_user.id}")

        # Seed realistic historical assessments spaced out over 6 months
        sample_assessments = [
            {
                "cancer_type": "lung",
                "days_ago": 150,
                "risk_percentage": 58.4,
                "risk_category": "Moderate",
                "confidence_level": 89.5,
                "algorithm": "XGBoost",
                "inputs": {
                    "age": 52,
                    "smoking_status": 2,
                    "smoking_years": 20,
                    "packs_per_day": 1.2,
                    "occupational_exposure": 0,
                    "air_pollution_level": 1,
                    "chronic_cough": 1,
                    "shortness_of_breath": 0,
                    "chest_pain": 0,
                    "family_history_lung": 0
                },
                "factors": [
                    {"feature": "smoking_status", "label": "Current Smoker", "weight": 28.5, "direction": "increases_risk", "user_value": 2, "description": "Active smoking is the primary elevated risk contributor."},
                    {"feature": "smoking_years", "label": "Years Smoked (20 yrs)", "weight": 22.0, "direction": "increases_risk", "user_value": 20, "description": "Substantial duration of exposure."},
                    {"feature": "chronic_cough", "label": "Persistent Cough", "weight": 18.2, "direction": "increases_risk", "user_value": 1, "description": "Reported respiratory symptom."}
                ],
                "recommendations": {
                    "lifestyle_modifications": ["Enroll in an evidence-based smoking cessation program.", "Avoid secondhand smoke and aerosol irritants."],
                    "screening_tests": [{"test": "Low-Dose CT (LDCT) Scan", "frequency": "Annual", "reason": "Meets 20+ pack-year criteria."}],
                    "doctor_consultation": "Discuss your persistent cough and screening eligibility with your physician.",
                    "urgent_red_flags": ["Hemoptysis (coughing blood)", "Unexplained weight loss"]
                },
                "explanation_en": "Your initial lung cancer assessment in May placed you in the Moderate Risk range (58.4%), primarily due to current cigarette smoking and 20 cumulative pack-years.",
                "explanation_hi": "मई में आपके फेफड़ों के कैंसर के शुरुआती आकलन में जोखिम मध्यम (58.4%) था, जिसका मुख्य कारण धूम्रपान और 20 वर्षों का इतिहास था।"
            },
            {
                "cancer_type": "lung",
                "days_ago": 75,
                "risk_percentage": 39.2,
                "risk_category": "Moderate",
                "confidence_level": 91.0,
                "algorithm": "XGBoost",
                "inputs": {
                    "age": 52,
                    "smoking_status": 1,
                    "smoking_years": 20,
                    "packs_per_day": 0.0,
                    "occupational_exposure": 0,
                    "air_pollution_level": 1,
                    "chronic_cough": 0,
                    "shortness_of_breath": 0,
                    "chest_pain": 0,
                    "family_history_lung": 0
                },
                "factors": [
                    {"feature": "smoking_status", "label": "Former Smoker (Quit)", "weight": 22.0, "direction": "decreases_risk", "user_value": 1, "description": "Smoking cessation lowered risk substantially."},
                    {"feature": "smoking_years", "label": "Historical Pack-Years", "weight": 19.5, "direction": "increases_risk", "user_value": 20, "description": "Past exposure still carries residual risk."}
                ],
                "recommendations": {
                    "lifestyle_modifications": ["Continue smoke-free status to progressively reduce long-term cardiovascular and oncologic risks."],
                    "screening_tests": [{"test": "Low-Dose CT (LDCT) Scan", "frequency": "Annual", "reason": "USPSTF former smoker screening criteria."}],
                    "doctor_consultation": "Great progress quitting smoking; maintain annual follow-up.",
                    "urgent_red_flags": ["New or worsening shortness of breath", "Hemoptysis"]
                },
                "explanation_en": "Your 3-month follow-up showed a drop to 39.2% risk following smoking cessation and resolution of your persistent cough.",
                "explanation_hi": "3 महीने बाद के फॉलो-अप में जोखिम घटकर 39.2% हो गया क्योंकि आपने धूम्रपान बंद कर दिया था।"
            },
            {
                "cancer_type": "colorectal",
                "days_ago": 30,
                "risk_percentage": 22.5,
                "risk_category": "Low",
                "confidence_level": 94.2,
                "algorithm": "Logistic Regression",
                "inputs": {
                    "age": 52,
                    "family_history_crc": 0,
                    "ibd_history": 0,
                    "personal_polyps": 0,
                    "red_meat_frequency": 0,
                    "fiber_intake": 0,
                    "physical_inactivity": 0,
                    "rectal_bleeding_symptom": 0
                },
                "factors": [
                    {"feature": "fiber_intake", "label": "High Dietary Fiber", "weight": 24.1, "direction": "decreases_risk", "user_value": 0, "description": "Beneficial high-fiber diet protects colonic mucosa."},
                    {"feature": "physical_inactivity", "label": "Active Lifestyle", "weight": 18.3, "direction": "decreases_risk", "user_value": 0, "description": "Regular exercise aids digestive motility."},
                    {"feature": "age", "label": "Age 52", "weight": 14.5, "direction": "increases_risk", "user_value": 52, "description": "Age > 45 indicates recommended baseline screening."}
                ],
                "recommendations": {
                    "lifestyle_modifications": ["Maintain generous dietary fiber (whole grains, beans, greens) and keep red meat intake low."],
                    "screening_tests": [{"test": "Screening Colonoscopy or Annual FIT", "frequency": "Every 10 years for colonoscopy", "reason": "Standard screening starting at age 45."}],
                    "doctor_consultation": "Discuss scheduling your baseline age-45 colonoscopy or FIT kit with your primary doctor.",
                    "urgent_red_flags": ["Rectal bleeding", "Unexplained change in bowel habits"]
                },
                "explanation_en": "Your colorectal risk assessment was Low (22.5%), supported by your active lifestyle and high fiber diet.",
                "explanation_hi": "सक्रिय जीवनशैली और उच्च फाइबर आहार के कारण आपका कोलोरेक्टल जोखिम कम (22.5%) आंका गया।"
            },
            {
                "cancer_type": "skin",
                "days_ago": 5,
                "risk_percentage": 18.2,
                "risk_category": "Low",
                "confidence_level": 95.0,
                "algorithm": "Logistic Regression",
                "inputs": {
                    "age": 52,
                    "skin_type": 3,
                    "severe_sunburns": 1,
                    "tanning_bed_use": 0,
                    "mole_count": 1,
                    "family_history_melanoma": 0,
                    "asymmetry": 0,
                    "border_irregularity": 0,
                    "color_variation": 0,
                    "diameter_over_6mm": 0,
                    "evolution": 0
                },
                "factors": [
                    {"feature": "evolution", "label": "No Mole Changes", "weight": 32.0, "direction": "decreases_risk", "user_value": 0, "description": "Stable lesions indicate benign progression."},
                    {"feature": "tanning_bed_use", "label": "Never Used Tanning Beds", "weight": 21.0, "direction": "decreases_risk", "user_value": 0, "description": "Zero exposure to artificial high-intensity UV."}
                ],
                "recommendations": {
                    "lifestyle_modifications": ["Apply daily SPF 30+ broad spectrum sunscreen.", "Wear sunglasses and protective hats during midday sun."],
                    "screening_tests": [{"test": "Annual Skin Check", "frequency": "Once per year", "reason": "Routine dermatologic wellness check."}],
                    "doctor_consultation": "Your skin risk is Low; continue monthly self-monitoring using the ABCDE rule.",
                    "urgent_red_flags": ["Rapidly growing mole", "Spontaneous lesion bleeding"]
                },
                "explanation_en": "Your skin risk score was 18.2% (Low Risk), reflecting symmetric moles with no evolving changes.",
                "explanation_hi": "तिल में कोई बदलाव न होने और सामान्य आकार के कारण आपकी त्वचा का जोखिम 18.2% (कम) आंका गया।"
            }
        ]

        for s in sample_assessments:
            assessment = Assessment(
                user_id=demo_user.id,
                cancer_type=s["cancer_type"],
                risk_percentage=s["risk_percentage"],
                risk_category=s["risk_category"],
                confidence_level=s["confidence_level"],
                algorithm_used=s["algorithm"],
                inputs_data=json.dumps(s["inputs"]),
                contributing_factors=json.dumps(s["factors"]),
                recommendations=json.dumps(s["recommendations"]),
                explanation_en=s["explanation_en"],
                explanation_hi=s["explanation_hi"],
                has_consented=True,
                created_at=datetime.utcnow() - timedelta(days=s["days_ago"])
            )
            db.add(assessment)

        db.commit()
        print(f"Seeded {len(sample_assessments)} historical assessments for demo user!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
