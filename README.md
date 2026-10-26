# OncoRisk 🩺🛡️
### AI-Powered Cancer Risk Assessment & Early-Screening Awareness Platform

> **Statutory Medical Disclaimer**: OncoRisk provides mathematical risk probability estimates for **educational awareness and early-screening promotion only**. It does **NOT** diagnose cancer, stage malignancy, or prescribe clinical therapies. Always consult a certified physician or oncologist for personalized clinical guidance.

---

## 🌟 Executive Summary

**OncoRisk** is a full-stack clinical intelligence platform designed to address delayed cancer detection by translating complex epidemiological risk models and pathology datasets into accessible, patient-friendly guidance.

The platform stratifies risk across **6 major cancer types** (Breast, Lung, Cervical, Skin, Colorectal, and Prostate) using calibrated machine learning models. Every assessment highlights **top contributing factors** via SHAP-like attribution, provides **evidence-based screening schedules** (aligned with WHO, NCI, and ACS guidelines), generates **bilingual natural-language explanations** (English and Hindi), and produces a **printable clinical PDF report**.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons | Responsive medical-grade UI, calm blue/teal palette, dark mode, high-contrast & large-text accessibility modes |
| **Backend API** | FastAPI (Python 3.14), Pydantic v2, Uvicorn, Python-Multipart | RESTful API with zero-logging of sensitive patient inputs |
| **Database & Auth** | SQLite, SQLAlchemy 2, Bcrypt, PyJWT | Encrypted user records, longitudinal assessment histories, right-to-erasure compliance |
| **Machine Learning** | Scikit-learn 1.9, XGBoost 3.4, Imbalanced-learn (SMOTE), Pillow | Calibrated classifiers, probability calibration (`CalibratedClassifierCV`), SHAP feature decomposition, CNN-inspired skin lesion analysis |
| **AI Assistant (RAG)** | Retrieval-Augmented Generation over WHO, NCI, and ACS guidelines | Contextual Q&A citing authoritative guidelines with strict diagnostic refusal guardrails |

---

## 🔬 Machine Learning Pipeline & Datasets

Models were trained and benchmarked across three candidate architectures:
1. **Logistic Regression** (L2 penalty, balanced class weighting)
2. **Random Forest Classifier** (Ensemble tree voting, balanced weighting)
3. **XGBoost Classifier** (Gradient-boosted decision trees)

### Datasets Utilized:
* **Breast Cancer**: UCI Breast Cancer Wisconsin (Diagnostic) FNA cytology features combined with Gail Model epidemiological risk factors (menarche, pregnancies, HRT, breastfeeding).
* **Lung Cancer**: Kaggle Survey Lung Cancer dataset calibrated with USPSTF 20-pack-year smoking criteria and environmental radon/asbestos registries.
* **Cervical Cancer**: UCI Cervical Cancer (Risk Factors) clinical dataset from Hospital Universitario de Caracas.
* **Skin Cancer / Melanoma**: HAM10000 dermatoscopy distribution paired with the American Academy of Dermatology (AAD) ABCDE diagnostic criteria and Fitzpatrick phototypes. Includes close-up photographic lesion analysis.
* **Colorectal Cancer**: Harvard Cancer Risk Index & Colorectal Screening Surveillance distributions capturing the adenoma-carcinoma sequence.
* **Prostate Cancer**: PCPTRC Prostate Cancer Prevention Trial & PLCO Screening Cohort distributions.

### Benchmarks & Probability Calibration:
All models undergo **SMOTE** over-sampling to correct clinical positive class imbalances, followed by **Platt Sigmoid Calibration** (`CalibratedClassifierCV`) to ensure predicted percentages represent authentic clinical probabilities. Final models were selected based on composite **ROC-AUC and Recall (Sensitivity)** to prioritize patient safety and minimize false negatives.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Python**: 3.10+ (tested through Python 3.14)
- **Node.js**: v18+ (tested on Node v24)
- **npm**: 9+

### 2. Backend Setup & Run

```bash
# From workspace root:
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Train models and generate metadata (already pre-trained in ml/saved_models/)
python3 ml/train_models.py

# 3. Initialize SQLite database and seed demo account with historical data
python3 -m backend.seed_data

# 4. Start the FastAPI backend server
uvicorn backend.main:app --reload --port 8000
```
* API interactive Swagger documentation will be live at: `http://localhost:8000/docs`
* API health check endpoint: `http://localhost:8000/api/health`

### 3. Frontend Setup & Run

```bash
# In a new terminal tab:
cd frontend

# 1. Install dependencies
npm install

# 2. Launch Vite dev server
npm run dev
```
* Web application will be live at: `http://localhost:5173`

---

## 🔑 Demo Account Credentials

For instant demonstration and evaluation of the **Longitudinal Risk Trend Charts** and historical records:
* **Email**: `demo@oncorisk.org`
* **Password**: `DemoPassword123!`
* *(Or simply click the **"Fill Demo"** button on the Sign In modal)*

---

## 🛡️ Patient Safety, Ethics, and Privacy Guardrails

1. **Persistent Medical Disclaimer**: Displayed prominently at the top and bottom of every screen, in print reports, and inside chatbot responses.
2. **Never Diagnostic**: Outputs are framed strictly as risk stratifications (Low, Moderate, High) to motivate early discussion with a healthcare provider. High-risk results prompt calm, non-alarmist physician visit guidance.
3. **Zero Raw Input Logging**: Server logs redact all patient-specific parameters. No identifying clinical inputs are logged in server standard output.
4. **Right to Erasure (GDPR / HIPAA compliance)**: Users can permanently delete their assessment histories or wipe their user accounts with a single click in the Dashboard.
5. **AI Chatbot Guardrail**: Prompts asking for clinical diagnosis (e.g. *"Do I have cancer?"*, *"Diagnose my lump"*) trigger an immediate refusal explaining that only certified medical clinicians can diagnose conditions, while providing official WHO/NCI screening guidelines.

---

## 📁 Repository Directory Structure

```
SafeLife/
├── backend/
│   ├── main.py                  # FastAPI server, endpoints, CORS, privacy logging
│   ├── database.py              # SQLite SQLAlchemy models (User, Assessment)
│   ├── schemas.py               # Pydantic v2 validation models
│   ├── auth.py                  # Bcrypt hashing & PyJWT tokens
│   ├── predictor.py             # Calibrated inference, SHAP local attributions, bilingual generation
│   ├── chatbot_rag.py           # RAG health assistant with WHO/NCI/ACS knowledgebase & guardrails
│   ├── seed_data.py             # Demo account and historical assessment generator
│   └── test_api.py              # Automated integration test suite
├── frontend/
│   ├── index.html               # Semantic HTML5 entrypoint with Google Fonts
│   ├── package.json             # React, Vite, Tailwind, Recharts, Lucide
│   ├── vite.config.js           # Vite dev server with /api proxy to FastAPI
│   ├── tailwind.config.js       # Calm medical blue/teal palette, dark mode
│   ├── postcss.config.js        # PostCSS configuration
│   └── src/
│       ├── App.jsx              # Central router, state, theme & accessibility sync
│       ├── index.css            # Medical glassmorphic styling, print stylesheet, accessibility
│       ├── main.jsx             # React DOM root render
│       ├── services/
│       │   └── api.js           # Fetch API client
│       ├── data/
│       │   ├── cancerTypes.js   # 6 Cancer descriptions, screening ages, test tags
│       │   ├── symptomData.js   # Organ categories, red-flag symptoms definitions
│       │   ├── clinicsData.js   # Hospital directory with OpenStreetMap links
│       │   └── educationalData.js # Myths vs facts, 7 prevention rules, screening calendar
│       ├── components/
│       │   ├── Navbar.jsx       # Brand header, accessibility bar, user dropdown
│       │   ├── Footer.jsx       # Statutory notice, cancer helplines, quick links
│       │   ├── DisclaimerBanner.jsx # Persistent non-diagnostic disclaimer
│       │   ├── AccessibilityBar.jsx # High-contrast, large-text, dark/light theme controls
│       │   ├── RiskGauge.jsx    # SVG semicircular gauge meter with confidence metrics
│       │   ├── ContributingFactorsChart.jsx # Recharts SHAP attribution bar chart
│       │   ├── NaturalLanguageExplanation.jsx # English/Hindi toggle & text-to-speech
│       │   ├── PDFReportGenerator.jsx # Printable / downloadable PDF clinical report
│       │   ├── ChatbotWidget.jsx # Floating RAG AI health assistant with source citations
│       │   └── AuthModal.jsx    # User login, registration, and 1-click demo fill
│       └── pages/
│           ├── LandingPage.jsx  # Hero, 3 steps, supported types, privacy section
│           ├── AssessmentSelectorPage.jsx # Cancer card directory with search & filters
│           ├── AssessmentFormPage.jsx # Multi-step form, progress bar, BMI auto-calc, consent
│           ├── ResultsPage.jsx  # Risk gauge, SHAP factors, recommendations, PDF
│           ├── ModelMetricsPage.jsx # LR vs RF vs XGBoost comparison, ROC curves, confusion matrix
│           ├── SymptomCheckerPage.jsx # Symptom checklist, red-flag detection, urgent alert
│           ├── ClinicFinderPage.jsx # Screening centers with interactive OpenStreetMap
│           ├── EducationHubPage.jsx # Myths vs facts, prevention tips, screening matrix
│           └── UserDashboardPage.jsx # Assessment history, risk trend chart, data erasure
├── ml/
│   ├── train_models.py          # Benchmark pipeline, SMOTE, calibration, metric export
│   ├── feature_metadata.py      # Clinical feature definitions, ranges, tooltips, units
│   ├── datasets/                # Exported CSVs of cohort datasets
│   └── saved_models/            # Serialized .pkl models and model_metadata.json
├── notebooks/
│   └── model_training_and_evaluation.ipynb # Demonstrative Jupyter notebook
├── requirements.txt             # Python packages
├── package.json                 # Root convenience scripts
├── .env.example                 # Environment configuration sample
└── README.md                    # Project documentation
```

---

## 🧪 Automated Testing

To run the automated backend test suite verifying all 6 cancer models, image uploads, RAG health assistant, and diagnostic refusal guardrails:

```bash
python3 backend/test_api.py
```

---

## 📄 License
Released under the [MIT License](LICENSE). Built for educational and risk awareness purposes.
