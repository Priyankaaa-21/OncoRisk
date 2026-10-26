import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { CANCER_TYPES } from '../data/cancerTypes';
import { api } from '../services/api';

export default function AssessmentFormPage({
  cancerType,
  onBack,
  onSubmitSuccess,
}) {
  const cancerMeta = CANCER_TYPES.find((c) => c.id === cancerType) || CANCER_TYPES[0];

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // General & Demographics State
  const [age, setAge] = useState(48);
  const [sex, setSex] = useState(cancerMeta.targetSex === 'male' ? 'male' : 'female');
  const [heightCm, setHeightCm] = useState(168);
  const [weightKg, setWeightKg] = useState(70);
  const [bmi, setBmi] = useState(24.8);

  // Auto calculate BMI when height or weight changes
  useEffect(() => {
    if (heightCm > 50 && weightKg > 20) {
      const hM = heightCm / 100;
      const calculatedBmi = weightKg / (hM * hM);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
    }
  }, [heightCm, weightKg]);

  // Breast specific fields
  const [ageMenarche, setAgeMenarche] = useState(13);
  const [pregnancies, setPregnancies] = useState(1);
  const [breastfeedingMonths, setBreastfeedingMonths] = useState(6);
  const [hrtYears, setHrtYears] = useState(0);
  const [familyHistoryBreast, setFamilyHistoryBreast] = useState(0);
  const [alcoholDrinksWeek, setAlcoholDrinksWeek] = useState(1);
  const [physicalActivityHours, setPhysicalActivityHours] = useState(3.0);
  const [hasBiopsyData, setHasBiopsyData] = useState(false);
  const [meanRadius, setMeanRadius] = useState(14.1);
  const [meanTexture, setMeanTexture] = useState(19.2);
  const [meanPerimeter, setMeanPerimeter] = useState(91.9);
  const [meanArea, setMeanArea] = useState(654.8);
  const [meanSmoothness, setMeanSmoothness] = useState(0.096);
  const [meanConcavity, setMeanConcavity] = useState(0.088);

  // Lung specific fields
  const [smokingStatus, setSmokingStatus] = useState(1);
  const [smokingYears, setSmokingYears] = useState(15);
  const [packsPerDay, setPacksPerDay] = useState(1.0);
  const [occupationalExposure, setOccupationalExposure] = useState(0);
  const [airPollutionLevel, setAirPollutionLevel] = useState(1);
  const [chronicCough, setChronicCough] = useState(0);
  const [shortnessOfBreath, setShortnessOfBreath] = useState(0);
  const [chestPain, setChestPain] = useState(0);
  const [familyHistoryLung, setFamilyHistoryLung] = useState(0);

  // Cervical specific fields
  const [sexualPartners, setSexualPartners] = useState(2);
  const [firstIntercourseAge, setFirstIntercourseAge] = useState(18);
  const [hpvVaccineStatus, setHpvVaccineStatus] = useState(0);
  const [smokerCervical, setSmokerCervical] = useState(0);
  const [contraceptiveYears, setContraceptiveYears] = useState(2);
  const [stdsHistory, setStdsHistory] = useState(0);
  const [yearsSinceLastPap, setYearsSinceLastPap] = useState(2);

  // Skin specific fields
  const [skinType, setSkinType] = useState(2);
  const [severeSunburns, setSevereSunburns] = useState(2);
  const [tanningBedUse, setTanningBedUse] = useState(0);
  const [moleCount, setMoleCount] = useState(1);
  const [familyHistoryMelanoma, setFamilyHistoryMelanoma] = useState(0);
  const [asymmetry, setAsymmetry] = useState(0);
  const [borderIrregularity, setBorderIrregularity] = useState(0);
  const [colorVariation, setColorVariation] = useState(0);
  const [diameterOver6mm, setDiameterOver6mm] = useState(0);
  const [evolution, setEvolution] = useState(0);
  const [moleImageFile, setMoleImageFile] = useState(null);
  const [moleImagePreview, setMoleImagePreview] = useState(null);

  // Colorectal specific fields
  const [familyHistoryCrc, setFamilyHistoryCrc] = useState(0);
  const [ibdHistory, setIbdHistory] = useState(0);
  const [personalPolyps, setPersonalPolyps] = useState(0);
  const [redMeatFrequency, setRedMeatFrequency] = useState(1);
  const [fiberIntake, setFiberIntake] = useState(1);
  const [physicalInactivity, setPhysicalInactivity] = useState(1);
  const [rectalBleedingSymptom, setRectalBleedingSymptom] = useState(0);

  // Prostate specific fields
  const [familyHistoryProstate, setFamilyHistoryProstate] = useState(0);
  const [ethnicityRisk, setEthnicityRisk] = useState(1);
  const [urinarySymptoms, setUrinarySymptoms] = useState(1);
  const [highFatDairyDiet, setHighFatDairyDiet] = useState(1);
  const [priorPsaLevel, setPriorPsaLevel] = useState(0);

  // Step 3: Consent checkbox
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle skin image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMoleImageFile(file);
      setMoleImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setMoleImageFile(null);
    setMoleImagePreview(null);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage('You must acknowledge the informed consent checkbox before receiving risk calculations.');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      let result;
      if (cancerType === 'breast') {
        const payload = {
          consent: true,
          age,
          bmi,
          age_menarche: ageMenarche,
          pregnancies,
          breastfeeding_months: breastfeedingMonths,
          hrt_years: hrtYears,
          family_history_breast: familyHistoryBreast,
          alcohol_drinks_week: alcoholDrinksWeek,
          physical_activity_hours: physicalActivityHours,
          mean_radius: hasBiopsyData ? meanRadius : 14.1,
          mean_texture: hasBiopsyData ? meanTexture : 19.2,
          mean_perimeter: hasBiopsyData ? meanPerimeter : 91.9,
          mean_area: hasBiopsyData ? meanArea : 654.8,
          mean_smoothness: hasBiopsyData ? meanSmoothness : 0.096,
          mean_concavity: hasBiopsyData ? meanConcavity : 0.088,
        };
        result = await api.predictCancer('breast', payload);
      } else if (cancerType === 'lung') {
        const payload = {
          consent: true,
          age,
          smoking_status: smokingStatus,
          smoking_years: smokingYears,
          packs_per_day: packsPerDay,
          occupational_exposure: occupationalExposure,
          air_pollution_level: airPollutionLevel,
          chronic_cough: chronicCough,
          shortness_of_breath: shortnessOfBreath,
          chest_pain: chestPain,
          family_history_lung: familyHistoryLung,
        };
        result = await api.predictCancer('lung', payload);
      } else if (cancerType === 'cervical') {
        const payload = {
          consent: true,
          age,
          sexual_partners: sexualPartners,
          first_intercourse_age: firstIntercourseAge,
          hpv_vaccine_status: hpvVaccineStatus,
          smoker: smokerCervical,
          contraceptive_years: contraceptiveYears,
          stds_history: stdsHistory,
          years_since_last_pap: yearsSinceLastPap,
        };
        result = await api.predictCancer('cervical', payload);
      } else if (cancerType === 'skin') {
        if (moleImageFile) {
          const formData = new FormData();
          formData.append('consent', 'true');
          formData.append('age', age.toString());
          formData.append('skin_type', skinType.toString());
          formData.append('severe_sunburns', severeSunburns.toString());
          formData.append('tanning_bed_use', tanningBedUse.toString());
          formData.append('mole_count', moleCount.toString());
          formData.append('family_history_melanoma', familyHistoryMelanoma.toString());
          formData.append('asymmetry', asymmetry.toString());
          formData.append('border_irregularity', borderIrregularity.toString());
          formData.append('color_variation', colorVariation.toString());
          formData.append('diameter_over_6mm', diameterOver6mm.toString());
          formData.append('evolution', evolution.toString());
          formData.append('mole_image', moleImageFile);
          result = await api.predictSkin(formData);
        } else {
          const payload = {
            consent: true,
            age,
            skin_type: skinType,
            severe_sunburns: severeSunburns,
            tanning_bed_use: tanningBedUse,
            mole_count: moleCount,
            family_history_melanoma: familyHistoryMelanoma,
            asymmetry,
            border_irregularity: borderIrregularity,
            color_variation: colorVariation,
            diameter_over_6mm: diameterOver6mm,
            evolution,
          };
          result = await api.predictCancer('skin', payload);
        }
      } else if (cancerType === 'colorectal') {
        const payload = {
          consent: true,
          age,
          family_history_crc: familyHistoryCrc,
          ibd_history: ibdHistory,
          personal_polyps: personalPolyps,
          red_meat_frequency: redMeatFrequency,
          fiber_intake: fiberIntake,
          physical_inactivity: physicalInactivity,
          rectal_bleeding_symptom: rectalBleedingSymptom,
        };
        result = await api.predictCancer('colorectal', payload);
      } else if (cancerType === 'prostate') {
        const payload = {
          consent: true,
          age,
          family_history_prostate: familyHistoryProstate,
          ethnicity_risk: ethnicityRisk,
          urinary_symptoms: urinarySymptoms,
          high_fat_dairy_diet: highFatDairyDiet,
          prior_psa_level: priorPsaLevel,
        };
        result = await api.predictCancer('prostate', payload);
      }

      onSubmitSuccess(result, cancerType);
    } catch (err) {
      setErrorMessage(err.message || 'Error executing prediction pipeline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cancer Directory</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          {cancerMeta.name} Assessment
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className={currentStep === 1 ? 'text-teal-600 font-bold' : ''}>1. Demographics & Lifestyle</span>
          <span className={currentStep === 2 ? 'text-teal-600 font-bold' : ''}>2. Clinical Risk Factors</span>
          <span className={currentStep === 3 ? 'text-teal-600 font-bold' : ''}>3. Review & Consent</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
        
        {/* STEP 1: General & Demographics */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                General Demographics & Physical Parameters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Baseline biological information used across cancer incidence models
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Age (Years)</span>
                  <span title="Age is a primary non-modifiable risk factor across all oncologic malignancies.">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Biological Sex
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  disabled={cancerMeta.targetSex !== 'all'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 168)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Auto BMI Display Banner */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-800 dark:text-teal-300 font-semibold block">
                  Calculated Body Mass Index (BMI)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obesity class'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-300">{bmi}</span>
                <span className="text-xs text-slate-400 block">kg/m²</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow transition flex items-center gap-2"
              >
                <span>Continue to Clinical Risk Factors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Cancer-Specific Clinical Indicators */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {cancerMeta.name} Clinical Indicators
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Specific medical, exposure, and familial factors for {cancerMeta.name}
              </p>
            </div>

            {/* Breast Fields */}
            {cancerType === 'breast' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Age at First Menstruation (Years)</span>
                      <span title="Menarche before age 12 lengthens lifetime estrogen exposure.">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="20"
                      value={ageMenarche}
                      onChange={(e) => setAgeMenarche(parseInt(e.target.value) || 13)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Full-Term Pregnancies</span>
                      <span title="Full-term pregnancies induce terminal differentiation of mammary ducts.">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={pregnancies}
                      onChange={(e) => setPregnancies(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Months Breastfeeding
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={breastfeedingMonths}
                      onChange={(e) => setBreastfeedingMonths(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Hormone Replacement Therapy (HRT)</span>
                      <span title="Combined estrogen-progesterone HRT for 5+ years increases risk.">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    </label>
                    <select
                      value={hrtYears}
                      onChange={(e) => setHrtYears(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Never used HRT</option>
                      <option value="2">Used for 1 - 4 years</option>
                      <option value="7">Used for 5+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    First-Degree Relative with Breast Cancer
                  </label>
                  <select
                    value={familyHistoryBreast}
                    onChange={(e) => setFamilyHistoryBreast(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="0">No known family history</option>
                    <option value="1">One first-degree relative (mother, sister, daughter)</option>
                    <option value="2">Two or more relatives or known BRCA1/2 mutation</option>
                  </select>
                </div>

                {/* Optional Wisconsin Fine-Needle Aspiration Biopsy toggle */}
                <div className="p-4 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Optional: Fine-Needle Aspirate (FNA) Pathology Values
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Include cytology metrics from the Wisconsin dataset if available
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasBiopsyData(!hasBiopsyData)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        hasBiopsyData ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {hasBiopsyData ? 'Enabled' : '+ Add FNA Values'}
                    </button>
                  </div>

                  {hasBiopsyData && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400 block">Mean Radius</label>
                        <input
                          type="number"
                          step="0.1"
                          value={meanRadius}
                          onChange={(e) => setMeanRadius(parseFloat(e.target.value))}
                          className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400 block">Mean Texture</label>
                        <input
                          type="number"
                          step="0.1"
                          value={meanTexture}
                          onChange={(e) => setMeanTexture(parseFloat(e.target.value))}
                          className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 dark:text-slate-400 block">Mean Concavity</label>
                        <input
                          type="number"
                          step="0.01"
                          value={meanConcavity}
                          onChange={(e) => setMeanConcavity(parseFloat(e.target.value))}
                          className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lung Fields */}
            {cancerType === 'lung' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Smoking Status
                    </label>
                    <select
                      value={smokingStatus}
                      onChange={(e) => setSmokingStatus(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Never smoked (&lt;100 cigarettes in lifetime)</option>
                      <option value="1">Former smoker (quit &gt; 1 year ago)</option>
                      <option value="2">Current smoker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Years Smoked
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="70"
                      value={smokingYears}
                      onChange={(e) => setSmokingYears(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Packs Per Day
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={packsPerDay}
                      onChange={(e) => setPacksPerDay(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  {/* Calculated Pack-Years badge */}
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                    <span className="font-semibold text-sky-800 dark:text-sky-300">
                      Calculated Pack-Years:
                    </span>
                    <span className="font-extrabold text-base text-sky-700 dark:text-sky-300">
                      {(packsPerDay * smokingYears).toFixed(1)} Pack-Yrs
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Occupational Exposure
                    </label>
                    <select
                      value={occupationalExposure}
                      onChange={(e) => setOccupationalExposure(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">None / Office environment</option>
                      <option value="1">Moderate (diesel, silica dust, paints)</option>
                      <option value="2">High (asbestos, radon, mining, uranium)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ambient Air Pollution / Secondhand Smoke
                    </label>
                    <select
                      value={airPollutionLevel}
                      onChange={(e) => setAirPollutionLevel(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Low / Rural clean air</option>
                      <option value="1">Moderate / Suburban</option>
                      <option value="2">High / Major metropolitan area with heavy traffic</option>
                    </select>
                  </div>
                </div>

                {/* Respiratory Symptoms checklist */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Respiratory Symptoms:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chronicCough === 1}
                        onChange={(e) => setChronicCough(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>Chronic cough (&gt;3 wks)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shortnessOfBreath === 1}
                        onChange={(e) => setShortnessOfBreath(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>Shortness of breath / wheezing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chestPain === 1}
                        onChange={(e) => setChestPain(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>Deep breathing chest pain</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Cervical Fields */}
            {cancerType === 'cervical' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Lifetime Number of Sexual Partners
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={sexualPartners}
                      onChange={(e) => setSexualPartners(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Age at First Intercourse
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="35"
                      value={firstIntercourseAge}
                      onChange={(e) => setFirstIntercourseAge(parseInt(e.target.value) || 18)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      HPV Vaccination Status
                    </label>
                    <select
                      value={hpvVaccineStatus}
                      onChange={(e) => setHpvVaccineStatus(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="1">Vaccinated (Gardasil / Cervarix)</option>
                      <option value="0">Unvaccinated / Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Years on Oral Hormonal Contraceptives
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={contraceptiveYears}
                      onChange={(e) => setContraceptiveYears(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      History of STDs (Chlamydia, Trichomonas, Herpes)
                    </label>
                    <select
                      value={stdsHistory}
                      onChange={(e) => setStdsHistory(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">No STD history</option>
                      <option value="1">Yes (past treated or diagnosed STD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Years Since Last Pap Smear or HPV Screen
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={yearsSinceLastPap}
                      onChange={(e) => setYearsSinceLastPap(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Skin Fields */}
            {cancerType === 'skin' && (
              <div className="space-y-4 text-xs">
                
                {/* Optional Mole Image Upload */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-center relative">
                  {moleImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={moleImagePreview}
                        alt="Mole Preview"
                        className="w-32 h-32 object-cover rounded-2xl border-2 border-teal-500 shadow-md mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-[11px] font-semibold text-teal-600 mt-2">
                        Mole photo attached for CNN visual lesion analysis
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                      <label className="cursor-pointer">
                        <span className="font-semibold text-teal-600 hover:underline">
                          Upload a clear close-up photo of a mole / lesion
                        </span>{' '}
                        <span className="text-slate-500">(Optional)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Our algorithm analyzes pigment symmetry, boundary irregularity, and darkness variance.
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fitzpatrick Skin Phototype
                    </label>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="1">Type I: Pale white, burns easily, never tans</option>
                      <option value="2">Type II: Fair, burns easily, tans minimally</option>
                      <option value="3">Type III: Medium, burns moderately, tans gradually</option>
                      <option value="4">Type IV: Olive skin, rarely burns</option>
                      <option value="5">Type V/VI: Brown or dark skin, rarely burns</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Blistering Sunburns in Lifetime
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={severeSunburns}
                      onChange={(e) => setSevereSunburns(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tanning Bed Sessions
                    </label>
                    <select
                      value={tanningBedUse}
                      onChange={(e) => setTanningBedUse(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Never used indoor tanning</option>
                      <option value="1">Occasional (&lt;10 sessions)</option>
                      <option value="2">Frequent (10+ sessions)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Body Moles
                    </label>
                    <select
                      value={moleCount}
                      onChange={(e) => setMoleCount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Few (&lt;25 moles)</option>
                      <option value="1">Moderate (25 - 50 moles)</option>
                      <option value="2">Many (&gt;50 moles or atypical nevi)</option>
                    </select>
                  </div>
                </div>

                {/* ABCDE Questionnaire */}
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">
                    Clinical ABCDE Mole Checklist:
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={asymmetry === 1}
                        onChange={(e) => setAsymmetry(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span><strong>A - Asymmetry:</strong> One half does not match the other half</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={borderIrregularity === 1}
                        onChange={(e) => setBorderIrregularity(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span><strong>B - Border:</strong> Edges are ragged, notched, or blurred</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={colorVariation === 1}
                        onChange={(e) => setColorVariation(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span><strong>C - Color:</strong> Color is uneven (shades of brown, black, red, or blue)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diameterOver6mm === 1}
                        onChange={(e) => setDiameterOver6mm(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span><strong>D - Diameter:</strong> Larger than 6mm (approx. pencil eraser size)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={evolution === 1}
                        onChange={(e) => setEvolution(e.target.checked ? 1 : 0)}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span><strong>E - Evolution:</strong> Changing in size, shape, color, itching, or bleeding</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Colorectal Fields */}
            {cancerType === 'colorectal' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Family History of Colorectal Cancer or Polyps
                    </label>
                    <select
                      value={familyHistoryCrc}
                      onChange={(e) => setFamilyHistoryCrc(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">No known family history</option>
                      <option value="1">One relative diagnosed after age 50</option>
                      <option value="2">Relative diagnosed before 50 or multiple relatives</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Inflammatory Bowel Disease (Crohn's or Colitis)
                    </label>
                    <select
                      value={ibdHistory}
                      onChange={(e) => setIbdHistory(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">No IBD history</option>
                      <option value="1">Diagnosed with Crohn's or Ulcerative Colitis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Red & Processed Meat Consumption
                    </label>
                    <select
                      value={redMeatFrequency}
                      onChange={(e) => setRedMeatFrequency(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Low (&lt;2 servings per week)</option>
                      <option value="1">Moderate (3-5 servings per week)</option>
                      <option value="2">Daily or frequent processed meats (bacon, cold cuts)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dietary Fiber & Whole Grains
                    </label>
                    <select
                      value={fiberIntake}
                      onChange={(e) => setFiberIntake(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">High (daily beans, vegetables, oats, whole grains)</option>
                      <option value="1">Average fiber</option>
                      <option value="2">Low fiber intake</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood in Stool or Persistent Bowel Habit Changes
                  </label>
                  <select
                    value={rectalBleedingSymptom}
                    onChange={(e) => setRectalBleedingSymptom(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="0">No rectal bleeding or persistent bowel changes</option>
                    <option value="1">Yes - Noticed blood in stool or change in caliber &gt;2 wks</option>
                  </select>
                </div>
              </div>
            )}

            {/* Prostate Fields */}
            {cancerType === 'prostate' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Family History of Prostate Cancer
                    </label>
                    <select
                      value={familyHistoryProstate}
                      onChange={(e) => setFamilyHistoryProstate(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">No family history</option>
                      <option value="1">One first-degree relative (father or brother)</option>
                      <option value="2">Two or more relatives or diagnosed before 55</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ethnicity / Ancestry Risk
                    </label>
                    <select
                      value={ethnicityRisk}
                      onChange={(e) => setEthnicityRisk(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Asian / Hispanic / Other average risk</option>
                      <option value="1">Caucasian average risk</option>
                      <option value="2">African descent / Black (higher incidence and aggressive risk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Urinary Stream Symptoms
                    </label>
                    <select
                      value={urinarySymptoms}
                      onChange={(e) => setUrinarySymptoms(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Normal urination</option>
                      <option value="1">Mild nocturia (waking at night) or occasional weak stream</option>
                      <option value="2">Moderate/severe hesitancy, straining, or incomplete emptying</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Prior PSA Test Level (if known)
                    </label>
                    <select
                      value={priorPsaLevel}
                      onChange={(e) => setPriorPsaLevel(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="0">Never tested / Unknown</option>
                      <option value="1">Normal (&lt; 2.5 ng/mL)</option>
                      <option value="2">Borderline (2.5 - 4.0 ng/mL)</option>
                      <option value="3">Elevated (&gt; 4.0 ng/mL)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Back to Demographics
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow transition flex items-center gap-2"
              >
                <span>Proceed to Review & Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Mandatory Consent */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Review Profile & Mandatory Consent
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify your parameters and acknowledge clinical awareness guidelines before computation
              </p>
            </div>

            {/* Quick Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Parameters Summary:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="block text-[11px] text-slate-400">Target Cancer:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{cancerMeta.name}</strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Age & Sex:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{age} yrs ({sex})</strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">BMI:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{bmi} kg/m²</strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Photo Attached:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{moleImageFile ? 'Yes' : 'No'}</strong>
                </div>
              </div>
            </div>

            {/* Mandatory Medical Consent Checkbox */}
            <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border-2 border-teal-500/40 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  id="consent_checkbox"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 rounded text-teal-600 focus:ring-teal-500 w-5 h-5 cursor-pointer"
                />
                <label htmlFor="consent_checkbox" className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed cursor-pointer">
                  <strong className="font-bold text-teal-900 dark:text-teal-200 block mb-1">
                    Statutory Medical Disclaimer & Consent Confirmation
                  </strong>
                  I understand and agree that OncoRisk provides mathematical risk probability estimates for educational awareness and early-screening promotion only. It does <strong>NOT</strong> provide a definitive clinical diagnosis, oncology staging, or medical treatment plan. I consent to algorithmic estimation of my risk factors and will consult a licensed healthcare professional for any medical evaluation.
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Back to Clinical Factors
              </button>
              <button
                type="submit"
                disabled={loading || !consent}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-bold text-sm shadow-lg shadow-teal-500/25 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calibrating Clinical Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Calculate My Risk Score</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
}
