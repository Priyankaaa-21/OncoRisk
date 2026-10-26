/**
 * Educational Hub dataset:
 * - Myths vs. Facts
 * - 7 Evidence-Based Prevention Principles
 * - Interactive Screening Matrix by Age and Sex
 */

export const MYTHS_VS_FACTS = [
  {
    myth: "A cancer diagnosis is always a death sentence.",
    fact: "False. With modern early-detection screening, targeted therapies, and immunotherapies, millions of people with cancer live full lives. For example, localized breast and prostate cancers have 5-year survival rates exceeding 98%.",
    category: "Prognosis",
    tag: "Awareness"
  },
  {
    myth: "If no one in my family had cancer, I am completely safe.",
    fact: "False. Only about 5% to 10% of all cancers are hereditary. The remaining 90% to 95% result from acquired somatic DNA damage due to aging, lifestyle factors, and environmental exposures.",
    category: "Genetics",
    tag: "Heredity"
  },
  {
    myth: "Eating sugar directly causes cancer to grow faster.",
    fact: "False. While cancer cells consume glucose quickly, all cells require glucose for energy. Sugar does not selectively accelerate cancer growth. However, excessive sugar intake can contribute to obesity, which is a known risk factor for 13 cancer types.",
    category: "Nutrition",
    tag: "Diet"
  },
  {
    myth: "Biopsies cause cancer cells to seed and spread throughout the body.",
    fact: "Extremely rare with modern needle techniques. Standard diagnostic biopsies (fine-needle aspirates, core-needle biopsies) are performed safely with specialized sheathed needles that prevent tracking of tumor cells.",
    category: "Procedures",
    tag: "Diagnostics"
  },
  {
    myth: "Antiperspirants and deodorants cause breast cancer.",
    fact: "False. Rigorous epidemiological studies reviewed by the National Cancer Institute (NCI) and FDA found no evidence linking underarm antiperspirant use to breast cancer development.",
    category: "Lifestyle",
    tag: "Common Fears"
  },
  {
    myth: "Only heavy lifelong cigarette smokers get lung cancer.",
    fact: "False. Approximately 15% to 20% of lung cancer cases in women and men occur in individuals who have never smoked, often caused by radon gas, secondhand smoke, genetic mutations (EGFR/ALK), or air pollution.",
    category: "Pulmonary",
    tag: "Lung Health"
  }
];

export const PREVENTION_TIPS = [
  {
    id: 1,
    title: "Avoid Tobacco in All Forms",
    description: "Tobacco smoke contains over 70 established carcinogens. Quitting reduces your risk of 12 distinct cancer types and cuts lung cancer risk in half within 10 years.",
    icon: "ShieldAlert",
    action: "Call national quitlines or discuss nicotine replacement therapy (NRT) with your physician."
  },
  {
    id: 2,
    title: "Maintain a Healthy BMI & Exercise",
    description: "Obesity causes persistent low-grade systemic inflammation and elevated insulin/estrogen levels. Aim for at least 150 minutes of moderate aerobic activity weekly.",
    icon: "Activity",
    action: "Incorporate brisk walking, cycling, or resistance training into your daily routine."
  },
  {
    id: 3,
    title: "Emphasize Plant-Forward Mediterranean Diet",
    description: "Abundant dietary fiber from legumes, vegetables, and whole grains binds carcinogens and produces anti-inflammatory butyrate in the colon. Minimize ultra-processed foods.",
    icon: "Apple",
    action: "Limit red meat to <3 servings/week and avoid nitrate-preserved processed meats."
  },
  {
    id: 4,
    title: "Strictly Limit Alcohol Consumption",
    description: "Ethanol metabolizes into acetaldehyde, which causes direct double-stranded DNA breaks. Alcohol increases risk of breast, colorectal, esophageal, and liver cancers.",
    icon: "WineOff",
    action: "Moderate intake to at most 1 drink per day for women, 2 for men, or abstain entirely."
  },
  {
    id: 5,
    title: "Shield Your Skin from Ultraviolet (UV) Rays",
    description: "UV radiation induces thymine dimers in skin cell DNA, driving melanoma and non-melanoma skin cancers. Avoid sunburns and artificial UV tanning beds.",
    icon: "Sun",
    action: "Apply broad-spectrum SPF 30+ sunscreen daily, wear UV-rated clothing, and seek shade midday."
  },
  {
    id: 6,
    title: "Get Vaccinated (HPV & Hepatitis B)",
    description: "The 9-valent HPV vaccine prevents up to 90% of cervical, anal, and oropharyngeal cancers. The Hepatitis B vaccine prevents chronic cirrhosis and hepatocellular carcinoma.",
    icon: "Syringe",
    action: "Ensure adolescents complete the HPV vaccine series; catch-up is approved through age 45."
  },
  {
    id: 7,
    title: "Adhere to Age-Appropriate Screenings",
    description: "Screening tests identify pre-malignant dysplasia (cervical CIN, colonic adenomas) before they become invasive, and catch localized tumors when cure rates exceed 90%.",
    icon: "CalendarCheck",
    action: "Consult our interactive screening matrix below to see what you are currently eligible for."
  }
];

export const SCREENING_MATRIX = [
  {
    ageGroup: '20 - 39 Years',
    female: [
      {
        test: 'Cervical Cytology (Pap Smear)',
        interval: 'Every 3 years starting at age 21',
        guideline: 'USPSTF / ACOG',
        details: 'Evaluates cervical squamous epithelial cells for dysplastic pre-cancerous CIN changes.'
      },
      {
        test: 'Clinical Skin Self-Check (ABCDE)',
        interval: 'Monthly self-exam, annual dermatologist review',
        guideline: 'AAD',
        details: 'Inspect all moles for asymmetry, irregular borders, or changing diameter.'
      },
      {
        test: 'Clinical Breast Awareness',
        interval: 'Prompt evaluation of any new palpable mass',
        guideline: 'ACS',
        details: 'Familiarity with normal breast tissue architecture.'
      }
    ],
    male: [
      {
        test: 'Testicular Self-Examination',
        interval: 'Monthly self-check',
        guideline: 'AUA',
        details: 'Check for painless hard nodules or enlargement (peak incidence age 15-35).'
      },
      {
        test: 'Clinical Skin Self-Check (ABCDE)',
        interval: 'Monthly self-exam',
        guideline: 'AAD',
        details: 'Melanoma is one of the most common cancers diagnosed in young men.'
      }
    ]
  },
  {
    ageGroup: '40 - 49 Years',
    female: [
      {
        test: 'Screening Mammography',
        interval: 'Annual or biennial starting at age 40',
        guideline: 'USPSTF 2024 / ACS',
        details: 'USPSTF officially lowered recommended starting age to 40 for biennial mammography.'
      },
      {
        test: 'High-Risk HPV DNA + Pap Co-Testing',
        interval: 'Every 5 years (or Pap alone every 3 years)',
        guideline: 'USPSTF',
        details: 'Molecular high-risk HPV typing provides superior sensitivity for cervical dysplasia.'
      },
      {
        test: 'Colorectal Cancer Screening (Colonoscopy or FIT)',
        interval: 'Starting at age 45 (every 10 yrs for colonoscopy, annual for FIT)',
        guideline: 'ACS / USPSTF',
        details: 'Age lowered from 50 to 45 due to rising incidence of early-onset colorectal cancer.'
      }
    ],
    male: [
      {
        test: 'Colorectal Cancer Screening (Colonoscopy or FIT)',
        interval: 'Starting at age 45 (colonoscopy every 10 yrs or annual FIT)',
        guideline: 'ACS / USPSTF',
        details: 'Detects and resects precancerous adenomas before malignant transformation.'
      },
      {
        test: 'Prostate PSA Discussion (High-Risk Groups)',
        interval: 'Discuss starting at age 45 for Black men or family history',
        guideline: 'ACS / AUA',
        details: 'Shared decision-making on baseline serum PSA blood testing.'
      }
    ]
  },
  {
    ageGroup: '50 - 64 Years',
    female: [
      {
        test: 'Biennial or Annual Screening Mammogram',
        interval: 'Every 1 to 2 years through age 74',
        guideline: 'USPSTF / ACS',
        details: 'Core preventive modality for postmenopausal breast cancer.'
      },
      {
        test: 'Colorectal Screening (Colonoscopy / FIT)',
        interval: 'Colonoscopy every 10 yrs or annual FIT',
        guideline: 'USPSTF',
        details: 'Peak adenoma detection window; essential preventive adherence.'
      },
      {
        test: 'Low-Dose Helical CT (LDCT) Lung Screen',
        interval: 'Annual for smokers/former smokers with 20+ pack-years',
        guideline: 'USPSTF 2021',
        details: 'Ages 50-80 who currently smoke or quit within past 15 years.'
      }
    ],
    male: [
      {
        test: 'Serum PSA Blood Test + DRE Consultation',
        interval: 'Every 1 to 2 years based on baseline PSA level',
        guideline: 'ACS / AUA',
        details: 'For average-risk men starting at age 50 who choose screening.'
      },
      {
        test: 'Colorectal Screening (Colonoscopy / FIT)',
        interval: 'Colonoscopy every 10 yrs or annual FIT',
        guideline: 'USPSTF',
        details: 'Continues through age 75 for average-risk individuals.'
      },
      {
        test: 'Low-Dose Helical CT (LDCT) Lung Screen',
        interval: 'Annual for smokers/former smokers with 20+ pack-years',
        guideline: 'USPSTF 2021',
        details: 'Proven ~20% mortality reduction compared to standard chest radiography.'
      }
    ]
  },
  {
    ageGroup: '65+ Years',
    female: [
      {
        test: 'Screening Mammogram',
        interval: 'Every 1 to 2 years up to age 74 (and 75+ if in good health)',
        guideline: 'ACS',
        details: 'Beneficial as long as life expectancy is 10+ years.'
      },
      {
        test: 'Colorectal Screening',
        interval: 'Through age 75; selective 76-85',
        guideline: 'USPSTF',
        details: 'Continued screening tailored to overall health status.'
      },
      {
        test: 'Cervical Screening Exit Consultation',
        interval: 'Discontinue after age 65 if adequate prior negative screening',
        guideline: 'USPSTF',
        details: 'Can exit if 3 consecutive negative Pap tests or 2 negative HPV tests in past 10 years.'
      }
    ],
    male: [
      {
        test: 'Colorectal Screening',
        interval: 'Through age 75; individualized 76-85',
        guideline: 'USPSTF',
        details: 'Balance screening benefits against procedural colonoscopy risks.'
      },
      {
        test: 'Low-Dose CT Lung Screen',
        interval: 'Annual through age 80 (if 20+ pack-year criteria met)',
        guideline: 'USPSTF',
        details: 'Discontinued once 15 smoke-free years elapsed.'
      },
      {
        test: 'Prostate PSA Monitoring',
        interval: 'Individualized based on health and life expectancy',
        guideline: 'AUA',
        details: 'Screening generally not recommended for men with <10 years life expectancy.'
      }
    ]
  }
];
