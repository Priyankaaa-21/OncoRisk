"""
Pydantic schemas for request validation and response models across OncoRisk.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr


class ConsentMixin(BaseModel):
    consent: bool = Field(
        default=True,
        description="User has agreed that this tool is for informational risk awareness and does not provide a medical diagnosis."
    )


# ---------------------------------------------------------------------------
# Cancer Assessment Inputs
# ---------------------------------------------------------------------------

class BreastInput(ConsentMixin):
    age: int = Field(..., ge=18, le=100, description="Age in years")
    bmi: float = Field(default=24.5, ge=12.0, le=60.0, description="Body Mass Index (kg/m²)")
    age_menarche: int = Field(default=13, ge=8, le=22, description="Age at first menstrual period")
    pregnancies: int = Field(default=1, ge=0, le=15, description="Full-term pregnancies")
    breastfeeding_months: int = Field(default=6, ge=0, le=120, description="Cumulative months breastfeeding")
    hrt_years: int = Field(default=0, ge=0, le=35, description="Years using combined Hormone Replacement Therapy")
    family_history_breast: int = Field(default=0, ge=0, le=2, description="0=None, 1=One 1st degree, 2=Multiple/BRCA")
    alcohol_drinks_week: int = Field(default=1, ge=0, le=60, description="Alcoholic beverages consumed per week")
    physical_activity_hours: float = Field(default=3.0, ge=0.0, le=40.0, description="Hours of exercise per week")

    # Optional Wisconsin FNA Biopsy Features (if user has lab pathology values)
    mean_radius: Optional[float] = Field(default=14.1, ge=5.0, le=35.0)
    mean_texture: Optional[float] = Field(default=19.2, ge=8.0, le=40.0)
    mean_perimeter: Optional[float] = Field(default=91.9, ge=40.0, le=200.0)
    mean_area: Optional[float] = Field(default=654.8, ge=140.0, le=2500.0)
    mean_smoothness: Optional[float] = Field(default=0.096, ge=0.05, le=0.25)
    mean_concavity: Optional[float] = Field(default=0.088, ge=0.0, le=0.5)


class LungInput(ConsentMixin):
    age: int = Field(..., ge=18, le=100, description="Age in years")
    smoking_status: int = Field(default=1, ge=0, le=2, description="0=Never, 1=Former, 2=Current smoker")
    smoking_years: int = Field(default=15, ge=0, le=75, description="Total years smoked")
    packs_per_day: float = Field(default=1.0, ge=0.0, le=6.0, description="Packs per day (20 cigarettes/pack)")
    occupational_exposure: int = Field(default=0, ge=0, le=2, description="0=None, 1=Moderate, 2=Asbestos/Radon/Mining")
    air_pollution_level: int = Field(default=1, ge=0, le=2, description="0=Low/Rural, 1=Suburban, 2=High/Metropolitan")
    chronic_cough: int = Field(default=0, ge=0, le=1, description="Persistent cough for > 3 weeks (0=No, 1=Yes)")
    shortness_of_breath: int = Field(default=0, ge=0, le=1, description="Wheezing or shortness of breath (0=No, 1=Yes)")
    chest_pain: int = Field(default=0, ge=0, le=1, description="Thoracic discomfort with breathing (0=No, 1=Yes)")
    family_history_lung: int = Field(default=0, ge=0, le=1, description="First-degree relative with lung cancer (0=No, 1=Yes)")


class CervicalInput(ConsentMixin):
    age: int = Field(..., ge=18, le=85, description="Age in years")
    sexual_partners: int = Field(default=2, ge=0, le=40, description="Lifetime number of sexual partners")
    first_intercourse_age: int = Field(default=18, ge=10, le=40, description="Age at first sexual intercourse")
    hpv_vaccine_status: int = Field(default=0, ge=0, le=1, description="0=Unvaccinated/Unknown, 1=Vaccinated")
    smoker: int = Field(default=0, ge=0, le=1, description="0=Non-smoker, 1=Smoker")
    contraceptive_years: int = Field(default=2, ge=0, le=30, description="Years using oral hormonal contraceptives")
    stds_history: int = Field(default=0, ge=0, le=1, description="History of STDs (0=No, 1=Yes)")
    years_since_last_pap: int = Field(default=2, ge=0, le=20, description="Years since last Pap smear or HPV DNA test")


class SkinInput(ConsentMixin):
    age: int = Field(..., ge=18, le=100, description="Age in years")
    skin_type: int = Field(default=2, ge=1, le=5, description="Fitzpatrick skin phototype (1=Very fair burns always, to 5=Dark)")
    severe_sunburns: int = Field(default=2, ge=0, le=40, description="Blistering sunburns in lifetime")
    tanning_bed_use: int = Field(default=0, ge=0, le=2, description="0=Never, 1=Occasional (<10), 2=Frequent (10+)")
    mole_count: int = Field(default=1, ge=0, le=2, description="0=Few (<25), 1=Moderate (25-50), 2=Many (>50 or atypical)")
    family_history_melanoma: int = Field(default=0, ge=0, le=1, description="First-degree relative with melanoma (0=No, 1=Yes)")

    # ABCDE criteria
    asymmetry: int = Field(default=0, ge=0, le=1, description="Asymmetry: One half doesn't match the other (0=No, 1=Yes)")
    border_irregularity: int = Field(default=0, ge=0, le=1, description="Border: Scalloped, notched, or blurred (0=No, 1=Yes)")
    color_variation: int = Field(default=0, ge=0, le=1, description="Color: Multiple shades of brown/black/red/blue (0=No, 1=Yes)")
    diameter_over_6mm: int = Field(default=0, ge=0, le=1, description="Diameter: Larger than 6mm (pencil eraser) (0=No, 1=Yes)")
    evolution: int = Field(default=0, ge=0, le=1, description="Evolution: Noticeably changing in size/shape/color (0=No, 1=Yes)")


class ColorectalInput(ConsentMixin):
    age: int = Field(..., ge=18, le=100, description="Age in years")
    family_history_crc: int = Field(default=0, ge=0, le=2, description="0=None, 1=Diagnosed >50, 2=Diagnosed <50 or multiple")
    ibd_history: int = Field(default=0, ge=0, le=1, description="History of Crohn's or Ulcerative Colitis (0=No, 1=Yes)")
    personal_polyps: int = Field(default=0, ge=0, le=1, description="Personal history of adenomatous polyps (0=No, 1=Yes)")
    red_meat_frequency: int = Field(default=1, ge=0, le=2, description="0=Low (<2x/wk), 1=Moderate (3-5x/wk), 2=Daily processed meats")
    fiber_intake: int = Field(default=1, ge=0, le=2, description="0=High fiber/legumes, 1=Average, 2=Low fiber")
    physical_inactivity: int = Field(default=1, ge=0, le=2, description="0=Active (>=150m/wk), 1=Moderate, 2=Sedentary")
    rectal_bleeding_symptom: int = Field(default=0, ge=0, le=1, description="Blood in stool or unexplained bowel habit change (0=No, 1=Yes)")


class ProstateInput(ConsentMixin):
    age: int = Field(..., ge=35, le=100, description="Age in years")
    family_history_prostate: int = Field(default=0, ge=0, le=2, description="0=None, 1=One 1st degree, 2=Two or more / early onset")
    ethnicity_risk: int = Field(default=1, ge=0, le=2, description="0=Asian/Hispanic, 1=Caucasian, 2=African ancestry/Black")
    urinary_symptoms: int = Field(default=1, ge=0, le=2, description="0=Normal, 1=Mild nocturia/hesitancy, 2=Moderate/severe stream difficulty")
    high_fat_dairy_diet: int = Field(default=1, ge=0, le=2, description="0=Low/plant-based, 1=Moderate, 2=High saturated fat/dairy")
    prior_psa_level: int = Field(default=0, ge=0, le=3, description="0=Never tested, 1=Normal (<2.5), 2=Borderline (2.5-4), 3=Elevated (>4.0)")


# ---------------------------------------------------------------------------
# Prediction & Explanation Output Schemas
# ---------------------------------------------------------------------------

class ContributingFactor(BaseModel):
    feature: str
    label: str
    weight: float
    direction: str  # "increases_risk", "decreases_risk", "neutral"
    user_value: Any
    description: str


class Recommendations(BaseModel):
    lifestyle_modifications: List[str]
    screening_tests: List[Dict[str, str]]
    doctor_consultation: str
    urgent_red_flags: List[str]


class PredictionResult(BaseModel):
    assessment_id: Optional[int] = None
    cancer_type: str
    risk_percentage: float
    risk_category: str  # "Low", "Moderate", "High"
    confidence_level: float
    algorithm_used: str
    contributing_factors: List[ContributingFactor]
    recommendations: Recommendations
    explanation_en: str
    explanation_hi: str
    disclaimer: str
    created_at: str


class SkinPredictionResult(PredictionResult):
    image_analyzed: bool = False
    lesion_color_asymmetry: Optional[float] = None
    lesion_border_irregularity_score: Optional[float] = None
    visual_suspicion_level: Optional[str] = None


# ---------------------------------------------------------------------------
# Auth & User Schemas
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class UserProfile(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    created_at: str


# ---------------------------------------------------------------------------
# History & Dashboard Schemas
# ---------------------------------------------------------------------------

class AssessmentHistoryItem(BaseModel):
    id: int
    cancer_type: str
    risk_percentage: float
    risk_category: str
    confidence_level: float
    algorithm_used: str
    created_at: str


class TrendDataPoint(BaseModel):
    date: str
    cancer_type: str
    risk_percentage: float


class HistoryResponse(BaseModel):
    assessments: List[AssessmentHistoryItem]
    trend_data: List[TrendDataPoint]


# ---------------------------------------------------------------------------
# Chatbot RAG Schemas
# ---------------------------------------------------------------------------

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatQuery(BaseModel):
    message: str = Field(..., min_length=1)
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list)


class ChatResponse(BaseModel):
    answer: str
    citations: List[str]
    disclaimer: str
    suggested_followups: List[str]
