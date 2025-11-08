
import type { Step } from '../types';

export const DECISION_TREE: Record<string, Step> = {
  start: {
    id: 'start',
    type: 'demographics',
    prompt: 'Patient Demographics',
  },
  gender_selected: {
    id: 'gender_selected',
    type: 'single-choice',
    category: 'Assess',
    prompt: 'Select the patient\'s primary presenting symptom group:',
  },
  male_symptoms: {
    id: 'male_symptoms',
    type: 'single-choice',
    category: 'Assess',
    prompt: 'Select the patient\'s primary presenting symptom group:',
    options: [
      { text: 'Redness, Swelling, Burning of Genital Area', nextStepId: 'male_redness_start' },
      { text: 'Urine Leakage, Oliguria, Haematuria, Polyuria, Burning Micturition', nextStepId: 'male_urinary_issues_start' },
      { text: 'Scrotal Swelling', nextStepId: 'male_scrotal_swelling_start' },
    ],
  },
  female_symptoms: {
    id: 'female_symptoms',
    type: 'single-choice',
    category: 'Assess',
    prompt: 'Select the patient\'s primary presenting symptom group:',
    options: [
      { text: 'Swelling, Burning of Genital Area', nextStepId: 'female_swelling_burning_start' },
      { text: 'Urine Leakage, Oliguria, Haematuria, Polyuria, Burning Micturition', nextStepId: 'female_urinary_issues_start' },
      { text: 'Vaginal Bleeding', nextStepId: 'female_vaginal_bleeding_start' },
      { text: 'Vaginal Discharge', nextStepId: 'female_vaginal_discharge_start' },
    ],
  },
  refer_immediately: {
    id: 'refer_immediately',
    type: 'diagnosis',
    // FIX: Add missing prompt property
    prompt: '',
    category: 'Diagnosis',
    diagnosis: 'REFER IMMEDIATELY',
    details: 'Patient presents with one or more referral signs. Immediate referral to a higher center or specialist is required. Signs may include: High grade fever (>39.5°C), Hypotension (BP < 90/60), Severe Pain, Trauma, Severe Bleeding, Pregnancy with complications.',
    isReferral: true,
  },

  // MALE: Redness, Swelling, Burning
  male_redness_start: {
    id: 'male_redness_start',
    type: 'single-choice',
    category: 'Ask',
    prompt: 'Are there any associated referral signs like high fever, severe pain, or trauma?',
    options: [
        { text: 'Yes', nextStepId: 'refer_immediately' },
        { text: 'No', nextStepId: 'male_redness_discharge' },
    ]
  },
  male_redness_discharge: {
    id: 'male_redness_discharge',
    type: 'single-choice',
    category: 'Inspect',
    prompt: 'Is there any urethral discharge?',
    options: [
        { text: 'Yes', nextStepId: 'male_urethral_discharge_urine' },
        { text: 'No, no discharge', nextStepId: 'male_redness_no_discharge' },
    ]
  },
  male_redness_no_discharge: {
    id: 'male_redness_no_discharge',
    type: 'single-choice',
    category: 'Inspect',
    prompt: 'What are the symptoms associated with the redness?',
    options: [
        { text: 'Itching, burning, and whitish discharge on the glans/prepuce', nextStepId: 'diagnosis_fungal_infection' },
        { text: 'Associated with phimosis, erythema, swelling, macular/popular rash', nextStepId: 'diagnosis_bacterial_infection' },
        { text: 'Just redness without other specific symptoms', nextStepId: 'diagnosis_balanitis' },
    ]
  },
  male_urethral_discharge_urine: {
    id: 'male_urethral_discharge_urine',
    type: 'info',
    category: 'Ask',
    prompt: 'Inquire about urinary symptoms.',
    details: 'Ask: "Is there painful urination (brining) with increased frequency?" Based on your assessment of the discharge and symptoms, proceed.',
    options: [{ text: 'Continue', nextStepId: 'diagnosis_gonococcal_chlamydial' }]
  },

  // MALE: Scrotal Swelling
  male_scrotal_swelling_start: {
      id: 'male_scrotal_swelling_start',
      type: 'single-choice',
      category: 'Ask',
      prompt: 'Are there any associated referral signs like suspected testicular torsion, high fever, or trauma?',
      options: [
          { text: 'Yes', nextStepId: 'refer_immediately' },
          { text: 'No', nextStepId: 'male_scrotal_swelling_pain' },
      ]
  },
  male_scrotal_swelling_pain: {
      id: 'male_scrotal_swelling_pain',
      type: 'single-choice',
      category: 'Ask',
      prompt: 'Is the scrotal swelling painful or painless?',
      options: [
          { text: 'Painful', nextStepId: 'male_scrotal_swelling_painful_symptoms' },
          { text: 'Painless', nextStepId: 'male_scrotal_swelling_painless_symptoms' },
      ]
  },
  male_scrotal_swelling_painless_symptoms: {
      id: 'male_scrotal_swelling_painless_symptoms',
      type: 'single-choice',
      category: 'Inspect',
      prompt: 'What are the characteristics of the painless swelling?',
      options: [
          { text: 'Painless at rest, discomfort on bending/coughing, positive cough impulse.', nextStepId: 'diagnosis_hernia' },
          { text: 'Translucent, painless swelling with positive cough impulse.', nextStepId: 'diagnosis_testicular_carcinoma' },
          { text: 'Translucent, painless swelling with negative cough impulse.', nextStepId: 'diagnosis_hydrocele' },
      ]
  },
  male_scrotal_swelling_painful_symptoms: {
      id: 'male_scrotal_swelling_painful_symptoms',
      type: 'single-choice',
      category: 'Ask',
      prompt: 'What are the characteristics of the painful swelling?',
      options: [
          { text: 'Low grade fever, chills, heaviness, pain worsens with bowel movements.', nextStepId: 'diagnosis_epididymitis' },
          { text: 'Fever, myalgia, facial swelling, cough.', nextStepId: 'diagnosis_mumps' },
          { text: 'History of trauma, sudden severe pain, lower abdominal tenderness.', nextStepId: 'diagnosis_testicular_trauma_torsion' },
          { text: 'History of hernia, nausea, vomiting, fever. Bulge is reddish/purple/dark.', nextStepId: 'diagnosis_incarcerated_hernia' },
      ]
  },

  // FEMALE: Vaginal Discharge
  female_vaginal_discharge_start: {
    id: 'female_vaginal_discharge_start',
    type: 'single-choice',
    category: 'Ask',
    prompt: 'Are there any associated referral signs like high fever, severe bleeding/pain, or history of abuse?',
    options: [
      { text: 'Yes', nextStepId: 'refer_immediately' },
      { text: 'No', nextStepId: 'female_vaginal_discharge_type' },
    ]
  },
  female_vaginal_discharge_type: {
    id: 'female_vaginal_discharge_type',
    type: 'single-choice',
    category: 'Inspect',
    prompt: 'What are the characteristics of the vaginal discharge?',
    options: [
      { text: 'White or clear, non-offensive, varies with menstrual cycle', nextStepId: 'diagnosis_normal_physiological' },
      { text: 'Associated with fever, abnormal bleeding, dysmenorrhea, dysuria', nextStepId: 'diagnosis_pid' },
      { text: 'Associated with inter-menstrual/post-coital bleeding, weight loss', nextStepId: 'diagnosis_cervical_cancer_screening' },
      { text: 'Profuse, malodorous, frothy, yellowish-green colored', nextStepId: 'diagnosis_trichomoniasis' },
      { text: 'Homogenous, adherent, fishy odor, grey colored', nextStepId: 'diagnosis_bacterial_vaginitis' },
      { text: 'Oedema, fissures, erosions, curdy white discharge', nextStepId: 'diagnosis_candidiasis' },
      { text: 'Discharge from cervix confirmed with speculum exam', nextStepId: 'diagnosis_cervicitis' },
    ]
  },

  // FEMALE: Swelling/Burning Genital Area
  female_swelling_burning_start: {
    id: 'female_swelling_burning_start',
    type: 'single-choice',
    category: 'Ask',
    prompt: 'Are there any associated referral signs like pregnancy, severe bleeding, or hypotension?',
    options: [
        { text: 'Yes', nextStepId: 'refer_immediately' },
        { text: 'No', nextStepId: 'female_swelling_location' },
    ]
  },
  female_swelling_location: {
      id: 'female_swelling_location',
      type: 'single-choice',
      category: 'Inspect',
      prompt: 'Where is the primary swelling or what is the primary symptom?',
      options: [
          { text: 'Swelling in the Inguinal Area (Bubo)', nextStepId: 'female_inguinal_swelling' },
          { text: 'Genital Ulcer / Burning Sensation', nextStepId: 'female_genital_ulcer' },
      ]
  },
  female_inguinal_swelling: {
      id: 'female_inguinal_swelling',
      type: 'single-choice',
      category: 'Inspect',
      prompt: 'Observe the inguinal swelling and any associated ulcers.',
      options: [
          { text: 'Transient genital ulcer followed by inflamed & enlarged inguinal lymph nodes.', nextStepId: 'diagnosis_lgv' },
          { text: 'Multiple painful ulcers with ragged edges and yellowish-grey floor.', nextStepId: 'diagnosis_chancroid' },
      ]
  },
  female_genital_ulcer: {
      id: 'female_genital_ulcer',
      type: 'single-choice',
      category: 'Inspect',
      prompt: 'What are the characteristics of the genital ulcer(s)?',
      options: [
          { text: 'Single or multiple PAINFUL ulcers', nextStepId: 'diagnosis_syphilis' },
          { text: 'Single or multiple PAINLESS ulcers', nextStepId: 'diagnosis_syphilis' },
          { text: 'Painful vesicles with ulcers', nextStepId: 'diagnosis_herpes' },
      ]
  },
  
  // DIAGNOSES
  diagnosis_balanitis: {
    id: 'diagnosis_balanitis', type: 'diagnosis', prompt: '', diagnosis: 'Balanitis',
    details: 'Inflammation of the glans penis. Advise on hygiene. Consider bacterial or fungal causes if persistent.',
  },
  diagnosis_bacterial_infection: {
    id: 'diagnosis_bacterial_infection', type: 'diagnosis', prompt: '', diagnosis: 'Bacterial Infection (Balanitis)',
    details: 'Likely bacterial balanitis, possibly associated with phimosis. Management includes hygiene, and topical or oral antibiotics may be required.',
  },
  diagnosis_fungal_infection: {
    id: 'diagnosis_fungal_infection', type: 'diagnosis', prompt: '', diagnosis: 'Fungal Infection (Candidal Balanitis)',
    details: 'Inflammation likely caused by Candida. Advise on hygiene and consider topical antifungal cream.',
  },
  diagnosis_gonococcal_chlamydial: {
    id: 'diagnosis_gonococcal_chlamydial', type: 'diagnosis', prompt: '', diagnosis: 'Gonococcal / Chlamydial Infection (Urethritis)',
    details: 'Urethral discharge with painful urination is highly suggestive of a sexually transmitted infection like Gonorrhea or Chlamydia. Treat for both, advise partner notification, and safe sex practices.',
  },
  diagnosis_hernia: {
      id: 'diagnosis_hernia', type: 'diagnosis', prompt: '', diagnosis: 'Inguinal Hernia',
      details: 'A bulge in the groin area. The positive cough impulse is a key sign. Refer for surgical evaluation.',
  },
  diagnosis_testicular_carcinoma: {
      id: 'diagnosis_testicular_carcinoma', type: 'diagnosis', prompt: '', diagnosis: 'Suspected Testicular Carcinoma',
      details: 'A painless, solid mass in the testis is suspicious for malignancy until proven otherwise. Urgent referral to urology is necessary.',
      isReferral: true
  },
  diagnosis_hydrocele: {
      id: 'diagnosis_hydrocele', type: 'diagnosis', prompt: '', diagnosis: 'Hydrocele',
      details: 'A collection of fluid around a testicle. It is typically harmless. Transillumination can help confirm. Refer if large, painful, or causing concern.',
  },
  diagnosis_epididymitis: {
      id: 'diagnosis_epididymitis', type: 'diagnosis', prompt: '', diagnosis: 'Epididymitis',
      details: 'Inflammation of the epididymis, usually due to bacterial infection (STI in younger men, UTI in older men). Requires antibiotic treatment.',
  },
  diagnosis_mumps: {
      id: 'diagnosis_mumps', type: 'diagnosis', prompt: '', diagnosis: 'Mumps Orchitis',
      details: 'Testicular inflammation as a complication of the mumps virus. Management is supportive.',
  },
  diagnosis_testicular_trauma_torsion: {
      id: 'diagnosis_testicular_trauma_torsion', type: 'diagnosis', prompt: '', diagnosis: 'Testicular Trauma / Torsion',
      details: 'This is a urological emergency. Sudden onset of severe pain requires immediate referral to rule out testicular torsion, which needs urgent surgery to save the testicle.',
      isReferral: true,
  },
  diagnosis_incarcerated_hernia: {
      id: 'diagnosis_incarcerated_hernia', type: 'diagnosis', prompt: '', diagnosis: 'Incarcerated / Strangulated Inguinal Hernia',
      details: 'This is a surgical emergency. The hernia is trapped and its blood supply may be cut off. Requires immediate referral to surgery.',
      isReferral: true,
  },
  diagnosis_normal_physiological: {
    id: 'diagnosis_normal_physiological', type: 'diagnosis', prompt: '', diagnosis: 'Normal Physiological Discharge (Leukorrhea)',
    details: 'This is a normal finding. Reassure the patient that this is the body\'s natural way of keeping the vagina clean and healthy. No treatment is needed.',
  },
  diagnosis_pid: {
    id: 'diagnosis_pid', type: 'diagnosis', prompt: '', diagnosis: 'Pelvic Inflammatory Disease (PID)',
    details: 'An infection of the female reproductive organs. Requires prompt antibiotic treatment to prevent long-term complications. Advise partner notification.',
  },
  diagnosis_cervical_cancer_screening: {
    id: 'diagnosis_cervical_cancer_screening', type: 'diagnosis', prompt: '', diagnosis: 'Requires Cervical Cancer Screening',
    details: 'Symptoms like inter-menstrual or post-coital bleeding are red flags. The patient should be referred for a gynecological evaluation, including a Pap smear and possibly other investigations.',
    isReferral: true,
  },
  diagnosis_trichomoniasis: {
    id: 'diagnosis_trichomoniasis', type: 'diagnosis', prompt: '', diagnosis: 'Trichomoniasis',
    details: 'A common sexually transmitted infection. Treat with metronidazole or tinidazole. Advise partner treatment and safe sex practices.',
  },
  diagnosis_bacterial_vaginitis: {
    id: 'diagnosis_bacterial_vaginitis', type: 'diagnosis', prompt: '', diagnosis: 'Bacterial Vaginosis (BV)',
    details: 'An imbalance of vaginal bacteria. Treatment is typically with metronidazole or clindamycin. It is not considered an STI but is associated with sexual activity.',
  },
  diagnosis_candidiasis: {
    id: 'diagnosis_candidiasis', type: 'diagnosis', prompt: '', diagnosis: 'Vaginal Candidiasis (Yeast Infection)',
    details: 'A fungal infection. Can be treated with over-the-counter or prescription antifungal medications (creams, suppositories, or oral tablets).',
  },
  diagnosis_cervicitis: {
    id: 'diagnosis_cervicitis', type: 'diagnosis', prompt: '', diagnosis: 'Cervicitis',
    details: 'Inflammation of the cervix, often caused by STIs like Chlamydia or Gonorrhea. Treatment depends on the underlying cause. Requires speculum examination and testing.',
  },
  diagnosis_lgv: {
      id: 'diagnosis_lgv', type: 'diagnosis', prompt: '', diagnosis: 'Lymphogranuloma Venereum (LGV)',
      details: 'A sexually transmitted infection caused by specific strains of Chlamydia trachomatis. Requires a prolonged course of antibiotics (e.g., doxycycline).',
  },
  diagnosis_chancroid: {
      id: 'diagnosis_chancroid', type: 'diagnosis', prompt: '', diagnosis: 'Chancroid',
      details: 'A bacterial sexually transmitted infection characterized by painful genital ulcers and swollen lymph nodes. Requires antibiotic treatment.',
  },
  diagnosis_syphilis: {
      id: 'diagnosis_syphilis', type: 'diagnosis', prompt: '', diagnosis: 'Syphilis',
      details: 'A bacterial sexually transmitted infection. The primary stage often presents as a painless ulcer (chancre). Requires antibiotic treatment (typically penicillin). Lab testing is crucial for confirmation.',
  },
  diagnosis_herpes: {
      id: 'diagnosis_herpes', type: 'diagnosis', prompt: '', diagnosis: 'Genital Herpes (HSV)',
      details: 'A common viral sexually transmitted infection causing painful vesicles or ulcers. Managed with antiviral medications to control outbreaks.',
  }
};