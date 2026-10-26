"""
FastAPI Main Application for OncoRisk.
Provides RESTful APIs for calibrated cancer risk prediction, mole lesion image analysis,
explainable SHAP-like contributions, RAG health assistant, model evaluation metrics,
user authentication, and privacy data management.
"""

import os
import sys
import json
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

# Ensure both SafeLife root and backend dir are in sys.path
_current_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_current_dir)
if _parent_dir not in sys.path:
    sys.path.insert(0, _parent_dir)
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

try:
    from backend.database import get_db, init_db, User, Assessment
    from backend.auth import (
        hash_password,
        verify_password,
        create_access_token,
        get_current_user,
        get_optional_user,
    )
    from backend.schemas import (
        BreastInput,
        LungInput,
        CervicalInput,
        SkinInput,
        ColorectalInput,
        ProstateInput,
        PredictionResult,
        SkinPredictionResult,
        UserRegister,
        UserLogin,
        TokenResponse,
        UserProfile,
        HistoryResponse,
        AssessmentHistoryItem,
        TrendDataPoint,
        ChatQuery,
        ChatResponse,
    )
    from backend.predictor import (
        predict_cancer_risk,
        analyze_skin_image,
        get_model_metadata,
    )
    from backend.chatbot_rag import generate_rag_response
except ImportError:
    from database import get_db, init_db, User, Assessment
    from auth import (
        hash_password,
        verify_password,
        create_access_token,
        get_current_user,
        get_optional_user,
    )
    from schemas import (
        BreastInput,
        LungInput,
        CervicalInput,
        SkinInput,
        ColorectalInput,
        ProstateInput,
        PredictionResult,
        SkinPredictionResult,
        UserRegister,
        UserLogin,
        TokenResponse,
        UserProfile,
        HistoryResponse,
        AssessmentHistoryItem,
        TrendDataPoint,
        ChatQuery,
        ChatResponse,
    )
    from predictor import (
        predict_cancer_risk,
        analyze_skin_image,
        get_model_metadata,
    )
    from chatbot_rag import generate_rag_response

# Configure minimal privacy-compliant logging (never log sensitive patient inputs)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("oncorisk.api")

app = FastAPI(
    title="OncoRisk API",
    description="AI-powered cancer risk awareness and early screening recommendations platform.",
    version="1.0.0",
)

# CORS Middleware allowing frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()
    logger.info("OncoRisk database initialized.")


# ---------------------------------------------------------------------------
# Health & Model Metrics Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    meta = get_model_metadata()
    return {
        "status": "online",
        "service": "OncoRisk Clinical Intelligence Platform",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "loaded_models": list(meta.keys()) if meta else ["breast", "lung", "cervical", "skin", "colorectal", "prostate"]
    }


@app.get("/api/model-metrics")
def get_metrics():
    """
    Returns accuracy, precision, recall, F1, ROC curve coordinates,
    confusion matrix, and dataset limitations for all algorithms.
    """
    metadata = get_model_metadata()
    if not metadata:
        raise HTTPException(status_code=500, detail="Model metadata is not loaded yet.")
    return metadata


# ---------------------------------------------------------------------------
# Cancer Risk Prediction Endpoints
# ---------------------------------------------------------------------------

def save_assessment_record(
    db: Session,
    user: Optional[User],
    cancer_type: str,
    prediction: dict,
    input_dict: dict,
    has_consented: bool = True
) -> Assessment:
    # Redact any potentially identifying raw metadata before saving
    sanitized_inputs = {k: v for k, v in input_dict.items() if k not in ["consent", "name", "email"]}

    record = Assessment(
        user_id=user.id if user else None,
        cancer_type=cancer_type,
        risk_percentage=prediction["risk_percentage"],
        risk_category=prediction["risk_category"],
        confidence_level=prediction["confidence_level"],
        algorithm_used=prediction["algorithm_used"],
        inputs_data=json.dumps(sanitized_inputs),
        contributing_factors=json.dumps(prediction["contributing_factors"]),
        recommendations=json.dumps(prediction["recommendations"]),
        explanation_en=prediction.get("explanation_en"),
        explanation_hi=prediction.get("explanation_hi"),
        has_consented=has_consented,
        created_at=datetime.now(timezone.utc)
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.post("/api/predict/breast", response_model=PredictionResult)
def predict_breast(
    payload: BreastInput,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required to run assessment.")

    logger.info("Executing breast risk prediction pipeline [patient input redacted for privacy].")
    input_dict = payload.model_dump()
    result = predict_cancer_risk("breast", input_dict)

    record = save_assessment_record(db, user, "breast", result, input_dict, payload.consent)
    result["assessment_id"] = record.id
    result["created_at"] = record.created_at.isoformat()
    return result


@app.post("/api/predict/lung", response_model=PredictionResult)
def predict_lung(
    payload: LungInput,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required to run assessment.")

    logger.info("Executing lung risk prediction pipeline [patient input redacted for privacy].")
    input_dict = payload.model_dump()
    result = predict_cancer_risk("lung", input_dict)

    record = save_assessment_record(db, user, "lung", result, input_dict, payload.consent)
    result["assessment_id"] = record.id
    result["created_at"] = record.created_at.isoformat()
    return result


@app.post("/api/predict/cervical", response_model=PredictionResult)
def predict_cervical(
    payload: CervicalInput,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required to run assessment.")

    logger.info("Executing cervical risk prediction pipeline [patient input redacted for privacy].")
    input_dict = payload.model_dump()
    result = predict_cancer_risk("cervical", input_dict)

    record = save_assessment_record(db, user, "cervical", result, input_dict, payload.consent)
    result["assessment_id"] = record.id
    result["created_at"] = record.created_at.isoformat()
    return result


@app.post("/api/predict/colorectal", response_model=PredictionResult)
def predict_colorectal(
    payload: ColorectalInput,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required to run assessment.")

    logger.info("Executing colorectal risk prediction pipeline [patient input redacted for privacy].")
    input_dict = payload.model_dump()
    result = predict_cancer_risk("colorectal", input_dict)

    record = save_assessment_record(db, user, "colorectal", result, input_dict, payload.consent)
    result["assessment_id"] = record.id
    result["created_at"] = record.created_at.isoformat()
    return result


@app.post("/api/predict/prostate", response_model=PredictionResult)
def predict_prostate(
    payload: ProstateInput,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required to run assessment.")

    logger.info("Executing prostate risk prediction pipeline [patient input redacted for privacy].")
    input_dict = payload.model_dump()
    result = predict_cancer_risk("prostate", input_dict)

    record = save_assessment_record(db, user, "prostate", result, input_dict, payload.consent)
    result["assessment_id"] = record.id
    result["created_at"] = record.created_at.isoformat()
    return result


@app.post("/api/predict/skin", response_model=SkinPredictionResult)
async def predict_skin(
    request: Request,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Accepts either multipart form-data (with optional mole photo upload) or application/json payload.
    """
    content_type = request.headers.get("content-type", "")

    mole_image_bytes = None
    input_dict = {}

    if "multipart/form-data" in content_type:
        form = await request.form()
        for key, value in form.items():
            if key == "mole_image" and hasattr(value, "read"):
                mole_image_bytes = await value.read()
            else:
                try:
                    if "." in str(value):
                        input_dict[key] = float(value)
                    else:
                        input_dict[key] = int(value)
                except ValueError:
                    input_dict[key] = str(value)
    else:
        # JSON body
        input_dict = await request.json()

    consent = bool(input_dict.get("consent", True))
    if not consent:
        raise HTTPException(status_code=400, detail="Consent is required to run assessment.")

    # Clinical ABCDE and demographic risk calculation
    result = predict_cancer_risk("skin", input_dict)

    # Optional image analysis
    image_analysis = {}
    if mole_image_bytes and len(mole_image_bytes) > 100:
        logger.info("Analyzing skin mole image.")
        image_analysis = analyze_skin_image(mole_image_bytes)

        # Blend image visual suspicion with tabular ABCDE score
        img_score = image_analysis.get("visual_suspicion_score", 30.0)
        blended_risk = round(0.70 * result["risk_percentage"] + 0.30 * img_score, 1)
        result["risk_percentage"] = blended_risk
        if blended_risk < 25.0:
            result["risk_category"] = "Low"
        elif blended_risk < 60.0:
            result["risk_category"] = "Moderate"
        else:
            result["risk_category"] = "High"

    record = save_assessment_record(db, user, "skin", result, input_dict, consent)

    response_payload = {
        **result,
        "assessment_id": record.id,
        "created_at": record.created_at.isoformat(),
        "image_analyzed": image_analysis.get("image_analyzed", False),
        "lesion_color_asymmetry": image_analysis.get("color_asymmetry_score"),
        "lesion_border_irregularity_score": image_analysis.get("border_irregularity_score"),
        "visual_suspicion_level": image_analysis.get("visual_suspicion_level"),
    }
    return response_payload


@app.get("/api/explain/{assessment_id}")
def get_explanation(
    assessment_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Assessment record not found.")

    return {
        "assessment_id": record.id,
        "cancer_type": record.cancer_type,
        "risk_percentage": record.risk_percentage,
        "risk_category": record.risk_category,
        "confidence_level": record.confidence_level,
        "algorithm_used": record.algorithm_used,
        "inputs": json.loads(record.inputs_data),
        "contributing_factors": json.loads(record.contributing_factors),
        "recommendations": json.loads(record.recommendations),
        "explanation_en": record.explanation_en,
        "explanation_hi": record.explanation_hi,
        "created_at": record.created_at.isoformat(),
    }


# ---------------------------------------------------------------------------
# AI Health Assistant Chatbot (RAG)
# ---------------------------------------------------------------------------

@app.post("/api/chat", response_model=ChatResponse)
def chat_health_assistant(query: ChatQuery):
    logger.info("Processing RAG query in AI health assistant.")
    history = [msg.model_dump() for msg in query.conversation_history] if query.conversation_history else []
    response = generate_rag_response(query.message, history)
    return response


# ---------------------------------------------------------------------------
# User Authentication & Profile
# ---------------------------------------------------------------------------

@app.post("/api/auth/register", response_model=TokenResponse)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    new_user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name or payload.email.split("@")[0].title(),
        created_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "created_at": new_user.created_at.isoformat(),
        }
    }


@app.post("/api/auth/login", response_model=TokenResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat(),
        }
    }


@app.get("/api/auth/me", response_model=UserProfile)
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "created_at": user.created_at.isoformat(),
    }


# ---------------------------------------------------------------------------
# Assessment History & User Trend Tracking
# ---------------------------------------------------------------------------

@app.get("/api/assessments/history", response_model=HistoryResponse)
def get_user_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = db.query(Assessment).filter(Assessment.user_id == user.id).order_by(Assessment.created_at.asc()).all()

    items = []
    trend_points = []
    for r in records:
        dt_str = r.created_at.strftime("%Y-%m-%d")
        items.append({
            "id": r.id,
            "cancer_type": r.cancer_type,
            "risk_percentage": r.risk_percentage,
            "risk_category": r.risk_category,
            "confidence_level": r.confidence_level,
            "algorithm_used": r.algorithm_used,
            "created_at": r.created_at.isoformat(),
        })
        trend_points.append({
            "date": dt_str,
            "cancer_type": r.cancer_type,
            "risk_percentage": r.risk_percentage,
        })

    # Return descending list for table, chronological for chart
    items.reverse()
    return {
        "assessments": items,
        "trend_data": trend_points,
    }


@app.delete("/api/assessments/my-data")
def delete_user_data(
    delete_account: bool = False,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Patient Privacy Right to Erasure (GDPR/HIPAA compliance).
    Deletes all stored medical assessment histories, and optionally the user account.
    """
    logger.info(f"User requested data erasure [ID: {user.id}].")
    db.query(Assessment).filter(Assessment.user_id == user.id).delete()

    if delete_account:
        db.delete(user)
        db.commit()
        return {"status": "success", "message": "All clinical records and your user account have been permanently erased."}

    db.commit()
    return {"status": "success", "message": "All assessment histories and medical parameters have been permanently erased."}


# ---------------------------------------------------------------------------
# Optional Monolithic Single-Service Deployment
# Serves compiled React frontend if frontend/dist exists
# ---------------------------------------------------------------------------
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

_dist_dir = os.path.join(_parent_dir, "frontend", "dist")
if os.path.exists(_dist_dir):
    _assets_dir = os.path.join(_dist_dir, "assets")
    if os.path.exists(_assets_dir):
        app.mount("/assets", StaticFiles(directory=_assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_frontend_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        target_file = os.path.join(_dist_dir, full_path)
        if os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(_dist_dir, "index.html"))

