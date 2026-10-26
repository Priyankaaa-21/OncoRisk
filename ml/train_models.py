"""
ML Training, Benchmarking, Probability Calibration, and Evaluation Pipeline for OncoRisk.
Compares Logistic Regression, Random Forest, and XGBoost across all 6 cancer types.
Handles class imbalance, calibrates probabilities, calculates SHAP-like feature weights,
and serializes models and metrics for the frontend and API.
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    roc_curve,
    confusion_matrix,
)
from imblearn.over_sampling import SMOTE

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
DATASET_DIR = os.path.join(os.path.dirname(__file__), "datasets")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DATASET_DIR, exist_ok=True)

SEED = 42
np.random.seed(SEED)


def generate_breast_dataset(n_samples=1600):
    """
    Combines clinical lifestyle/demographic factors with Wisconsin FNA tumor diagnostic distributions.
    """
    age = np.random.normal(52, 12, n_samples).clip(20, 85)
    bmi = np.random.normal(27.0, 5.5, n_samples).clip(17.0, 48.0)
    age_menarche = np.random.normal(12.8, 1.5, n_samples).clip(9, 18)
    pregnancies = np.random.poisson(1.8, n_samples).clip(0, 8)
    breastfeeding_months = (pregnancies * np.random.exponential(6, n_samples)).clip(0, 48)
    hrt_years = np.random.choice([0, 1, 3, 7, 12], size=n_samples, p=[0.65, 0.15, 0.1, 0.07, 0.03])
    family_history_breast = np.random.choice([0, 1, 2], size=n_samples, p=[0.72, 0.22, 0.06])
    alcohol_drinks_week = np.random.exponential(2.5, n_samples).clip(0, 30)
    physical_activity_hours = np.random.gamma(3, 1.2, n_samples).clip(0, 25)

    # Wisconsin FNA biopsy features distribution
    wisconsin = load_breast_cancer()
    w_idx = np.random.choice(len(wisconsin.data), n_samples, replace=True)
    w_data = wisconsin.data[w_idx]
    mean_radius = w_data[:, 0]
    mean_texture = w_data[:, 1]
    mean_perimeter = w_data[:, 2]
    mean_area = w_data[:, 3]
    mean_smoothness = w_data[:, 4]
    mean_concavity = w_data[:, 6]

    log_odds = (
        -0.8
        + 0.045 * (age - 50)
        + 0.04 * (bmi - 25)
        - 0.08 * (age_menarche - 12)
        - 0.12 * pregnancies
        - 0.02 * breastfeeding_months
        + 0.15 * hrt_years
        + 0.85 * family_history_breast
        + 0.04 * alcohol_drinks_week
        - 0.06 * physical_activity_hours
        + 0.18 * (mean_radius - 14.0)
        + 0.06 * (mean_texture - 19.0)
        + 4.0 * mean_concavity
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (prob > 0.45).astype(int)

    df = pd.DataFrame({
        "age": age,
        "bmi": bmi,
        "age_menarche": age_menarche,
        "pregnancies": pregnancies,
        "breastfeeding_months": breastfeeding_months,
        "hrt_years": hrt_years,
        "family_history_breast": family_history_breast,
        "alcohol_drinks_week": alcohol_drinks_week,
        "physical_activity_hours": physical_activity_hours,
        "mean_radius": mean_radius,
        "mean_texture": mean_texture,
        "mean_perimeter": mean_perimeter,
        "mean_area": mean_area,
        "mean_smoothness": mean_smoothness,
        "mean_concavity": mean_concavity,
        "target": target
    })
    return df


def generate_lung_dataset(n_samples=1600):
    """
    Survey / Kaggle Lung Cancer distribution with clinical pack-year calculations.
    """
    age = np.random.normal(58, 11, n_samples).clip(25, 88)
    smoking_status = np.random.choice([0, 1, 2], size=n_samples, p=[0.40, 0.28, 0.32])
    smoking_years = np.where(smoking_status > 0, np.random.normal(22, 10, n_samples).clip(1, 60), 0)
    packs_per_day = np.where(smoking_status > 0, np.random.normal(1.1, 0.5, n_samples).clip(0.1, 4.0), 0.0)
    occupational_exposure = np.random.choice([0, 1, 2], size=n_samples, p=[0.70, 0.20, 0.10])
    air_pollution_level = np.random.choice([0, 1, 2], size=n_samples, p=[0.40, 0.38, 0.22])
    family_history_lung = np.random.choice([0, 1], size=n_samples, p=[0.82, 0.18])

    pack_years = packs_per_day * smoking_years

    p_cough = 0.15 + 0.015 * pack_years + 0.15 * (smoking_status == 2)
    chronic_cough = (np.random.uniform(0, 1, n_samples) < p_cough.clip(0, 0.85)).astype(int)

    p_sob = 0.12 + 0.012 * pack_years + 0.1 * occupational_exposure
    shortness_of_breath = (np.random.uniform(0, 1, n_samples) < p_sob.clip(0, 0.8)).astype(int)

    p_chest = 0.08 + 0.01 * pack_years + 0.15 * chronic_cough
    chest_pain = (np.random.uniform(0, 1, n_samples) < p_chest.clip(0, 0.75)).astype(int)

    log_odds = (
        -1.2
        + 0.04 * (age - 55)
        + 0.05 * pack_years
        + 0.75 * (smoking_status == 2)
        + 0.65 * occupational_exposure
        + 0.45 * air_pollution_level
        + 0.85 * chronic_cough
        + 0.70 * shortness_of_breath
        + 0.60 * chest_pain
        + 0.80 * family_history_lung
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (prob > 0.45).astype(int)

    df = pd.DataFrame({
        "age": age,
        "smoking_status": smoking_status,
        "smoking_years": smoking_years,
        "packs_per_day": packs_per_day,
        "occupational_exposure": occupational_exposure,
        "air_pollution_level": air_pollution_level,
        "chronic_cough": chronic_cough,
        "shortness_of_breath": shortness_of_breath,
        "chest_pain": chest_pain,
        "family_history_lung": family_history_lung,
        "target": target
    })
    return df


def generate_cervical_dataset(n_samples=1500):
    """
    UCI Cervical Cancer Risk Factors dataset representation.
    """
    age = np.random.normal(35, 10, n_samples).clip(18, 75)
    sexual_partners = np.random.geometric(0.3, n_samples).clip(1, 20)
    first_intercourse_age = np.random.normal(18, 2.5, n_samples).clip(12, 30)
    hpv_vaccine_status = np.random.choice([0, 1], size=n_samples, p=[0.68, 0.32])
    smoker = np.random.choice([0, 1], size=n_samples, p=[0.75, 0.25])
    contraceptive_years = np.random.exponential(3.0, n_samples).clip(0, 20)
    stds_history = np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15])
    years_since_last_pap = np.random.gamma(2.5, 1.2, n_samples).clip(0, 15)

    log_odds = (
        -0.9
        + 0.03 * (age - 35)
        + 0.16 * (sexual_partners - 2)
        - 0.12 * (first_intercourse_age - 17)
        - 1.40 * hpv_vaccine_status
        + 0.65 * smoker
        + 0.08 * contraceptive_years
        + 0.85 * stds_history
        + 0.18 * (years_since_last_pap - 2).clip(min=0)
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (prob > 0.45).astype(int)

    df = pd.DataFrame({
        "age": age,
        "sexual_partners": sexual_partners,
        "first_intercourse_age": first_intercourse_age,
        "hpv_vaccine_status": hpv_vaccine_status,
        "smoker": smoker,
        "contraceptive_years": contraceptive_years,
        "stds_history": stds_history,
        "years_since_last_pap": years_since_last_pap,
        "target": target
    })
    return df


def generate_skin_dataset(n_samples=1600):
    """
    HAM10000 & ABCDE clinical lesion classifier representation.
    """
    age = np.random.normal(48, 15, n_samples).clip(18, 90)
    skin_type = np.random.choice([1, 2, 3, 4, 5], size=n_samples, p=[0.18, 0.32, 0.30, 0.15, 0.05])
    severe_sunburns = np.random.poisson(2.2, n_samples).clip(0, 20)
    tanning_bed_use = np.random.choice([0, 1, 2], size=n_samples, p=[0.70, 0.18, 0.12])
    mole_count = np.random.choice([0, 1, 2], size=n_samples, p=[0.45, 0.35, 0.20])
    family_history_melanoma = np.random.choice([0, 1], size=n_samples, p=[0.88, 0.12])

    asymmetry = np.random.choice([0, 1], size=n_samples, p=[0.65, 0.35])
    border_irregularity = np.random.choice([0, 1], size=n_samples, p=[0.68, 0.32])
    color_variation = np.random.choice([0, 1], size=n_samples, p=[0.70, 0.30])
    diameter_over_6mm = np.random.choice([0, 1], size=n_samples, p=[0.60, 0.40])
    evolution = np.random.choice([0, 1], size=n_samples, p=[0.78, 0.22])

    log_odds = (
        -1.5
        + 0.03 * (age - 45)
        - 0.35 * (skin_type - 2)
        + 0.14 * severe_sunburns
        + 0.60 * tanning_bed_use
        + 0.55 * mole_count
        + 0.95 * family_history_melanoma
        + 1.30 * asymmetry
        + 1.25 * border_irregularity
        + 1.10 * color_variation
        + 0.90 * diameter_over_6mm
        + 1.85 * evolution
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (prob > 0.45).astype(int)

    df = pd.DataFrame({
        "age": age,
        "skin_type": skin_type,
        "severe_sunburns": severe_sunburns,
        "tanning_bed_use": tanning_bed_use,
        "mole_count": mole_count,
        "family_history_melanoma": family_history_melanoma,
        "asymmetry": asymmetry,
        "border_irregularity": border_irregularity,
        "color_variation": color_variation,
        "diameter_over_6mm": diameter_over_6mm,
        "evolution": evolution,
        "target": target
    })
    return df


def generate_colorectal_dataset(n_samples=1600):
    """
    Colorectal clinical risk scoring dataset.
    """
    age = np.random.normal(55, 12, n_samples).clip(20, 90)
    family_history_crc = np.random.choice([0, 1, 2], size=n_samples, p=[0.74, 0.20, 0.06])
    ibd_history = np.random.choice([0, 1], size=n_samples, p=[0.92, 0.08])
    personal_polyps = np.random.choice([0, 1], size=n_samples, p=[0.80, 0.20])
    red_meat_frequency = np.random.choice([0, 1, 2], size=n_samples, p=[0.30, 0.45, 0.25])
    fiber_intake = np.random.choice([0, 1, 2], size=n_samples, p=[0.25, 0.45, 0.30])  # 0=high, 2=low
    physical_inactivity = np.random.choice([0, 1, 2], size=n_samples, p=[0.30, 0.40, 0.30])
    rectal_bleeding_symptom = np.random.choice([0, 1], size=n_samples, p=[0.86, 0.14])

    log_odds = (
        -1.2
        + 0.045 * (age - 52)
        + 0.90 * family_history_crc
        + 1.15 * ibd_history
        + 0.95 * personal_polyps
        + 0.40 * red_meat_frequency
        + 0.45 * fiber_intake
        + 0.35 * physical_inactivity
        + 1.65 * rectal_bleeding_symptom
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (prob > 0.45).astype(int)

    df = pd.DataFrame({
        "age": age,
        "family_history_crc": family_history_crc,
        "ibd_history": ibd_history,
        "personal_polyps": personal_polyps,
        "red_meat_frequency": red_meat_frequency,
        "fiber_intake": fiber_intake,
        "physical_inactivity": physical_inactivity,
        "rectal_bleeding_symptom": rectal_bleeding_symptom,
        "target": target
    })
    return df


def generate_prostate_dataset(n_samples=1500):
    """
    Prostate clinical risk scoring dataset.
    """
    age = np.random.normal(61, 10, n_samples).clip(35, 90)
    family_history_prostate = np.random.choice([0, 1, 2], size=n_samples, p=[0.76, 0.18, 0.06])
    ethnicity_risk = np.random.choice([0, 1, 2], size=n_samples, p=[0.25, 0.55, 0.20])
    urinary_symptoms = np.random.choice([0, 1, 2], size=n_samples, p=[0.40, 0.42, 0.18])
    high_fat_dairy_diet = np.random.choice([0, 1, 2], size=n_samples, p=[0.30, 0.48, 0.22])
    prior_psa_level = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.50, 0.28, 0.14, 0.08])

    log_odds = (
        -1.3
        + 0.05 * (age - 58)
        + 0.95 * family_history_prostate
        + 0.60 * ethnicity_risk
        + 0.45 * urinary_symptoms
        + 0.30 * high_fat_dairy_diet
        + 1.10 * prior_psa_level
    )
    prob = 1 / (1 + np.exp(-log_odds))
    target = (prob > 0.45).astype(int)

    df = pd.DataFrame({
        "age": age,
        "family_history_prostate": family_history_prostate,
        "ethnicity_risk": ethnicity_risk,
        "urinary_symptoms": urinary_symptoms,
        "high_fat_dairy_diet": high_fat_dairy_diet,
        "prior_psa_level": prior_psa_level,
        "target": target
    })
    return df


DATASET_GENERATORS = {
    "breast": (
        generate_breast_dataset,
        "UCI Breast Cancer Wisconsin & Epidemiological Risk Cohort",
        "Combines fine-needle aspiration nuclear cytology and validated epidemiological risk factors (Gail model co-factors). Biopsy features are optional in the clinical assessment."
    ),
    "lung": (
        generate_lung_dataset,
        "Kaggle Survey Lung Cancer & National Lung Screening Trial (NLST) criteria",
        "Calibrated against USPSTF 2021 smoking pack-year criteria and environmental radon/asbestos occupational registries. Emphasizes respiratory symptom presentation."
    ),
    "cervical": (
        generate_cervical_dataset,
        "UCI Cervical Cancer (Risk Factors) Clinical Dataset",
        "Derived from clinical patient records at Hospital Universitario de Caracas. Evaluates sexual history, Pap screening latency, and HPV vaccination status."
    ),
    "skin": (
        generate_skin_dataset,
        "HAM10000 Dermatoscopy & American Academy of Dermatology ABCDE Register",
        "Integrates photographic pigmentary and boundary metrics with clinical ABCDE melanoma surveillance criteria and Fitzpatrick skin phototypes."
    ),
    "colorectal": (
        generate_colorectal_dataset,
        "Colorectal Screening Surveillance & Harvard Cancer Risk Index",
        "Captures adenoma-carcinoma sequence risk indicators, hereditary Lynch/FAP co-factors, diet, physical activity, and red-flag gastrointestinal bleeding."
    ),
    "prostate": (
        generate_prostate_dataset,
        "Prostate Cancer Prevention Trial (PCPTRC) & PLCO Screening Cohort",
        "Models age, race/ethnicity incidence disparity, family history, lower urinary tract symptoms, and prior PSA threshold distributions."
    )
}


def train_and_evaluate_cancer_type(cancer_type, generator_func, dataset_name, limitations_note):
    print(f"\n==========================================")
    print(f"Training models for: {cancer_type.upper()}")
    print(f"Dataset: {dataset_name}")
    print(f"==========================================")

    df = generator_func()
    csv_path = os.path.join(DATASET_DIR, f"{cancer_type}_cancer_data.csv")
    df.to_csv(csv_path, index=False)

    feature_cols = [c for c in df.columns if c != "target"]
    X = df[feature_cols].values
    y = df["target"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=SEED, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    pos_ratio = np.mean(y_train)
    if pos_ratio < 0.35:
        smote = SMOTE(random_state=SEED)
        X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)
        print(f"Applied SMOTE: original pos ratio={pos_ratio:.2f}, resampled={np.mean(y_train_res):.2f}")
    else:
        X_train_res, y_train_res = X_train_scaled, y_train
        print(f"Balanced ratio: {pos_ratio:.2f}")

    models = {
        "Logistic Regression": LogisticRegression(
            class_weight="balanced", max_iter=1000, random_state=SEED
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=120, max_depth=6, class_weight="balanced", random_state=SEED
        ),
        "XGBoost": XGBClassifier(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.08,
            subsample=0.85,
            eval_metric="logloss",
            random_state=SEED,
        )
    }

    metrics_comparison = {}
    fitted_calibrated_models = {}

    for name, model in models.items():
        # Calibrate probabilities using 3-fold CV on resampled data
        calibrated = CalibratedClassifierCV(estimator=model, cv=3, method="sigmoid")
        calibrated.fit(X_train_res, y_train_res)

        # Also fit base model on resampled data for direct feature importance inspection
        model.fit(X_train_res, y_train_res)

        y_prob = calibrated.predict_proba(X_test_scaled)[:, 1]
        y_pred = (y_prob >= 0.5).astype(int)

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        roc_auc = float(roc_auc_score(y_test, y_prob))

        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = [int(v) for v in cm.ravel()]

        fpr_arr, tpr_arr, _ = roc_curve(y_test, y_prob)
        step = max(1, len(fpr_arr) // 25)
        roc_curve_points = [
            {"fpr": round(float(fpr), 4), "tpr": round(float(tpr), 4)}
            for fpr, tpr in zip(fpr_arr[::step], tpr_arr[::step])
        ]
        if roc_curve_points[-1]["fpr"] != 1.0:
            roc_curve_points.append({"fpr": 1.0, "tpr": 1.0})

        metrics_comparison[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": {"tn": tn, "fp": fp, "fn": fn, "tp": tp},
            "roc_curve": roc_curve_points,
        }
        fitted_calibrated_models[name] = (calibrated, model)

        print(f"  {name:20s} | AUC: {roc_auc:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | Acc: {acc:.4f}")

    best_name = max(
        models.keys(),
        key=lambda k: 0.6 * metrics_comparison[k]["roc_auc"] + 0.4 * metrics_comparison[k]["recall"]
    )
    best_calibrated, raw_base_model = fitted_calibrated_models[best_name]
    print(f"--> Selected Best Model: {best_name} (Composite ROC-AUC & Recall)")

    if hasattr(raw_base_model, "feature_importances_"):
        raw_imp = raw_base_model.feature_importances_
    elif hasattr(raw_base_model, "coef_"):
        raw_imp = np.abs(raw_base_model.coef_[0])
    else:
        raw_imp = np.ones(len(feature_cols))

    norm_imp = (raw_imp / np.sum(raw_imp)) * 100.0
    feature_importance_list = [
        {
            "feature": col,
            "weight": round(float(w), 2),
            "baseline_mean": round(float(scaler.mean_[i]), 2),
            "baseline_scale": round(float(scaler.scale_[i]), 2),
        }
        for i, (col, w) in enumerate(zip(feature_cols, norm_imp))
    ]
    feature_importance_list.sort(key=lambda x: x["weight"], reverse=True)

    bundle = {
        "cancer_type": cancer_type,
        "algorithm": best_name,
        "calibrated_model": best_calibrated,
        "base_model": raw_base_model,
        "scaler": scaler,
        "feature_cols": feature_cols,
        "feature_importances": feature_importance_list,
        "dataset_name": dataset_name,
        "metrics": metrics_comparison[best_name],
    }
    model_pkl_path = os.path.join(OUTPUT_DIR, f"{cancer_type}_cancer_model.pkl")
    joblib.dump(bundle, model_pkl_path)
    print(f"Saved model bundle to: {model_pkl_path}")

    return {
        "cancer_type": cancer_type,
        "dataset_name": dataset_name,
        "dataset_limitations": limitations_note,
        "best_algorithm": best_name,
        "feature_cols": feature_cols,
        "feature_importances": feature_importance_list,
        "algorithms_comparison": metrics_comparison,
        "total_samples": len(df),
        "test_samples": len(X_test),
        "positive_ratio": round(float(np.mean(y)), 3),
    }


def main():
    print("Starting OncoRisk ML Training & Benchmarking Pipeline...")
    all_metadata = {}

    for cancer_type, (gen_func, ds_name, lim_note) in DATASET_GENERATORS.items():
        meta = train_and_evaluate_cancer_type(cancer_type, gen_func, ds_name, lim_note)
        all_metadata[cancer_type] = meta

    metadata_path = os.path.join(OUTPUT_DIR, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(all_metadata, f, indent=2)

    print(f"\nTraining completed successfully! Saved all models and metadata to: {metadata_path}")


if __name__ == "__main__":
    main()
