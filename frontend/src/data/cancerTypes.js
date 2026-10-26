/**
 * Cancer types metadata, icons, clinical overview, and form field specifications.
 */

export const CANCER_TYPES = [
  {
    id: 'breast',
    name: 'Breast Cancer',
    tagline: 'Most common cancer in women globally; highly treatable when detected early.',
    description: 'Estimates personalized risk using lifetime hormonal exposure (menarche, pregnancies, HRT), family history, and lifestyle factors, with optional Wisconsin fine-needle aspirate cytology parameters.',
    badge: 'Mammography & Biopsy',
    color: 'from-pink-500 to-rose-600',
    accentColor: 'rose',
    targetSex: 'female',
    screeningAge: 'Age 40+',
    keyTests: ['Screening Mammography', 'Breast Ultrasound', 'Clinical Breast Exam'],
    endpoint: 'breast'
  },
  {
    id: 'lung',
    name: 'Lung Cancer',
    tagline: 'Leading cause of cancer mortality worldwide; early low-dose CT saves lives.',
    description: 'Analyzes cumulative tobacco pack-years, occupational carcinogen exposure (radon, asbestos), chronic pulmonary symptoms, and ambient particulate pollution.',
    badge: 'Low-Dose CT (LDCT)',
    color: 'from-sky-500 to-blue-600',
    accentColor: 'sky',
    targetSex: 'all',
    screeningAge: 'Age 50-80 (smokers)',
    keyTests: ['Annual Low-Dose Helical CT (LDCT)', 'Spirometry', 'Chest X-ray'],
    endpoint: 'lung'
  },
  {
    id: 'cervical',
    name: 'Cervical Cancer',
    tagline: 'Almost 100% preventable through HPV vaccination and timely Pap co-testing.',
    description: 'Evaluates oncogenic HPV exposure risk, lifetime partners, contraceptive history, STD co-factors, and interval latency since last Pap smear or HPV DNA screen.',
    badge: 'Pap Smear + HPV DNA',
    color: 'from-teal-500 to-emerald-600',
    accentColor: 'teal',
    targetSex: 'female',
    screeningAge: 'Age 21-65',
    keyTests: ['HPV DNA Molecular Testing', 'Liquid-Based Pap Cytology', 'Colposcopy'],
    endpoint: 'cervical'
  },
  {
    id: 'skin',
    name: 'Skin Cancer & Melanoma',
    tagline: 'Rapidly increasing in young adults; visual ABCDE surveillance is vital.',
    description: 'Combines dermatologic ABCDE criteria (Asymmetry, Border, Color, Diameter, Evolution), Fitzpatrick phototypes, blistering sunburn history, and optional mole photo analysis.',
    badge: 'Dermoscopy & ABCDE',
    color: 'from-amber-500 to-orange-600',
    accentColor: 'amber',
    targetSex: 'all',
    screeningAge: 'All ages',
    keyTests: ['Total Body Skin Exam (TBSE)', 'High-Resolution Dermoscopy', 'Biopsy'],
    endpoint: 'skin'
  },
  {
    id: 'colorectal',
    name: 'Colorectal Cancer',
    tagline: 'Precancerous adenomatous polyps take 7-10 years to form; screening removes them.',
    description: 'Assesses dietary fiber vs. red/processed meat ratios, family history of colonic polyps/Lynch syndrome, inflammatory bowel disease, and red-flag gastrointestinal bleeding.',
    badge: 'Colonoscopy & FIT',
    color: 'from-indigo-500 to-violet-600',
    accentColor: 'indigo',
    targetSex: 'all',
    screeningAge: 'Age 45+',
    keyTests: ['Optical Colonoscopy', 'Fecal Immunochemical Test (FIT)', 'Stool DNA'],
    endpoint: 'colorectal'
  },
  {
    id: 'prostate',
    name: 'Prostate Cancer',
    tagline: 'Most frequent cancer among men; slow-growing with high 5-year survival.',
    description: 'Integrates age progression, racial disparities (elevated incidence in African ancestry), first-degree familial genetics, lower urinary tract symptoms, and prior PSA baseline values.',
    badge: 'Serum PSA & DRE',
    color: 'from-cyan-600 to-blue-700',
    accentColor: 'cyan',
    targetSex: 'male',
    screeningAge: 'Age 45-50+',
    keyTests: ['Serum PSA Blood Test', 'Digital Rectal Exam (DRE)', 'Multiparametric MRI'],
    endpoint: 'prostate'
  }
];
