"""
Feature metadata and clinical ranges for cancer risk assessment models.
Provides human-readable labels, clinical descriptions, units, and ranges for all form fields.
"""

FEATURE_DEFINITIONS = {
    "breast": {
        "demographic_lifestyle": [
            {
                "id": "age",
                "label": "Age",
                "type": "number",
                "min": 18,
                "max": 100,
                "default": 45,
                "unit": "years",
                "tooltip": "Age is one of the strongest risk factors. Risk increases significantly after age 50.",
                "importance_note": "Post-menopausal risk elevates baseline incidence."
            },
            {
                "id": "bmi",
                "label": "Body Mass Index (BMI)",
                "type": "number",
                "min": 15.0,
                "max": 50.0,
                "default": 24.5,
                "unit": "kg/m²",
                "tooltip": "Computed from height and weight. Higher BMI after menopause increases circulating estrogen.",
                "importance_note": "Adipose tissue produces estrogen after menopause."
            },
            {
                "id": "age_menarche",
                "label": "Age at First Menstruation",
                "type": "number",
                "min": 8,
                "max": 20,
                "default": 13,
                "unit": "years",
                "tooltip": "Starting menstruation before age 12 exposes breast tissue to estrogen longer over a lifetime.",
                "importance_note": "Early menarche (<12) increases lifetime estrogen exposure."
            },
            {
                "id": "pregnancies",
                "label": "Full-Term Pregnancies",
                "type": "number",
                "min": 0,
                "max": 10,
                "default": 1,
                "unit": "pregnancies",
                "tooltip": "Pregnancy induces terminal differentiation of breast ductal cells, conferring long-term protection.",
                "importance_note": "Nulliparity (having no children) slightly increases risk."
            },
            {
                "id": "breastfeeding_months",
                "label": "Total Months Breastfeeding",
                "type": "number",
                "min": 0,
                "max": 60,
                "default": 6,
                "unit": "months",
                "tooltip": "Each 12 months of breastfeeding is associated with an ~4.3% reduction in relative breast cancer risk.",
                "importance_note": "Reduces ovulatory cycles and promotes cell differentiation."
            },
            {
                "id": "hrt_years",
                "label": "Hormone Replacement Therapy (HRT)",
                "type": "number",
                "min": 0,
                "max": 25,
                "default": 0,
                "unit": "years",
                "tooltip": "Combined estrogen-progestin HRT for 5+ years increases breast density and risk.",
                "importance_note": "Risk declines within 3-5 years after stopping therapy."
            },
            {
                "id": "family_history_breast",
                "label": "First-Degree Relative with Breast Cancer",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No family history"},
                    {"value": 1, "label": "One first-degree relative (mother/sister/daughter)"},
                    {"value": 2, "label": "Two or more first-degree relatives or known BRCA mutation"}
                ],
                "default": 0,
                "tooltip": "Having a mother, sister, or daughter diagnosed roughly doubles relative risk.",
                "importance_note": "Strong genetic component (e.g., BRCA1/BRCA2, PALB2)."
            },
            {
                "id": "alcohol_drinks_week",
                "label": "Alcohol Consumption",
                "type": "number",
                "min": 0,
                "max": 40,
                "default": 1,
                "unit": "drinks/week",
                "tooltip": "Even moderate alcohol intake (1 drink/day) increases circulating estrogens.",
                "importance_note": "Clear dose-response relationship with breast cancer."
            },
            {
                "id": "physical_activity_hours",
                "label": "Moderate/Vigorous Exercise",
                "type": "number",
                "min": 0,
                "max": 30,
                "default": 3,
                "unit": "hours/week",
                "tooltip": "Regular exercise (150+ mins/week) lowers insulin levels and systemic inflammation.",
                "importance_note": "Protective factor against multiple cancers."
            }
        ],
        "tumor_biopsy_features": [
            {
                "id": "mean_radius",
                "label": "Mean Radius",
                "type": "number",
                "min": 5.0,
                "max": 35.0,
                "default": 14.1,
                "unit": "mm",
                "tooltip": "Mean distance from center to points on the cell perimeter in fine needle aspirate (FNA).",
                "is_optional": True
            },
            {
                "id": "mean_texture",
                "label": "Mean Texture",
                "type": "number",
                "min": 9.0,
                "max": 40.0,
                "default": 19.2,
                "unit": "gray-scale value",
                "tooltip": "Standard deviation of gray-scale values across the cell nucleus.",
                "is_optional": True
            },
            {
                "id": "mean_perimeter",
                "label": "Mean Perimeter",
                "type": "number",
                "min": 40.0,
                "max": 200.0,
                "default": 91.9,
                "unit": "mm",
                "tooltip": "Nuclear boundary perimeter measurement from Wisconsin dataset.",
                "is_optional": True
            },
            {
                "id": "mean_area",
                "label": "Mean Area",
                "type": "number",
                "min": 140.0,
                "max": 2500.0,
                "default": 654.8,
                "unit": "mm²",
                "tooltip": "Cross-sectional area of cell nuclei.",
                "is_optional": True
            },
            {
                "id": "mean_smoothness",
                "label": "Mean Smoothness",
                "type": "number",
                "min": 0.05,
                "max": 0.20,
                "default": 0.096,
                "unit": "variation in radius lengths",
                "tooltip": "Local variation in radius lengths.",
                "is_optional": True
            },
            {
                "id": "mean_concavity",
                "label": "Mean Concavity",
                "type": "number",
                "min": 0.0,
                "max": 0.5,
                "default": 0.088,
                "unit": "severity of concave portions",
                "tooltip": "Severity of concave portions on the nuclear contour.",
                "is_optional": True
            }
        ]
    },
    "lung": {
        "demographic_lifestyle": [
            {
                "id": "age",
                "label": "Age",
                "type": "number",
                "min": 18,
                "max": 100,
                "default": 55,
                "unit": "years",
                "tooltip": "Most lung cancers occur in individuals aged 50 and older.",
                "importance_note": "Risk escalates dramatically past age 55."
            },
            {
                "id": "smoking_status",
                "label": "Smoking Status",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Never smoked (<100 cigarettes in lifetime)"},
                    {"value": 1, "label": "Former smoker (quit > 1 year ago)"},
                    {"value": 2, "label": "Current smoker"}
                ],
                "default": 1,
                "tooltip": "Smoking is the leading cause, implicated in ~85% of all lung cancer cases.",
                "importance_note": "Primary preventable risk factor."
            },
            {
                "id": "smoking_years",
                "label": "Total Years Smoked",
                "type": "number",
                "min": 0,
                "max": 70,
                "default": 15,
                "unit": "years",
                "tooltip": "Cumulative duration of tobacco smoke exposure.",
                "importance_note": "Duration has an exponential impact on carcinogenesis."
            },
            {
                "id": "packs_per_day",
                "label": "Packs per Day",
                "type": "number",
                "min": 0.0,
                "max": 5.0,
                "default": 1.0,
                "unit": "packs (20 cigs)",
                "tooltip": "Used to calculate pack-years (packs/day × years smoked).",
                "importance_note": "20+ pack-years triggers annual low-dose CT screening guidelines."
            },
            {
                "id": "occupational_exposure",
                "label": "Occupational Carcinogen Exposure",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No known toxic exposures"},
                    {"value": 1, "label": "Moderate exposure (diesel exhaust, silica, paints)"},
                    {"value": 2, "label": "High exposure (asbestos, radon, arsenic, uranium mining)"}
                ],
                "default": 0,
                "tooltip": "Asbestos and radon multiply smoking risk through synergistic DNA damage.",
                "importance_note": "Radon is the #1 cause among non-smokers."
            },
            {
                "id": "air_pollution_level",
                "label": "Air Pollution / Secondhand Smoke",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Low / Rural (clean air)"},
                    {"value": 1, "label": "Moderate / Suburban"},
                    {"value": 2, "label": "High / Major metropolitan area or heavy secondhand smoke"}
                ],
                "default": 1,
                "tooltip": "Fine particulate matter (PM2.5) induces chronic bronchial inflammation.",
                "importance_note": "Class 1 human carcinogen (IARC)."
            },
            {
                "id": "chronic_cough",
                "label": "Chronic Persistent Cough (>3 weeks)",
                "type": "select",
                "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}],
                "default": 0,
                "tooltip": "A new or changing cough that does not resolve after 3 weeks requires medical evaluation.",
                "importance_note": "Key clinical symptom."
            },
            {
                "id": "shortness_of_breath",
                "label": "Shortness of Breath / Wheezing",
                "type": "select",
                "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}],
                "default": 0,
                "tooltip": "Unexplained dyspnea or wheezing can indicate airway narrowing or pleural effusion.",
                "importance_note": "Frequent early respiratory indicator."
            },
            {
                "id": "chest_pain",
                "label": "Chest Pain (Worse with Deep Breathing)",
                "type": "select",
                "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes"}],
                "default": 0,
                "tooltip": "Aching or sharp thoracic discomfort when coughing or laughing.",
                "importance_note": "Can indicate chest wall involvement."
            },
            {
                "id": "family_history_lung",
                "label": "Family History of Lung Cancer",
                "type": "select",
                "options": [{"value": 0, "label": "No"}, {"value": 1, "label": "Yes (first-degree relative)"}],
                "default": 0,
                "tooltip": "First-degree relative history increases risk approximately 1.5-2.0 fold.",
                "importance_note": "Inherited susceptibility in DNA repair capacity."
            }
        ]
    },
    "cervical": {
        "demographic_lifestyle": [
            {
                "id": "age",
                "label": "Age",
                "type": "number",
                "min": 18,
                "max": 80,
                "default": 32,
                "unit": "years",
                "tooltip": "Most frequently diagnosed between ages 35 and 44.",
                "importance_note": "Peak incidence occurs earlier than most epithelial cancers."
            },
            {
                "id": "sexual_partners",
                "label": "Lifetime Number of Sexual Partners",
                "type": "number",
                "min": 0,
                "max": 30,
                "default": 2,
                "unit": "partners",
                "tooltip": "High lifetime partner counts increase exposure to high-risk oncogenic HPV strains (16, 18).",
                "importance_note": "Surrogate marker for HPV exposure probability."
            },
            {
                "id": "first_intercourse_age",
                "label": "Age at First Intercourse",
                "type": "number",
                "min": 12,
                "max": 35,
                "default": 18,
                "unit": "years",
                "tooltip": "Younger cervical transformation zone is biologically more vulnerable to persistent HPV integration.",
                "importance_note": "Transformation zone cells are actively undergoing metaplasia."
            },
            {
                "id": "hpv_vaccine_status",
                "label": "HPV Vaccination Status",
                "type": "select",
                "options": [
                    {"value": 1, "label": "Fully vaccinated (Gardasil-9 / Cervarix)"},
                    {"value": 0, "label": "Not vaccinated or unknown"}
                ],
                "default": 0,
                "tooltip": "HPV vaccination protects against up to 90% of cervical cancer-causing strains.",
                "importance_note": "Powerful protective intervention."
            },
            {
                "id": "smoker",
                "label": "Smoking History",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Non-smoker"},
                    {"value": 1, "label": "Smoker / Former smoker"}
                ],
                "default": 0,
                "tooltip": "Tobacco byproducts concentrate in cervical mucus, impairing local immune clearance of HPV.",
                "importance_note": "Doubles the risk of persistent cervical dysplasia."
            },
            {
                "id": "contraceptive_years",
                "label": "Years on Oral Hormonal Contraceptives",
                "type": "number",
                "min": 0,
                "max": 25,
                "default": 2,
                "unit": "years",
                "tooltip": "Using oral contraceptives for 5+ years slightly elevates cervical risk while reducing ovarian/endometrial risk.",
                "importance_note": "Risk declines back to baseline 10 years after cessation."
            },
            {
                "id": "stds_history",
                "label": "History of Other STDs (Chlamydia, Herpes, etc.)",
                "type": "select",
                "options": [
                    {"value": 0, "label": "None"},
                    {"value": 1, "label": "Yes (treated or past diagnosis)"}
                ],
                "default": 0,
                "tooltip": "Co-infection causes chronic local mucosal inflammation that facilitates HPV persistence.",
                "importance_note": "Synergistic cofactor in dysplasia progression."
            },
            {
                "id": "years_since_last_pap",
                "label": "Years Since Last Pap Smear / HPV Screening",
                "type": "number",
                "min": 0,
                "max": 15,
                "default": 2,
                "unit": "years",
                "tooltip": "Routine screening every 3-5 years detects pre-cancerous CIN lesions before malignant transformation.",
                "importance_note": "Primary reason for mortality in unscreened populations."
            }
        ]
    },
    "skin": {
        "demographic_lifestyle": [
            {
                "id": "age",
                "label": "Age",
                "type": "number",
                "min": 18,
                "max": 95,
                "default": 42,
                "unit": "years",
                "tooltip": "Skin cancer risk accumulates with cumulative lifetime UV radiation exposure.",
                "importance_note": "Average age at melanoma diagnosis is 65, but it is also one of the commonest cancers in young adults."
            },
            {
                "id": "skin_type",
                "label": "Fitzpatrick Skin Phototype",
                "type": "select",
                "options": [
                    {"value": 1, "label": "Type I: Pale white skin, burns easily, never tans (red/blonde hair, blue eyes)"},
                    {"value": 2, "label": "Type II: Fair skin, burns easily, tans minimally"},
                    {"value": 3, "label": "Type III: Medium fair, burns moderately, tans gradually"},
                    {"value": 4, "label": "Type IV: Olive skin, burns minimally, tans easily"},
                    {"value": 5, "label": "Type V/VI: Brown to dark skin, rarely/never burns"}
                ],
                "default": 2,
                "tooltip": "Fair phototypes have less protective eumelanin, increasing susceptibility to UV damage.",
                "importance_note": "Type I & II have 10-fold higher risk than darker phototypes."
            },
            {
                "id": "severe_sunburns",
                "label": "Blistering Sunburns in Lifetime",
                "type": "number",
                "min": 0,
                "max": 30,
                "default": 2,
                "unit": "sunburns",
                "tooltip": "Experiencing 5 or more blistering sunburns during youth doubles melanoma risk.",
                "importance_note": "Intermittent intense burning is more hazardous than gradual chronic tanning."
            },
            {
                "id": "tanning_bed_use",
                "label": "Indoor Tanning Bed History",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Never used"},
                    {"value": 1, "label": "Occasional (<10 sessions in lifetime)"},
                    {"value": 2, "label": "Frequent (10+ sessions)"}
                ],
                "default": 0,
                "tooltip": "Tanning beds emit high-intensity UVA, classified as Group 1 human carcinogen.",
                "importance_note": "Increases melanoma risk by up to 75% when started before age 35."
            },
            {
                "id": "mole_count",
                "label": "Approximate Total Body Moles",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Few (<25 moles)"},
                    {"value": 1, "label": "Moderate (25 - 50 moles)"},
                    {"value": 2, "label": "Many (>50 moles or presence of large atypical/dysplastic nevi)"}
                ],
                "default": 1,
                "tooltip": "Having more than 50 common moles or atypical nevi is an independent marker of melanoma risk.",
                "importance_note": "Marker of melanocytic proliferation propensity."
            },
            {
                "id": "family_history_melanoma",
                "label": "Family History of Melanoma",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No family history"},
                    {"value": 1, "label": "Yes (one or more first-degree relatives)"}
                ],
                "default": 0,
                "tooltip": "Familial melanoma accounts for ~10% of cases, often involving CDKN2A mutations.",
                "importance_note": "Requires annual total body skin examinations."
            },
            {
                "id": "asymmetry",
                "label": "ABCDE: Asymmetry",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No - Symmetrical round/oval shape"},
                    {"value": 1, "label": "Yes - One half does not match the other half"}
                ],
                "default": 0,
                "tooltip": "Draw a line through the center; if the two halves do not match, it is asymmetrical.",
                "importance_note": "Classic clinical hallmark of dysplasia."
            },
            {
                "id": "border_irregularity",
                "label": "ABCDE: Border Irregularity",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Smooth, well-defined border"},
                    {"value": 1, "label": "Scalloped, notched, ragged, or blurred border"}
                ],
                "default": 0,
                "tooltip": "Malignant melanomas frequently show poorly demarcated margins.",
                "importance_note": "Critical diagnostic feature on dermatoscopy."
            },
            {
                "id": "color_variation",
                "label": "ABCDE: Color Variegation",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Uniform single brown/tan color"},
                    {"value": 1, "label": "Multiple shades of brown, black, red, white, or blue"}
                ],
                "default": 0,
                "tooltip": "Uneven distribution of color or presence of white/blue hues is suspicious.",
                "importance_note": "Indicates varying depth of melanin and regression."
            },
            {
                "id": "diameter_over_6mm",
                "label": "ABCDE: Diameter > 6mm",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Smaller than 6mm (pencil eraser size)"},
                    {"value": 1, "label": "Larger than 6mm"}
                ],
                "default": 0,
                "tooltip": "Melanomas are usually greater than 6mm when diagnosed, though early ones can be smaller.",
                "importance_note": "Pencil eraser diameter rule."
            },
            {
                "id": "evolution",
                "label": "ABCDE: Evolution / Change",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Stable - No change over recent months"},
                    {"value": 1, "label": "Evolving - Noticeably changing in size, shape, color, itching or bleeding"}
                ],
                "default": 0,
                "tooltip": "Evolution is the single most sensitive clinical indicator of malignancy.",
                "importance_note": "Any new or evolving lesion warrants urgent dermatologic evaluation."
            }
        ]
    },
    "colorectal": {
        "demographic_lifestyle": [
            {
                "id": "age",
                "label": "Age",
                "type": "number",
                "min": 18,
                "max": 95,
                "default": 52,
                "unit": "years",
                "tooltip": "Recommended screening begins at age 45 for average-risk individuals.",
                "importance_note": "Rates rise sharply after age 50."
            },
            {
                "id": "family_history_crc",
                "label": "Family History of Colorectal Cancer / Adenomatous Polyps",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No family history"},
                    {"value": 1, "label": "One first-degree relative diagnosed after age 50"},
                    {"value": 2, "label": "First-degree relative diagnosed before 50 or multiple relatives"}
                ],
                "default": 0,
                "tooltip": "First-degree relative diagnosis before age 50 prompts screening 10 years earlier.",
                "importance_note": "Lynch syndrome and FAP are major hereditary syndromes."
            },
            {
                "id": "ibd_history",
                "label": "Inflammatory Bowel Disease (Crohn's or Ulcerative Colitis)",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No"},
                    {"value": 1, "label": "Yes - Diagnosed with Crohn's or Ulcerative Colitis"}
                ],
                "default": 0,
                "tooltip": "Chronic inflammation of the bowel wall promotes dysplasia over years.",
                "importance_note": "Irritable bowel syndrome (IBS) does not increase cancer risk, but IBD does."
            },
            {
                "id": "personal_polyps",
                "label": "Personal History of Colonic Polyps",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No polyps or never had colonoscopy"},
                    {"value": 1, "label": "Yes - Previously had adenomatous polyps removed"}
                ],
                "default": 0,
                "tooltip": "Most colorectal cancers develop from pre-cancerous adenomatous polyps over 7-10 years.",
                "importance_note": "Indicates personalized colonoscopy surveillance intervals (3-5 years)."
            },
            {
                "id": "red_meat_frequency",
                "label": "Red & Processed Meat Consumption",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Low (< 2 servings per week)"},
                    {"value": 1, "label": "Moderate (3-5 servings per week)"},
                    {"value": 2, "label": "High (Daily or almost daily processed meats: bacon, sausage, deli meats)"}
                ],
                "default": 1,
                "tooltip": "Processed meats contain nitrates and heme iron, forming carcinogenic N-nitroso compounds.",
                "importance_note": "IARC classified processed meat as Group 1 carcinogen."
            },
            {
                "id": "fiber_intake",
                "label": "Dietary Fiber & Whole Grains",
                "type": "select",
                "options": [
                    {"value": 0, "label": "High fiber (generous legumes, whole grains, vegetables daily)"},
                    {"value": 1, "label": "Average fiber"},
                    {"value": 2, "label": "Low fiber (rarely whole grains or fresh vegetables)"}
                ],
                "default": 1,
                "tooltip": "Fiber accelerates intestinal transit time and produces protective short-chain fatty acids (butyrate).",
                "importance_note": "High dietary fiber intake is strongly protective."
            },
            {
                "id": "physical_inactivity",
                "label": "Physical Inactivity / Sedentary Lifestyle",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Active (>= 150 mins exercise/week)"},
                    {"value": 1, "label": "Moderately active"},
                    {"value": 2, "label": "Sedentary (< 30 mins exercise/week)"}
                ],
                "default": 1,
                "tooltip": "Physical activity stimulates peristalsis and modulates gut microbiome.",
                "importance_note": "Sedentary lifestyle is linked to ~25% higher risk."
            },
            {
                "id": "rectal_bleeding_symptom",
                "label": "Blood in Stool or Unexplained Change in Bowel Habits",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No symptoms"},
                    {"value": 1, "label": "Yes - Blood in stool, persistent diarrhea/constipation, or dark tarry stool"}
                ],
                "default": 0,
                "tooltip": "Blood in the stool or unexplained bowel changes require immediate physician evaluation.",
                "importance_note": "Key warning sign requiring diagnostic colonoscopy."
            }
        ]
    },
    "prostate": {
        "demographic_lifestyle": [
            {
                "id": "age",
                "label": "Age",
                "type": "number",
                "min": 35,
                "max": 95,
                "default": 58,
                "unit": "years",
                "tooltip": "Prostate cancer is rare before 40; risk escalates rapidly after age 50.",
                "importance_note": "~6 in 10 prostate cancers are diagnosed in men 65 and older."
            },
            {
                "id": "family_history_prostate",
                "label": "Family History of Prostate Cancer",
                "type": "select",
                "options": [
                    {"value": 0, "label": "No family history"},
                    {"value": 1, "label": "One first-degree relative (father/brother)"},
                    {"value": 2, "label": "Two or more relatives or diagnosed before age 55"}
                ],
                "default": 0,
                "tooltip": "Having a father or brother with prostate cancer more than doubles your risk.",
                "importance_note": "Strongest non-modifiable risk factor besides age."
            },
            {
                "id": "ethnicity_risk",
                "label": "Ethnicity / Ancestry Risk",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Asian / Hispanic / Other average risk"},
                    {"value": 1, "label": "Caucasian average risk"},
                    {"value": 2, "label": "African ancestry / Black (higher incidence and aggressive phenotype)"}
                ],
                "default": 1,
                "tooltip": "Men of African descent experience ~70% higher incidence and should discuss screening from age 45.",
                "importance_note": "Well-documented epidemiological disparity."
            },
            {
                "id": "urinary_symptoms",
                "label": "Urinary Symptoms (Weak Stream, Frequency, Nocturia)",
                "type": "select",
                "options": [
                    {"value": 0, "label": "None - Normal urination"},
                    {"value": 1, "label": "Mild (waking once at night, occasional weak stream)"},
                    {"value": 2, "label": "Moderate to severe (straining to urinate, frequent nocturia, feeling incomplete emptying)"}
                ],
                "default": 1,
                "tooltip": "While usually caused by benign prostatic hyperplasia (BPH), significant urinary symptoms warrant clinical workup.",
                "importance_note": "Can overlap with locally advanced disease."
            },
            {
                "id": "high_fat_dairy_diet",
                "label": "High Animal Fat & Dairy Diet",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Low (predominantly plant-based/Mediterranean diet)"},
                    {"value": 1, "label": "Moderate"},
                    {"value": 2, "label": "High (daily red meat, high-fat dairy, low lycopene/tomatoes)"}
                ],
                "default": 1,
                "tooltip": "Diets rich in saturated animal fats and calcium may elevate IGF-1 and prostate cancer progression.",
                "importance_note": "Lycopene (cooked tomatoes) and cruciferous vegetables are protective."
            },
            {
                "id": "prior_psa_level",
                "label": "Most Recent PSA Test Level (if known)",
                "type": "select",
                "options": [
                    {"value": 0, "label": "Never tested / Unknown"},
                    {"value": 1, "label": "Normal (< 2.5 ng/mL)"},
                    {"value": 2, "label": "Borderline (2.5 - 4.0 ng/mL)"},
                    {"value": 3, "label": "Elevated (> 4.0 ng/mL)"}
                ],
                "default": 0,
                "tooltip": "Prostate-Specific Antigen (PSA) is a blood biomarker. >4.0 ng/mL warrants clinical consultation.",
                "importance_note": "PSA velocity and free-to-total PSA ratio provide refined risk stratification."
            }
        ]
    }
}
