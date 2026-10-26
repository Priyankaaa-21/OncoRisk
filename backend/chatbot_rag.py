"""
RAG (Retrieval-Augmented Generation) Health Assistant Chatbot for OncoRisk.
Indexed over curated WHO, NCI, and ACS clinical cancer screening and prevention guidelines.
Strictly adheres to medical safety guardrails: refuses diagnoses and treatment plans,
and always cites authoritative sources.
"""

import re
from typing import List, Dict, Tuple
import numpy as np

# Curated Clinical Guidelines Knowledge Base
GUIDELINE_DOCUMENTS = [
    {
        "id": "acs_breast_2024",
        "title": "ACS Guidelines for the Early Detection of Breast Cancer (2024)",
        "source": "American Cancer Society (ACS) Breast Cancer Screening Guidelines",
        "citation": "[ACS Breast Screening Guidelines 2024]",
        "topics": ["breast", "mammogram", "mammography", "ultrasound", "lump", "dense breasts", "age 40"],
        "content": (
            "Women at average risk for breast cancer should have the option to start annual screening mammograms "
            "between ages 40 and 44. Women aged 45 to 54 should get mammograms every year. Women aged 55 and older can switch to "
            "mammograms every 2 years, or choose to continue yearly screening. Screening should continue as long as a woman is in good "
            "health and expected to live 10 more years or longer. Women at high risk (BRCA1/2 mutations or lifetime risk >20%) should get "
            "both an annual breast MRI and a mammogram starting around age 30."
        )
    },
    {
        "id": "uspstf_lung_2021",
        "title": "USPSTF Lung Cancer Screening Recommendations",
        "source": "U.S. Preventive Services Task Force (USPSTF) Final Recommendation Statement",
        "citation": "[USPSTF Lung Screening Recommendation 2021]",
        "topics": ["lung", "smoking", "pack-years", "ldct", "low dose ct", "cough", "chest pain", "shortness of breath"],
        "content": (
            "Annual screening for lung cancer with low-dose computed tomography (LDCT) is recommended for adults aged 50 to 80 years "
            "who have a 20 pack-year smoking history and currently smoke or have quit within the past 15 years. Screening should be "
            "discontinued once a person has not smoked for 15 years or develops a health problem that substantially limits life expectancy. "
            "LDCT has been proven to significantly reduce lung cancer mortality by catching early peripheral pulmonary nodules before metastasis."
        )
    },
    {
        "id": "who_cervical_elimination",
        "title": "WHO Global Strategy for Cervical Cancer Elimination",
        "source": "World Health Organization (WHO) Technical Guidelines",
        "citation": "[WHO Cervical Cancer Framework 2024]",
        "topics": ["cervical", "hpv", "pap smear", "vaccine", "gardasil", "stds", "partners"],
        "content": (
            "The World Health Organization (WHO) 90-70-90 targets specify that 90% of girls should be fully vaccinated with the HPV vaccine "
            "by age 15, 70% of women should be screened using a high-performance test (such as HPV DNA testing) at age 35 and again at age 45, "
            "and 90% of women identified with cervical disease receive treatment. HPV DNA testing has significantly higher sensitivity than "
            "conventional cytology (Pap smear) alone. HPV vaccination before sexual debut confers up to 90% protection against cervical malignancy."
        )
    },
    {
        "id": "acs_colorectal_2023",
        "title": "ACS Colorectal Cancer Screening Recommendations",
        "source": "American Cancer Society (ACS) Colorectal Screening Guidelines",
        "citation": "[ACS Colorectal Guidelines 2023]",
        "topics": ["colorectal", "colon", "rectal", "colonoscopy", "polyps", "blood in stool", "fit", "diet", "fiber"],
        "content": (
            "Regular screening for average-risk individuals begins at age 45. Screening options include stool-based tests (fecal "
            "immunochemical test [FIT] every year, or stool DNA-FIT every 3 years) or visual/structural exams (colonoscopy every 10 years, "
            "or CT colonography every 5 years). Any positive stool test must be followed up promptly with a timely diagnostic colonoscopy. "
            "Individuals with a first-degree relative diagnosed with colorectal cancer before age 50 should begin screening at age 40, or "
            "10 years before the youngest affected relative's diagnosis."
        )
    },
    {
        "id": "aad_skin_abcde",
        "title": "AAD Skin Cancer Detection and Melanoma ABCDE Rules",
        "source": "American Academy of Dermatology (AAD) Clinical Advisory",
        "citation": "[AAD Melanoma Guidelines 2024]",
        "topics": ["skin", "melanoma", "mole", "abcde", "sunburn", "spf", "sunscreen", "uv"],
        "content": (
            "Early detection of cutaneous melanoma relies on the ABCDE framework: A for Asymmetry (one half unlike the other), "
            "B for Border irregularity (scalloped, notched, or poorly defined), C for Color variation (shades of brown, black, white, red, or blue), "
            "D for Diameter greater than 6mm (approx. pencil eraser size, though early melanomas can be smaller), and E for Evolution (any change "
            "in size, shape, color, or symptoms such as itching or bleeding). Broad-spectrum daily SPF 30+ sunscreen, avoiding midday sun "
            "(10am-4pm), and eliminating indoor tanning bed use dramatically reduce cutaneous carcinogenesis risk."
        )
    },
    {
        "id": "nci_prostate_psa",
        "title": "NCI Prostate Cancer Screening and PSA Clinical Considerations",
        "source": "National Cancer Institute (NCI) Physician Data Query (PDQ)",
        "citation": "[NCI Prostate Screening PDQ 2024]",
        "topics": ["prostate", "psa", "urinary", "nocturia", "dre", "stream", "age 50"],
        "content": (
            "Men aged 50 and older (or age 45 for African-American men and men with a father or brother diagnosed with prostate cancer before age 65) "
            "should engage in shared decision-making with their doctor regarding Prostate-Specific Antigen (PSA) blood testing and Digital Rectal "
            "Examination (DRE). Elevated PSA (>4.0 ng/mL) can result from prostate cancer, benign prostatic hyperplasia (BPH), or prostatitis. "
            "Repeat testing, free PSA percentage, or multiparametric MRI (mpMRI) often precede prostate needle biopsy."
        )
    },
    {
        "id": "who_general_prevention",
        "title": "WHO Cancer Prevention Code and Modifiable Risk Factors",
        "source": "World Health Organization (WHO) Cancer Prevention Guidelines",
        "citation": "[WHO Cancer Prevention Strategy]",
        "topics": ["prevention", "lifestyle", "diet", "alcohol", "exercise", "weight", "bmi", "tobacco"],
        "content": (
            "Between 30% and 50% of all cancer deaths are preventable. Major preventive interventions include: avoiding tobacco products "
            "(responsible for 25% of all cancer deaths globally); maintaining a healthy body weight; consuming a diet rich in whole grains, "
            "vegetables, and fruits while limiting red and processed meats; avoiding or strictly limiting alcohol intake; engaging in regular "
            "physical activity (at least 150 minutes of moderate-intensity exercise weekly); and vaccinating against oncogenic viruses (HPV "
            "and Hepatitis B)."
        )
    },
    {
        "id": "nci_warning_signs",
        "title": "NCI Red-Flag Symptoms Requiring Prompt Clinical Evaluation",
        "source": "National Cancer Institute (NCI) Patient Education Portal",
        "citation": "[NCI Clinical Warning Signals]",
        "topics": ["symptoms", "warning signs", "red flag", "weight loss", "fatigue", "fever", "pain", "bleeding"],
        "content": (
            "General symptoms that warrant non-urgent but prompt medical evaluation include: unexplained weight loss of 10+ lbs without trying; "
            "persistent fever or fatigue that does not resolve with rest; skin changes such as hyperpigmentation or non-healing ulcers; "
            "changes in bowel or bladder habits; persistent hoarseness or persistent cough (>3 weeks); unusual bleeding or discharge (including "
            "hemoptysis, hematuria, or postmenopausal bleeding); and thickening or a painless lump in the breast, testicles, or lymph nodes."
        )
    }
]

DIAGNOSTIC_REFUSAL_TRIGGERS = [
    "do i have cancer", "diagnose me", "am i dying", "what stage", "prescribe",
    "what medicine should i take", "chemo dose", "radiation dose", "tell me if this is malignant",
    "can you diagnose", "is my lump cancer"
]


def tokenize(text: str) -> List[str]:
    return re.findall(r"\b[a-z0-9]+\b", text.lower())


def retrieve_relevant_guidelines(query: str, top_k: int = 2) -> List[dict]:
    query_tokens = set(tokenize(query))
    scored_docs = []

    for doc in GUIDELINE_DOCUMENTS:
        doc_tokens = set(tokenize(doc["content"] + " " + doc["title"] + " " + " ".join(doc["topics"])))
        overlap = len(query_tokens.intersection(doc_tokens))

        # Boost if topic keyword matches
        for topic in doc["topics"]:
            if topic in query.lower():
                overlap += 3

        if overlap > 0:
            scored_docs.append((overlap, doc))

    scored_docs.sort(key=lambda x: x[0], reverse=True)
    if not scored_docs:
        # Fallback to general prevention and red flags if no specific match
        return [GUIDELINE_DOCUMENTS[6], GUIDELINE_DOCUMENTS[7]]

    return [item[1] for item in scored_docs[:top_k]]


def check_diagnostic_refusal(query: str) -> bool:
    q = query.lower()
    return any(trigger in q for trigger in DIAGNOSTIC_REFUSAL_TRIGGERS)


def generate_rag_response(query: str, conversation_history: list = None) -> dict:
    """
    RAG generation with clinical citation and diagnostic guardrails.
    """
    is_refusal = check_diagnostic_refusal(query)
    matched_docs = retrieve_relevant_guidelines(query, top_k=2)

    citations = list(set(doc["citation"] for doc in matched_docs))
    passages = "\n\n".join([f"{doc['citation']}: {doc['content']}" for doc in matched_docs])

    # Follow-up question suggestions
    suggested_followups = [
        "What are the age guidelines for breast cancer mammograms?",
        "How do pack-years relate to lung cancer CT screening?",
        "What are the ABCDE warning signs for skin moles?",
        "When should someone begin colorectal cancer screening?"
    ]

    disclaimer = (
        "Medical Disclaimer: The OncoRisk AI Health Assistant provides evidence-based information from WHO, NCI, and ACS "
        "guidelines for awareness only. It cannot diagnose illnesses, interpret medical imaging, or recommend prescription therapies. "
        "Always discuss your medical symptoms with a qualified physician."
    )

    if is_refusal:
        answer = (
            "I cannot provide a medical diagnosis or prescribe a clinical treatment plan. As an AI cancer awareness tool, "
            "I am designed to explain screening guidelines and risk factors, but only a qualified physician or oncologist "
            "can evaluate your individual symptoms, perform physical exams, order biopsy imaging, and establish a diagnosis.\n\n"
            f"However, according to official clinical guidance:\n\n{passages}\n\n"
            "If you have noticed a new symptom or are feeling anxious, please schedule a clinical consultation with your "
            "primary care provider or local screening clinic right away."
        )
        return {
            "answer": answer,
            "citations": citations,
            "disclaimer": disclaimer,
            "suggested_followups": suggested_followups[:3]
        }

    # Informational question answering
    answer = (
        f"Based on evidence-based screening recommendations from established oncology authorities:\n\n"
        f"{passages}\n\n"
        f"Key Clinical Takeaway: Early detection dramatically improves treatment outcomes. If your personal risk profile "
        f"or family history matches the high-risk criteria mentioned above, discuss scheduling these screenings with your physician."
    )

    return {
        "answer": answer,
        "citations": citations,
        "disclaimer": disclaimer,
        "suggested_followups": suggested_followups[:3]
    }
