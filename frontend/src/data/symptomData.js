/**
 * Symptom checker dataset with clinical red-flag symptom tagging
 * and urgent care triage criteria.
 */

export const SYMPTOM_CATEGORIES = [
  {
    id: 'constitutional',
    name: 'General & Constitutional Symptoms',
    description: 'Systemic manifestations that affect the whole body.',
    symptoms: [
      {
        id: 'weight_loss',
        name: 'Unexplained Weight Loss (>10 lbs or 5% of body weight in 6 months)',
        isRedFlag: true,
        urgency: 'high',
        info: 'Significant unintended weight loss can reflect metabolic alterations from underlying systemic disease or solid tumors.'
      },
      {
        id: 'fatigue',
        name: 'Persistent Extreme Fatigue (Not relieved by sleep or rest)',
        isRedFlag: false,
        urgency: 'medium',
        info: 'Chronic fatigue that interferes with daily tasks warrants complete blood count (CBC) and metabolic panel evaluation.'
      },
      {
        id: 'night_sweats',
        name: 'Drenching Night Sweats (Requiring change of bedclothes)',
        isRedFlag: true,
        urgency: 'high',
        info: 'Drenching night sweats can be a B-symptom associated with lymphomas or infectious processes.'
      },
      {
        id: 'unexplained_fever',
        name: 'Persistent Low-Grade Fever Without Obvious Infection',
        isRedFlag: false,
        urgency: 'medium',
        info: 'Prolonged fever of unknown origin requires clinical workup.'
      }
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory & Thoracic Symptoms',
    description: 'Airway, lung, and thoracic chest sensations.',
    symptoms: [
      {
        id: 'hemoptysis',
        name: 'Coughing Up Blood or Rust-Colored Sputum',
        isRedFlag: true,
        urgency: 'urgent',
        info: 'Immediate medical evaluation required. Even streaks of blood in sputum necessitate chest imaging.'
      },
      {
        id: 'cough_3weeks',
        name: 'New Cough Lasting Greater Than 3 Weeks',
        isRedFlag: false,
        urgency: 'medium',
        info: 'A persistent non-resolving cough should be investigated with a chest X-ray or CT.'
      },
      {
        id: 'chest_pain_pleuritic',
        name: 'Chest, Shoulder, or Back Pain Worsened by Deep Breathing',
        isRedFlag: false,
        urgency: 'medium',
        info: 'Pleuritic pain can indicate pleural inflammation or chest wall contact.'
      },
      {
        id: 'hoarseness',
        name: 'Persistent Hoarseness or Voice Changes (>2 weeks)',
        isRedFlag: true,
        urgency: 'high',
        info: 'May indicate recurrent laryngeal nerve involvement or laryngeal vocal cord lesions.'
      }
    ]
  },
  {
    id: 'breast',
    name: 'Breast & Axillary Symptoms',
    description: 'Changes in breast tissue, nipple, or axillary lymph nodes.',
    symptoms: [
      {
        id: 'painless_lump',
        name: 'New Hard, Fixed, Painless Breast or Armpit Lump',
        isRedFlag: true,
        urgency: 'high',
        info: 'A discrete, hard, non-tender palpable mass requires diagnostic mammography and targeted sonography.'
      },
      {
        id: 'nipple_discharge',
        name: 'Spontaneous Bloody or Clear Nipple Discharge from One Breast',
        isRedFlag: true,
        urgency: 'high',
        info: 'Unilateral spontaneous fluid discharge warrants ductal evaluation.'
      },
      {
        id: 'skin_dimpling',
        name: "Skin Puckering, Dimpling, or 'Peau d'orange' Orange-Peel Texture",
        isRedFlag: true,
        urgency: 'urgent',
        info: 'Can indicate Cooper ligament tethering or inflammatory breast disease.'
      },
      {
        id: 'nipple_inversion',
        name: 'Newly Inverted or Retracted Nipple',
        isRedFlag: false,
        urgency: 'medium',
        info: 'Recent change in nipple orientation should be professionally evaluated.'
      }
    ]
  },
  {
    id: 'gastrointestinal',
    name: 'Gastrointestinal & Bowel Symptoms',
    description: 'Digestive tract and bowel habit alterations.',
    symptoms: [
      {
        id: 'rectal_bleeding',
        name: 'Blood in Stool (Bright red or dark tarry black melena)',
        isRedFlag: true,
        urgency: 'high',
        info: 'Requires colonoscopic visualization to rule out bleeding lesions, polyps, or vascular ectasia.'
      },
      {
        id: 'bowel_habit_change',
        name: 'Persistent Change in Bowel Habits (Diarrhea, Constipation, or Narrow Ribbon Stools >2 weeks)',
        isRedFlag: true,
        urgency: 'high',
        info: 'Narrow or pencil-thin stools suggest luminal narrowing.'
      },
      {
        id: 'dysphagia',
        name: 'Difficulty or Pain When Swallowing Food (Dysphagia)',
        isRedFlag: true,
        urgency: 'high',
        info: 'Sensation of food sticking in the chest or esophagus requires upper endoscopy.'
      },
      {
        id: 'early_satiety',
        name: 'Feeling Full Very Quickly When Eating (Early Satiety)',
        isRedFlag: false,
        urgency: 'medium',
        info: 'Inability to finish normal meals accompanied by abdominal bloating.'
      }
    ]
  },
  {
    id: 'skin_lesion',
    name: 'Skin & Mole Symptoms',
    description: 'Cutaneous alterations and pigment changes.',
    symptoms: [
      {
        id: 'mole_evolving',
        name: 'A Mole That is Growing, Changing Color, Itching, or Spontaneously Bleeding',
        isRedFlag: true,
        urgency: 'high',
        info: 'The "E" in ABCDE: evolution is the single most predictive feature of melanoma.'
      },
      {
        id: 'non_healing_sore',
        name: 'A Sore, Ulcer, or Crusted Patch That Does Not Heal in 4 Weeks',
        isRedFlag: true,
        urgency: 'high',
        info: 'Non-healing lesions on sun-exposed areas may represent basal or squamous cell carcinoma.'
      },
      {
        id: 'ugly_duckling_mole',
        name: "'Ugly Duckling' Sign: A Lesion That Looks Completely Different From All Others",
        isRedFlag: true,
        urgency: 'high',
        info: 'Clinical hallmark where a suspicious lesion stands out from the patient\'s background mole pattern.'
      }
    ]
  },
  {
    id: 'urological_gynecological',
    name: 'Urological & Gynecological Symptoms',
    description: 'Pelvic, urinary, and reproductive system indicators.',
    symptoms: [
      {
        id: 'postmenopausal_bleeding',
        name: 'Any Vaginal Bleeding After Menopause',
        isRedFlag: true,
        urgency: 'urgent',
        info: 'Postmenopausal bleeding is never normal and warrants immediate endometrial/cervical evaluation.'
      },
      {
        id: 'postcoital_bleeding',
        name: 'Bleeding Between Periods or After Intercourse',
        isRedFlag: true,
        urgency: 'high',
        info: 'Requires speculum examination, Pap smear, and cervical inspection.'
      },
      {
        id: 'hematuria',
        name: 'Visible Blood in Urine (Hematuria - Pink, Red, or Cola-Colored)',
        isRedFlag: true,
        urgency: 'urgent',
        info: 'Painless hematuria is the classic presentation for bladder, renal, or prostate pathology.'
      },
      {
        id: 'urinary_hesitancy',
        name: 'Severe Hesitancy, Weak Urinary Stream, or Straining to Void',
        isRedFlag: false,
        urgency: 'medium',
        info: 'Common in benign prostatic hyperplasia (BPH) but requires PSA and digital examination.'
      }
    ]
  }
];
