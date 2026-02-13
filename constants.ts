import { DiseaseType, AgeGuideline, FormulaStats } from './types';

export const DISEASE_METADATA = {
  [DiseaseType.PKU]: {
    en: { name: 'Phenylketonuria', short: 'PKU' },
    ar: { name: 'بيلة الفينيل كيتون', short: 'PKU' },
    primaryLimiter: 'PHE'
  },
  [DiseaseType.MMA_PA]: {
    en: { name: 'Methylmalonic / Propionic Acidemia', short: 'MMA/PA' },
    ar: { name: 'حموضة ميثيل مالونيك / بروبيونيك', short: 'MMA/PA' },
    primaryLimiter: 'MET'
  },
  [DiseaseType.MSUD]: {
    en: { name: 'Maple Syrup Urine Disease', short: 'MSUD' },
    ar: { name: 'داء بول شراب القيقب', short: 'MSUD' },
    primaryLimiter: 'LEU'
  },
  [DiseaseType.GA]: {
    en: { name: 'Glutaric Acidemia', short: 'GA' },
    ar: { name: 'حموضة الغلوتاريك', short: 'GA' },
    primaryLimiter: 'LYS'
  },
  [DiseaseType.UCD]: {
    en: { name: 'Urea Cycle Disorders', short: 'UCD' },
    ar: { name: 'اضطرابات دورة اليوريا', short: 'UCD' },
    primaryLimiter: 'Intact Pro'
  },
};

export const FORMULA_KEY_BY_DISEASE: Record<DiseaseType, { standard: string; special: string }> = {
  [DiseaseType.PKU]: { standard: 'PKU_STD', special: 'PKU_SPEC' },
  [DiseaseType.MMA_PA]: { standard: 'MMA_STD', special: 'MMA_SPEC' },
  [DiseaseType.MSUD]: { standard: 'MSUD_STD', special: 'MSUD_SPEC' },
  [DiseaseType.GA]: { standard: 'GA_STD', special: 'GA_SPEC' },
  [DiseaseType.UCD]: { standard: 'UCD_STD', special: 'UCD_SPEC' },
};

export const UI_STRINGS = {
  ar: {
    appTitle: 'Metabolic Formula Pro',
    subtitle: 'Simple case-style calculator',
    switchLang: 'English',
    patientData: 'بيانات الحالة',
    diagnosis: 'التشخيص',
    weight: 'الوزن (كجم)',
    ageGroup: 'الفئة العمرية',
    targetMode: 'نمط الهدف',
    feedsPerDay: 'عدد الوجبات/اليوم',
    min: 'أدنى',
    mid: 'متوسط',
    max: 'أعلى',
    requirementsTitle: 'Nutrition Requirements',
    nutrient: 'Nutrient',
    perKg: 'Per kg',
    totalDay: 'Total/day',
    resultsTitle: 'ملخص الحساب',
    targetEnergy: 'الطاقة المستهدفة',
    targetProtein: 'البروتين المستهدف',
    targetFluids: 'السوائل المستهدفة',
    primaryLimit: 'الحد الأساسي',
    deficitTitle: 'العجز والموديولار',
    kcalFromBase: 'سعرات من Standard + Special',
    kcalDeficit: 'العجز الحراري',
    proteinDeficit: 'عجز البروتين بعد الـ Standard',
    modularStatus: 'هل يحتاج Modular؟',
    modularToAdd: 'الكمية المضافة من المنتج (Modular)',
    needed: 'نعم',
    notNeeded: 'لا',
    formulaPlanTitle: 'خطة الكميات اليومية',
    formulaType: 'نوع الفورمولا',
    gramsPerDay: 'جرام/يوم',
    scoopsPerDay: 'مكيال/يوم',
    standard: 'Standard Formula',
    special: 'Special Formula',
    modular: 'Protein-free (Modular)',
    totalPowder: 'إجمالي البودرة',
    prepTitle: 'التحضير',
    totalVolume: 'إجمالي الحجم اليومي',
    perFeedVolume: 'الحجم لكل وجبة',
    perFeedScoops: 'المكيال لكل وجبة',
    reference: 'المعادلات محفوظة داخليًا حسب Guideline المعتمد',
    disclaimer: 'للاستخدام من المختصين فقط ويجب التحقق السريري النهائي قبل التطبيق.'
  },
  en: {
    appTitle: 'Metabolic Formula Pro',
    subtitle: 'Simple case-style calculator',
    switchLang: 'العربية',
    patientData: 'Case Inputs',
    diagnosis: 'Diagnosis',
    weight: 'Weight (kg)',
    ageGroup: 'Age Group',
    targetMode: 'Target Mode',
    feedsPerDay: 'Feeds/day',
    min: 'MIN',
    mid: 'MID',
    max: 'MAX',
    requirementsTitle: 'Nutrition Requirements',
    nutrient: 'Nutrient',
    perKg: 'Per kg',
    totalDay: 'Total/day',
    resultsTitle: 'Calculation Summary',
    targetEnergy: 'Target Energy',
    targetProtein: 'Target Protein',
    targetFluids: 'Target Fluids',
    primaryLimit: 'Primary Limit',
    deficitTitle: 'Deficit & Modular',
    kcalFromBase: 'Calories from Standard + Special',
    kcalDeficit: 'Calorie Deficit',
    proteinDeficit: 'Protein deficit after standard',
    modularStatus: 'Modular needed?',
    modularToAdd: 'Modular product to add',
    needed: 'Yes',
    notNeeded: 'No',
    formulaPlanTitle: 'Daily Formula Plan',
    formulaType: 'Formula type',
    gramsPerDay: 'g/day',
    scoopsPerDay: 'scoops/day',
    standard: 'Standard Formula',
    special: 'Special Formula',
    modular: 'Protein-free (Modular)',
    totalPowder: 'Total Powder',
    prepTitle: 'Preparation',
    totalVolume: 'Total daily volume',
    perFeedVolume: 'Volume per feed',
    perFeedScoops: 'Scoops per feed',
    reference: 'Standard formula guideline is saved internally',
    disclaimer: 'Clinical verification is required before use.'
  }
};

export const GUIDELINES: Record<DiseaseType, AgeGuideline[]> = {
  [DiseaseType.PKU]: [
    { ageLabel: 'Birth to 3 months', kcalPerKg: { min: 108, max: 120 }, proPerKg: { min: 2.5, max: 3.0 }, limits: { PHE: { min: 25, max: 70 } }, dailyLimits: { TYR: { min: 1000, max: 1300 } } },
    { ageLabel: '3 to <6 months', kcalPerKg: { min: 95, max: 105 }, proPerKg: { min: 2.0, max: 3.0 }, limits: { PHE: { min: 20, max: 45 } }, dailyLimits: { TYR: { min: 1400, max: 2100 } } },
    { ageLabel: '6 to <9 months', kcalPerKg: { min: 85, max: 95 }, proPerKg: { min: 2.0, max: 2.5 }, limits: { PHE: { min: 15, max: 35 } }, dailyLimits: { TYR: { min: 2500, max: 3000 } } },
    { ageLabel: '9 to <12 months', kcalPerKg: { min: 80, max: 90 }, proPerKg: { min: 2.0, max: 2.5 }, limits: { PHE: { min: 10, max: 35 } }, dailyLimits: { TYR: { min: 2500, max: 3000 } } },
    { ageLabel: '1 to 4 years', kcalPerKg: { min: 70, max: 85 }, proPerKg: { min: 1.5, max: 2.0 }, dailyLimits: { PHE: { min: 200, max: 320 }, TYR: { min: 2800, max: 3500 } } },
    { ageLabel: '4 years to adult', kcalPerKg: { min: 40, max: 60 }, proPerKg: { min: 1.0, max: 1.5 }, dailyLimits: { PHE: { min: 200, max: 1100 }, TYR: { min: 4000, max: 6000 } } },
  ],
  [DiseaseType.MMA_PA]: [
    { ageLabel: '0-6 months', kcalPerKg: { min: 125, max: 145 }, proPerKg: { min: 2.75, max: 3.5 }, limits: { ILE: { min: 60, max: 110 }, MET: { min: 20, max: 50 }, THR: { min: 50, max: 125 }, VAL: { min: 60, max: 105 } } },
    { ageLabel: '7-12 months', kcalPerKg: { min: 115, max: 140 }, proPerKg: { min: 2.5, max: 3.25 }, limits: { ILE: { min: 40, max: 90 }, MET: { min: 15, max: 40 }, THR: { min: 20, max: 75 }, VAL: { min: 40, max: 80 } } },
  ],
  [DiseaseType.GA]: [
    { ageLabel: 'Birth-6 months', kcalPerKg: { min: 100, max: 120 }, proPerKg: { min: 2.75, max: 3.0 }, limits: { LYS: { min: 65, max: 100 }, TRY: { min: 10, max: 20 } } },
    { ageLabel: '6 months to 1 year', kcalPerKg: { min: 95, max: 110 }, proPerKg: { min: 2.5, max: 3.0 }, limits: { LYS: { min: 55, max: 90 }, TRY: { min: 10, max: 12 } } },
    { ageLabel: '1 year to 4 years', kcalPerKg: { min: 80, max: 95 }, proPerKg: { min: 1.8, max: 2.6 }, limits: { LYS: { min: 50, max: 80 }, TRY: { min: 8, max: 12 } } },
    { ageLabel: '4 years to 7 years', kcalPerKg: { min: 60, max: 80 }, proPerKg: { min: 1.6, max: 2.0 }, limits: { LYS: { min: 40, max: 70 }, TRY: { min: 7, max: 11 } } },
  ],
  [DiseaseType.MSUD]: [
    { ageLabel: '0-6 months', kcalPerKg: { min: 95, max: 145 }, proPerKg: { min: 2.5, max: 3.5 }, limits: { LEU: { min: 40, max: 100 }, ILE: { min: 30, max: 90 }, VAL: { min: 40, max: 95 } } },
    { ageLabel: '7-12 months', kcalPerKg: { min: 80, max: 135 }, proPerKg: { min: 2.5, max: 3.0 }, limits: { LEU: { min: 40, max: 75 }, ILE: { min: 30, max: 70 }, VAL: { min: 30, max: 80 } } },
    { ageLabel: '1-3 years', kcalPerKg: { min: 80, max: 130 }, proPerKg: { min: 1.5, max: 2.5 }, limits: { LEU: { min: 40, max: 70 }, ILE: { min: 20, max: 70 }, VAL: { min: 30, max: 70 } } },
    { ageLabel: '4-8 years', kcalPerKg: { min: 50, max: 120 }, proPerKg: { min: 1.3, max: 2.0 }, limits: { LEU: { min: 35, max: 65 }, ILE: { min: 20, max: 30 }, VAL: { min: 30, max: 50 } } },
  ],
  [DiseaseType.UCD]: [
    { ageLabel: '0-1 year', kcalPerKg: { min: 100, max: 120 }, proPerKg: { min: 1.2, max: 2.2 }, ucdPro: { medical: { min: 0.4, max: 1.1 }, intact: { min: 0.8, max: 1.1 } } },
    { ageLabel: '1-7 years', kcalPerKg: { min: 80, max: 100 }, proPerKg: { min: 1.0, max: 1.2 }, ucdPro: { medical: { min: 0.3, max: 0.7 }, intact: { min: 0.7, max: 0.8 } } },
    { ageLabel: '7-19 years', kcalPerKg: { min: 60, max: 80 }, proPerKg: { min: 0.8, max: 1.4 }, ucdPro: { medical: { min: 0.4, max: 0.7 }, intact: { min: 0.3, max: 1.0 } } },
  ]
};

export const DEFAULT_FORMULAS: Record<string, FormulaStats> = {
  PKU_STD: { id: 'std', name: 'Standard Formula', kcal: 510, protein: 10.8, limiter: 430 },
  PKU_SPEC: { id: 'spec', name: 'PHE-free Formula', kcal: 473, protein: 13.5, limiter: 0 },
  MMA_STD: { id: 'std', name: 'Standard S-26', kcal: 526, protein: 10.83, limiter: 273 },
  MMA_SPEC: { id: 'spec', name: 'MMA/PA Special', kcal: 506, protein: 11.8, limiter: 0 },
  MSUD_STD: { id: 'std', name: 'Standard S-26', kcal: 526, protein: 10.8, limiter: 1079 },
  MSUD_SPEC: { id: 'spec', name: 'BCAA-free Formula', kcal: 466, protein: 13.0, limiter: 0 },
  GA_STD: { id: 'std', name: 'Standard S-26', kcal: 526, protein: 10.83, limiter: 895 },
  GA_SPEC: { id: 'spec', name: 'LYS/TRY-free Formula', kcal: 466, protein: 13.1, limiter: 0 },
  UCD_STD: { id: 'std', name: 'Standard (UCD)', kcal: 540, protein: 11, limiter: 0 },
  UCD_SPEC: { id: 'spec', name: 'Special EAA (UCD)', kcal: 492, protein: 7.5, limiter: 0 },
  MODULAR: { id: 'mod', name: 'Protein-free (Modular)', kcal: 492, protein: 0, limiter: 0 }
};

// محفوظ للاستخدام الداخلي فقط (بدون عرض مباشر في الواجهة)
export const STANDARD_FORMULA_GUIDELINES: Record<DiseaseType, FormulaStats> = {
  [DiseaseType.PKU]: DEFAULT_FORMULAS.PKU_STD,
  [DiseaseType.MMA_PA]: DEFAULT_FORMULAS.MMA_STD,
  [DiseaseType.MSUD]: DEFAULT_FORMULAS.MSUD_STD,
  [DiseaseType.GA]: DEFAULT_FORMULAS.GA_STD,
  [DiseaseType.UCD]: DEFAULT_FORMULAS.UCD_STD,
};

export const REFERENCE_TEXT = 'Metabolic Nutrition Guidelines 2024 (PKU, MMA/PA, MSUD, GA, UCD)';
