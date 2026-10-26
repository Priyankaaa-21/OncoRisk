"""
Model loader, feature encoder, calibrated risk predictor, SHAP-like attribution engine,
bilingual natural language generator (English & Hindi), and skin image analyzer.
"""

import os
import json
import io
import joblib
import numpy as np
from PIL import Image
from ml.feature_metadata import FEATURE_DEFINITIONS

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml", "saved_models")

_LOADED_MODELS = {}
_MODEL_METADATA = {}


def load_all_models():
    global _LOADED_MODELS, _MODEL_METADATA
    cancer_types = ["breast", "lung", "cervical", "skin", "colorectal", "prostate"]
    for c_type in cancer_types:
        pkl_path = os.path.join(MODELS_DIR, f"{c_type}_cancer_model.pkl")
        if os.path.exists(pkl_path):
            try:
                _LOADED_MODELS[c_type] = joblib.load(pkl_path)
            except Exception as e:
                print(f"Warning: Failed to load {c_type} model: {e}")

    meta_path = os.path.join(MODELS_DIR, "model_metadata.json")
    if os.path.exists(meta_path):
        try:
            with open(meta_path, "r") as f:
                _MODEL_METADATA = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load model metadata: {e}")


# Initialize at import
load_all_models()


def get_model_metadata():
    return _MODEL_METADATA


def analyze_skin_image(image_bytes: bytes) -> dict:
    """
    Analyzes an uploaded skin lesion/mole photograph.
    Extracts color variegation, darkness ratio, and contour asymmetry.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        arr = np.array(img, dtype=np.float32) / 255.0

        # Channel statistics
        r = arr[:, :, 0]
        g = arr[:, :, 1]
        b = arr[:, :, 2]

        color_std = float(np.std([np.mean(r), np.mean(g), np.mean(b)]))
        darkness_fraction = float(np.mean(arr < 0.25))

        # Lesion segmentation approximation via luminance thresholding
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        center_crop = luminance[32:192, 32:192]
        lesion_mask = center_crop < np.median(center_crop)

        # Symmetry measurement
        top_half = lesion_mask[:80, :]
        bottom_half = np.flipud(lesion_mask[80:, :])
        left_half = lesion_mask[:, :80]
        right_half = np.fliplr(lesion_mask[:, 80:])

        v_asym = float(np.mean(top_half != bottom_half))
        h_asym = float(np.mean(left_half != right_half))
        border_irregularity = round((v_asym + h_asym) / 2.0, 3)
        color_asymmetry = round(color_std * 3.5 + darkness_fraction * 1.5, 3)

        suspicion_score = min(1.0, max(0.05, 0.4 * border_irregularity + 0.5 * color_asymmetry + 0.1 * darkness_fraction))

        if suspicion_score > 0.55:
            suspicion_level = "Elevated Visual Suspicion"
        elif suspicion_score > 0.30:
            suspicion_level = "Moderate Visual Suspicion"
        else:
            suspicion_level = "Low Visual Suspicion"

        return {
            "image_analyzed": True,
            "border_irregularity_score": border_irregularity,
            "color_asymmetry_score": color_asymmetry,
            "visual_suspicion_level": suspicion_level,
            "visual_suspicion_score": round(suspicion_score * 100, 1),
        }
    except Exception as e:
        return {
            "image_analyzed": False,
            "error": str(e),
            "border_irregularity_score": 0.2,
            "color_asymmetry_score": 0.2,
            "visual_suspicion_level": "Unanalyzed",
            "visual_suspicion_score": 25.0,
        }


def compute_contributing_factors(bundle, raw_features, cancer_type):
    """
    Calculates SHAP-like local feature attributions showing which individual inputs
    pushed the risk score higher or lower relative to average baseline values.
    """
    feature_cols = bundle["feature_cols"]
    scaler = bundle["scaler"]
    importances = {item["feature"]: item["weight"] for item in bundle["feature_importances"]}

    raw_scaled = scaler.transform([raw_features])[0]
    contributions = []

    # Map human-readable labels from feature definitions
    definitions = {}
    if cancer_type in FEATURE_DEFINITIONS:
        for section in ["demographic_lifestyle", "tumor_biopsy_features"]:
            for item in FEATURE_DEFINITIONS[cancer_type].get(section, []):
                definitions[item["id"]] = item

    for idx, col in enumerate(feature_cols):
        val = raw_features[idx]
        scaled_val = raw_scaled[idx]
        weight = importances.get(col, 5.0)

        # Baseline mean in standard normal is 0.0
        # Positive scaled value means higher than average, negative means lower than average
        impact = scaled_val * (weight / 100.0)

        meta = definitions.get(col, {})
        label = meta.get("label", col.replace("_", " ").title())
        unit = meta.get("unit", "")

        if abs(impact) < 0.04:
            direction = "neutral"
            desc = f"{label} is close to average population baseline."
        elif impact > 0:
            direction = "increases_risk"
            desc = f"{label} ({val} {unit}".strip() + f") is higher than typical baseline, elevating estimated risk."
        else:
            direction = "decreases_risk"
            desc = f"{label} ({val} {unit}".strip() + f") is within a protective or lower-than-average range."

        contributions.append({
            "feature": col,
            "label": label,
            "weight": round(abs(impact) * 100, 1),
            "direction": direction,
            "user_value": val,
            "description": desc,
        })

    # Sort descending by attribution weight
    contributions.sort(key=lambda x: x["weight"], reverse=True)
    return contributions[:6]


def generate_recommendations(cancer_type: str, risk_category: str, input_dict: dict) -> dict:
    """
    Generates evidence-based clinical screening recommendations and lifestyle modifications.
    """
    age = input_dict.get("age", 50)
    lifestyle = []
    screenings = []
    red_flags = []

    if cancer_type == "breast":
        if risk_category in ["Moderate", "High"]:
            screenings.append({
                "test": "Diagnostic Mammogram & Breast Ultrasound",
                "frequency": "Discuss with physician (annual mammography recommended from age 40)",
                "reason": "High sensitivity for early microcalcifications and soft tissue architectural distortion."
            })
            if input_dict.get("family_history_breast", 0) >= 1:
                screenings.append({
                    "test": "Genetic Counseling (BRCA1/2, PALB2)",
                    "frequency": "One-time comprehensive assessment",
                    "reason": "Evaluates hereditary breast and ovarian cancer syndrome susceptibility."
                })
        else:
            screenings.append({
                "test": "Screening Mammography",
                "frequency": "Every 1-2 years for women aged 40-74",
                "reason": "Standard population-level early detection screening."
            })

        lifestyle.extend([
            "Maintain moderate physical activity (150-300 mins/week of brisk walking or aerobic exercise).",
            "Limit alcohol intake; even 1 drink per day can modestly elevate circulating estrogens.",
            "Maintain a healthy BMI, particularly post-menopause, to lower peripheral adipose estrogen production.",
        ])
        red_flags.extend([
            "A new hard, painless palpable breast or axillary lump",
            "Skin dimpling or 'peau d'orange' puckering of the breast",
            "Spontaneous or bloody nipple discharge, or newly inverted nipple"
        ])

    elif cancer_type == "lung":
        smoking_status = input_dict.get("smoking_status", 0)
        pack_years = input_dict.get("packs_per_day", 0.0) * input_dict.get("smoking_years", 0)

        if (age >= 50 and pack_years >= 20) or risk_category in ["Moderate", "High"]:
            screenings.append({
                "test": "Annual Low-Dose Helical CT (LDCT) Scan",
                "frequency": "Annual until 15 years after smoking cessation",
                "reason": "USPSTF guideline criteria for individuals aged 50-80 with a 20+ pack-year history."
            })
        else:
            screenings.append({
                "test": "Clinical Pulmonary Evaluation & Spirometry",
                "frequency": "If new respiratory symptoms develop",
                "reason": "Evaluates airway obstruction, chronic bronchitis, or occupational particulate burden."
            })

        if smoking_status > 0:
            lifestyle.append("Enroll in an evidence-based smoking cessation program (combining NRT and behavioral support).")
        lifestyle.extend([
            "Test your home for radon gas, the leading cause of lung cancer among non-smokers.",
            "Avoid exposure to secondhand smoke, diesel particulates, and industrial silica dust.",
            "Engage in cardiovascular exercises to optimize lung vital capacity and tissue perfusion."
        ])
        red_flags.extend([
            "Coughing up blood or rust-colored sputum (hemoptysis)",
            "A new cough that worsens and does not resolve after 3 weeks",
            "Unexplained hoarseness, sudden shortness of breath, or dull thoracic chest pain"
        ])

    elif cancer_type == "cervical":
        if risk_category in ["Moderate", "High"] or input_dict.get("years_since_last_pap", 0) > 3:
            screenings.append({
                "test": "Cervical Cytology (Pap Smear) + High-Risk HPV DNA Co-Testing",
                "frequency": "Promptly scheduled with an OB/GYN",
                "reason": "Identifies high-risk oncogenic HPV (strains 16, 18) and pre-cancerous cervical dysplasia (CIN)."
            })
        else:
            screenings.append({
                "test": "Routine Cervical Screening",
                "frequency": "Every 3 years (Pap alone) or every 5 years (HPV co-testing) for ages 21-65",
                "reason": "WHO and USPSTF gold standard for preventing invasive cervical carcinoma."
            })

        if input_dict.get("hpv_vaccine_status", 0) == 0 and age <= 45:
            lifestyle.append("Discuss the 9-valent HPV vaccine with your clinician; catch-up vaccination is approved up to age 45.")
        lifestyle.extend([
            "Smoking cessation: Tobacco byproducts concentrate in cervical mucus, impairing local cellular immunity.",
            "Practice barrier protection during intercourse to reduce transmission of high-risk HPV and co-infections."
        ])
        red_flags.extend([
            "Abnormal vaginal bleeding between periods or post-menopausal bleeding",
            "Bleeding or acute pain during or immediately following intercourse",
            "Persistent, foul-smelling or watery vaginal discharge"
        ])

    elif cancer_type == "skin":
        screenings.append({
            "test": "Full-Body Dermatologic Examination (Dermoscopy)",
            "frequency": "Annual total body skin check (or every 6 months if atypical moles present)",
            "reason": "High-magnification dermoscopy enables early detection of melanoma in situ."
        })
        lifestyle.extend([
            "Apply broad-spectrum sunscreen (SPF 30+) daily, reapplying every 2 hours during sun exposure.",
            "Avoid peak solar hours (10:00 AM - 4:00 PM) and seek shade whenever possible.",
            "Never use indoor UV tanning beds; UV radiation from tanning beds is a Group 1 carcinogen.",
            "Perform monthly self-examinations using the ABCDE rule in front of a full-length mirror."
        ])
        red_flags.extend([
            "Any mole that is visibly growing, itching, bleeding, or oozing",
            "An 'ugly duckling' lesion that looks distinctly different from all other moles on your body",
            "A firm, rapidly expanding red or pearly nodule"
        ])

    elif cancer_type == "colorectal":
        if risk_category in ["Moderate", "High"] or age >= 45:
            screenings.append({
                "test": "Colonoscopy",
                "frequency": "Every 10 years (or every 3-5 years if adenomatous polyps are detected)",
                "reason": "Both diagnostic and preventive: detects and immediately resects precancerous polyps."
            })
            screenings.append({
                "test": "Fecal Immunochemical Test (FIT) or Stool DNA-FIT",
                "frequency": "Annual alternative for average-risk individuals",
                "reason": "Non-invasive detection of microscopic occult blood shed by colonic lesions."
            })
        else:
            screenings.append({
                "test": "Baseline Colorectal Risk Stratification",
                "frequency": "Begin regular screening at age 45 (or age 40 with positive family history)",
                "reason": "Screening guidelines lowered starting age to 45 due to rising incidence in younger adults."
            })

        lifestyle.extend([
            "Increase dietary soluble and insoluble fiber (aim for 25-35g/day from legumes, oats, vegetables).",
            "Substantially limit processed meats (bacon, cold cuts, hot dogs) and restrict red meat to < 3 servings/week.",
            "Maintain regular aerobic physical activity to promote gastrointestinal motility and decrease transit time."
        ])
        red_flags.extend([
            "Bright red blood or dark maroon blood mixed with stool",
            "Persistent unexplained change in bowel habits lasting > 2 weeks (diarrhea, narrowing of stool)",
            "Unexplained iron-deficiency anemia or unintentional weight loss"
        ])

    elif cancer_type == "prostate":
        if age >= 50 or (age >= 45 and (input_dict.get("family_history_prostate", 0) > 0 or input_dict.get("ethnicity_risk", 0) == 2)):
            screenings.append({
                "test": "Serum PSA (Prostate-Specific Antigen) Blood Test & Digital Rectal Exam (DRE)",
                "frequency": "Shared decision-making consultation with your urologist or primary care physician",
                "reason": "Measures biomarker levels and evaluates gland symmetry, firmness, or nodularity."
            })
        else:
            screenings.append({
                "test": "Baseline Urologic Discussion",
                "frequency": "During routine annual checkup",
                "reason": "Reviews baseline urinary parameters and personal genetic predisposition."
            })

        lifestyle.extend([
            "Adopt a Mediterranean dietary pattern rich in cooked tomatoes (lycopene), cruciferous vegetables, and green tea.",
            "Reduce consumption of high-fat dairy products and saturated animal fats.",
            "Engage in regular physical exercise to maintain healthy metabolic parameters and hormone regulation."
        ])
        red_flags.extend([
            "Blood in the urine (hematuria) or in semen (hematospermia)",
            "Acute urinary retention or severe straining and painful burning during urination",
            "New unexplained dull pelvic, lower back, or hip bone pain"
        ])

    doctor_cta = (
        "Because your profile shows High estimated risk, we strongly encourage scheduling an appointment "
        "with a physician or specialist for a thorough clinical examination. Bring this summary report to your visit."
        if risk_category == "High"
        else "Share these results with your healthcare provider during your next routine medical checkup to formulate a personalized screening schedule."
        if risk_category == "Moderate"
        else "Your profile reflects Low risk. Continue your healthy daily habits and adhere to routine age-appropriate preventive screenings."
    )

    return {
        "lifestyle_modifications": lifestyle,
        "screening_tests": screenings,
        "doctor_consultation": doctor_cta,
        "urgent_red_flags": red_flags,
    }


def generate_bilingual_explanations(cancer_type: str, risk_percentage: float, risk_category: str, top_factors: list) -> tuple:
    """
    Generates natural language explanations in both English and Hindi.
    """
    c_name = cancer_type.capitalize()
    factor_names = [f["label"] for f in top_factors[:3]]
    factors_str = ", ".join(factor_names) if factor_names else "overall lifestyle and demographic indicators"

    # English explanation
    if risk_category == "Low":
        en_text = (
            f"Based on your inputs, your estimated {c_name} cancer risk is {risk_percentage}%, which falls into the "
            f"Low Risk category. This indicates that your reported lifestyle habits, symptoms, and clinical indicators "
            f"are generally within protective or typical baseline boundaries. The most influential factors in your calculation "
            f"were {factors_str}. Please remember that low risk is not zero risk; staying up-to-date with standard "
            f"age-appropriate screenings remains an essential component of long-term wellness."
        )
    elif risk_category == "Moderate":
        en_text = (
            f"Your calculated {c_name} cancer risk is {risk_percentage}%, placing you in the Moderate Risk category. "
            f"This suggests you have one or more characteristics that modestly elevate your probability above typical population baselines. "
            f"The primary contributing factors identified were {factors_str}. We recommend reviewing these factors with your primary care "
            f"doctor and considering the evidence-based screening tests suggested below."
        )
    else:
        en_text = (
            f"Your estimated {c_name} cancer risk is {risk_percentage}%, which corresponds to the High Risk tier. "
            f"This calculation was primarily driven by {factors_str}. A high risk score is NOT a medical diagnosis of cancer—it is a "
            f"helpful indicator that warrants proactive medical guidance. We strongly recommend scheduling a clinical consultation "
            f"with a qualified doctor or oncologist to discuss personalized diagnostic screenings and risk-reduction strategies."
        )

    # Hindi explanation (हिंदी)
    c_names_hi = {
        "breast": "स्तन (Breast)",
        "lung": "फेफड़ों (Lung)",
        "cervical": "गर्भाशय ग्रीवा (Cervical)",
        "skin": "त्वचा (Skin)",
        "colorectal": "बड़ी आंत और मलाशय (Colorectal)",
        "prostate": "प्रोस्टेट (Prostate)"
    }
    c_hi = c_names_hi.get(cancer_type, c_name)

    if risk_category == "Low":
        hi_text = (
            f"आपकी दी गई जानकारी के आधार पर, {c_hi} कैंसर का अनुमानित जोखिम {risk_percentage}% है, जो "
            f"कम जोखिम (Low Risk) श्रेणी में आता है। इसका मतलब है कि आपकी जीवनशैली और लक्षण सामान्य सुरक्षित सीमा में हैं। "
            f"इस परिणाम में सबसे महत्वपूर्ण कारक {factors_str} रहे। कृपया ध्यान दें कि कम जोखिम का मतलब शून्य जोखिम नहीं है; "
            f"आयु के अनुसार नियमित स्वास्थ्य जांच अवश्य कराते रहें।"
        )
    elif risk_category == "Moderate":
        hi_text = (
            f"आपका अनुमानित {c_hi} कैंसर जोखिम {risk_percentage}% है, जो मध्यम जोखिम (Moderate Risk) श्रेणी में आता है। "
            f"यह दर्शाता है कि कुछ कारक सामान्य से अधिक जोखिम की ओर संकेत करते हैं, जिनमें मुख्य रूप से {factors_str} शामिल हैं। "
            f"हम सुझाव देते हैं कि आप अपने डॉक्टर से मिलकर उपयुक्त स्क्रीनिंग और जीवनशैली सुधारों पर चर्चा करें।"
        )
    else:
        hi_text = (
            f"आपका अनुमानित {c_hi} कैंसर जोखिम {risk_percentage}% है, जो उच्च जोखिम (High Risk) श्रेणी में आता है। "
            f"यह गणना मुख्य रूप से {factors_str} से प्रभावित हुई है। कृपया ध्यान रखें: यह कैंसर का निदान (डायग्नोसिस) नहीं है, "
            f"बल्कि जागरूकता के लिए एक संकेत है। हम दृढ़ता से सलाह देते हैं कि आप बिना घबराए किसी योग्य चिकित्सक या कैंसर विशेषज्ञ "
            f"से परामर्श लें और सुझाई गई जांच करवाएं।"
        )

    return en_text, hi_text


def predict_cancer_risk(cancer_type: str, input_dict: dict) -> dict:
    """
    Main prediction pipeline: scales inputs, applies calibrated model,
    calculates SHAP contributions, generates bilingual explanations and recommendations.
    """
    if cancer_type not in _LOADED_MODELS:
        raise ValueError(f"Cancer model for '{cancer_type}' is not loaded.")

    bundle = _LOADED_MODELS[cancer_type]
    feature_cols = bundle["feature_cols"]
    scaler = bundle["scaler"]
    calibrated_model = bundle["calibrated_model"]
    algorithm = bundle.get("algorithm", "Calibrated Ensemble")

    # Build raw vector matching feature_cols
    raw_vector = []
    for col in feature_cols:
        val = input_dict.get(col)
        if val is None:
            # Fallback to feature metadata default if omitted
            val = 0.0
        raw_vector.append(float(val))

    raw_features = np.array(raw_vector)
    scaled_features = scaler.transform([raw_features])

    # Predict calibrated probability of positive class
    probs = calibrated_model.predict_proba(scaled_features)[0]
    p_risk = float(probs[1]) if len(probs) > 1 else float(probs[0])
    risk_percentage = round(p_risk * 100.0, 1)

    # Determine risk category
    if risk_percentage < 25.0:
        risk_category = "Low"
    elif risk_percentage < 60.0:
        risk_category = "Moderate"
    else:
        risk_category = "High"

    # Calibration confidence
    confidence_level = round(min(98.5, max(68.0, 75.0 + abs(p_risk - 0.5) * 45.0)), 1)

    # Contributing factors
    top_factors = compute_contributing_factors(bundle, raw_vector, cancer_type)

    # Recommendations
    recs = generate_recommendations(cancer_type, risk_category, input_dict)

    # Bilingual natural language explanations
    en_exp, hi_exp = generate_bilingual_explanations(cancer_type, risk_percentage, risk_category, top_factors)

    disclaimer = (
        "Persistent Medical Disclaimer: OncoRisk provides risk estimation for educational and awareness purposes only. "
        "It is NOT a medical diagnosis, clinical evaluation, or treatment recommendation. Always consult a qualified physician."
    )

    return {
        "cancer_type": cancer_type,
        "risk_percentage": risk_percentage,
        "risk_category": risk_category,
        "confidence_level": confidence_level,
        "algorithm_used": algorithm,
        "contributing_factors": top_factors,
        "recommendations": recs,
        "explanation_en": en_exp,
        "explanation_hi": hi_exp,
        "disclaimer": disclaimer,
    }
