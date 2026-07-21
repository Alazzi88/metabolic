import {
  AgeGuideline,
  DiseaseMeta,
  DiseaseType,
  FormulaRole,
  FormulaOption,
  FormulaReference,
  NutrientRange,
  UcdSubtype,
} from './types';

const r = (min: number, max: number, unit: NutrientRange['unit'], mid?: number): NutrientRange => ({
  min,
  max,
  unit,
  mid,
});

const atLeast = (min: number, unit: NutrientRange['unit']): NutrientRange => ({
  min,
  max: min,
  unit,
  minOnly: true,
});

const fixed = (value: number, unit: NutrientRange['unit']): NutrientRange => ({
  min: value,
  max: value,
  unit,
});

export const DISEASE_METADATA: Record<DiseaseType, DiseaseMeta> = {
  [DiseaseType.PKU]: {
    en: { name: 'Phenylketonuria', short: 'PKU' },
    primaryLimiter: 'PHE',
  },
  [DiseaseType.TYR_I_IA_IB]: {
    en: { name: 'Tyrosinemia Types Ia and Ib', short: 'TYR' },
    primaryLimiter: 'PHE+TYR',
  },
  [DiseaseType.TYR_II_III]: {
    en: { name: 'Tyrosinemia Types II and III', short: 'TYR II/III' },
    primaryLimiter: 'PHE',
  },
  [DiseaseType.MSUD]: {
    en: { name: 'Maple Syrup Urine Disease', short: 'MSUD' },
    primaryLimiter: 'LEU',
  },
  [DiseaseType.LEU_CATABOLISM]: {
    en: { name: 'Isovaleric Acidemia / Leucine Catabolism Disorders', short: 'IVA' },
    primaryLimiter: 'LEU',
  },
  [DiseaseType.BETA_KETOTHIOLASE]: {
    en: { name: 'Beta-Ketothiolase Deficiency', short: 'BKT' },
    primaryLimiter: 'LEU',
  },
  [DiseaseType.HOMOCYSTINURIA]: {
    en: { name: 'Homocystinuria', short: 'HCU' },
    primaryLimiter: 'MET',
  },
  [DiseaseType.GA_TYPE_I]: {
    en: { name: 'Glutaric Aciduria Type I / 2-Ketoadipic Aciduria', short: 'GA-I' },
    primaryLimiter: 'LYS',
  },
  [DiseaseType.GA_TYPE_II]: {
    en: { name: 'Glutaric Acidemia Type II', short: 'GA-II' },
    primaryLimiter: 'Protein',
  },
  [DiseaseType.LPI]: {
    en: { name: 'Lysinuric Protein Intolerance', short: 'LPI' },
    primaryLimiter: 'Protein',
  },
  [DiseaseType.MMA_PA]: {
    en: { name: 'Propionic / Methylmalonic Acidemia', short: 'PA/MMA' },
    primaryLimiter: 'VAL',
  },
  [DiseaseType.GALACTOSEMIA]: {
    en: { name: 'Galactosemia', short: 'GALT' },
    primaryLimiter: 'Protein',
  },
  [DiseaseType.UCD]: {
    en: { name: 'Urea Cycle Disorders', short: 'UCD' },
    primaryLimiter: 'Protein',
  },
};

export const UI_STRINGS = {
  en: {
    appTitle: 'Metabolic Formula',
    subtitle: 'Case-style calculator from your provided source only',
    patientData: 'Case Inputs',
    diagnosis: 'Diagnosis',
    weight: 'Weight (kg)',
    ageGroup: 'Age Group',
    targetMode: 'Target Mode',
    feedsPerDay: 'Feeds/day',
    analysisInputsTitle: 'Disease Analysis Inputs',
    analysisExpectedRange: 'Expected range',
    analysisInputValue: 'Entered value',
    analysisItemLabel: 'Element',
    scoopSize: 'Scoop size (g)',
    waterPerScoop: 'Water per scoop (mL)',
    min: 'MIN',
    mid: 'MID',
    max: 'MAX',
    formulaConfigTitle: 'Available Formula Selection',
    standardGuidelineTitle: 'Guideline for Standard Formula',
    typeOfFormula: 'Type of formula',
    standardGuidelineRow: 'Standard formula',
    standardFormula: 'Standard Formula',
    specialFormula: 'Special Formula',
    modularFormula: 'Modular',
    formulaOption: 'Formula type',
    noneOption: 'None',
    customOption: 'Custom (manual input)',
    customName: 'Formula name',
    basis: 'Basis',
    kcalPerBasis: 'Calories per 100',
    proteinPerBasis: 'Protein per 100',
    limiterPerBasis: 'Primary limiter per 100',
    requirementsTitle: 'Calculated Requirements',
    nutrient: 'Nutrient',
    sourceRange: 'Source Range',
    dailyRange: 'Calculated Daily Range',
    selectedTarget: 'Selected Target',
    summaryTitle: 'Daily Summary',
    targetEnergy: 'Target Energy',
    targetProtein: 'Target Protein',
    targetFluid: 'Target Fluid',
    primaryLimit: 'Primary Limit',
    analysisTitle: 'Analysis Interpretation',
    analysisStatus: 'Analysis status',
    analysisAdvice: 'Recommendation',
    statusLow: 'Low',
    statusNormal: 'Within range',
    statusHigh: 'High',
    statusNA: 'Not entered',
    planTitle: 'Formula Plan (Order breakdown)',
    role: 'Role',
    amount: 'Amount/day',
    kcal: 'Calories',
    protein: 'Protein',
    limiterDelivered: 'Primary limiter delivered',
    scoops: 'Scoops/day',
    water: 'Water/day',
    perFeedAmount: 'Amount/feed',
    perFeedScoops: 'Scoops/feed',
    perFeedWater: 'Water/feed',
    nutrientCoverageTitle: 'Nutrient Coverage In Plan',
    deliveredAmount: 'Delivered',
    targetAmount: 'Target',
    deficitAmount: 'Deficit',
    excessAmount: 'Excess',
    balanceStatus: 'Status',
    totalsTitle: 'Totals',
    totalKcal: 'Total calories',
    totalProtein: 'Total protein',
    totalPowder: 'Total powder',
    totalScoops: 'Total scoops',
    totalWater: 'Total water',
    totalVolume: 'Total final volume',
    volumePerFeed: 'Volume/feed',
    scoopsPerFeed: 'Scoops/feed',
    orderTitle: 'Ready Order',
    orderStandard: 'Standard',
    orderSpecial: 'Special',
    orderModular: 'Modular',
    orderNote: 'Note',
    standardTitle: 'Standard Summary',
    formulaName: 'Formula',
    limitingNutrient: 'Limiting nutrient',
    maxStandard: 'Max standard amount',
    deliveredProtein: 'Protein from standard',
    deliveredEnergy: 'Energy from standard',
    proteinDeficit: 'Protein deficit',
    energyDeficit: 'Energy deficit',
    reference: '',
    noFormula: 'Insufficient standard-formula data for this disease from the provided tables.',
    ucdSubtype: 'UCD Enzyme Subtype',
    showUcdRef: 'Show UCD Guidelines Reference Table',
    hideUcdRef: 'Hide UCD Guidelines Reference Table',
    prep: 'Preparation',
    totalScoopsDay: 'Total Scoop / Day',
    suggestedModular: 'Suggested Modular Adjustment (If Needed)',
    finalMix: 'Final Mix',
    noFormulaMix: 'No formula mix yet.',
    modularRec: (nutrient: string, deficit: string, unit: string, grams: string, product: string) =>
      `If ${nutrient} deficit is ${deficit} ${unit}, consider =~ ${grams} g/day from ${product}.`,
    noModularProduct: (nutrient: string) => `If ${nutrient} deficit exists, no suitable modular product is available in the current list.`,
    nutrients: {
      Energy: 'Energy',
      Protein: 'Protein',
      Carbohydrate: 'Carbohydrate',
      Fluid: 'Fluid',
      Fat: 'Fat',
      LinoleicAcid: 'Linoleic Acid',
      LinolenicAcid: 'Linolenic Acid',
      PHE: 'PHE',
      TYR: 'TYR',
      'PHE+TYR': 'PHE + TYR',
      ILE: 'ILE',
      LEU: 'LEU',
      VAL: 'VAL',
      MET: 'MET',
      CYS: 'CYS',
      THR: 'THR',
      LYS: 'LYS',
      TRP: 'TRP',
      EAA: 'EAA Mixture',
      NaturalProtein: 'Natural Protein',
      LArginine: 'L-Arginine (Free Base)',
      LCitrulline: 'L-Citrulline',
    },
  },
};

/**
 * Recommended Daily Nutrient Intakes — Ross Metabolic Formula System
 * (Ross Products Division, 2001).
 *
 * Energy columns in the source print a single averaged value beside a
 * parenthesised range, e.g. "1,300 (900 - 1800)". The parenthesised range is
 * the requirement and is what is stored here; the averaged value is dropped.
 *
 * Infant bands are per kilogram; every band from 1 yr upward is per day,
 * except MET/CYS (homocystinuria) and LYS/TRP (glutaric aciduria I) which the
 * source keeps per kilogram of ideal body weight at all ages.
 */
export const GUIDELINE_AGE_LABELS = [
  '0 to <3 mo',
  '3 to <6 mo',
  '6 to <9 mo',
  '9 to <12 mo',
  '1 to <4 yr',
  '4 to <7 yr',
  '7 to <11 yr',
  'Women 11 to <15 yr',
  'Women 15 to <19 yr',
  'Women >=19 yr',
  'Men 11 to <15 yr',
  'Men 15 to <19 yr',
  'Men >=19 yr',
];

/** Each column holds one nutrient across the 13 age bands, in label order. */
function guidelinesFromColumns(
  columns: Record<string, Array<NutrientRange | null>>,
): AgeGuideline[] {
  return GUIDELINE_AGE_LABELS.map((ageLabel, index) => {
    const nutrients: Record<string, NutrientRange> = {};
    for (const [nutrient, values] of Object.entries(columns)) {
      const value = values[index];
      if (value) nutrients[nutrient] = value;
    }
    return { ageLabel, nutrients };
  });
}

const ENERGY_STD: NutrientRange[] = [
  r(95, 145, 'kcal/kg'),
  r(95, 145, 'kcal/kg'),
  r(80, 135, 'kcal/kg'),
  r(80, 135, 'kcal/kg'),
  r(900, 1800, 'kcal/day'),
  r(1300, 2300, 'kcal/day'),
  r(1650, 3300, 'kcal/day'),
  r(1500, 3000, 'kcal/day'),
  r(1200, 3000, 'kcal/day'),
  r(1400, 2500, 'kcal/day'),
  r(2000, 3700, 'kcal/day'),
  r(2100, 3900, 'kcal/day'),
  r(2000, 3300, 'kcal/day'),
];

const FLUID_DAY: NutrientRange[] = [
  r(900, 1800, 'mL/day'),
  r(1300, 2300, 'mL/day'),
  r(1650, 3300, 'mL/day'),
  r(1500, 3000, 'mL/day'),
  r(1200, 3000, 'mL/day'),
  r(1400, 2500, 'mL/day'),
  r(2000, 3700, 'mL/day'),
  r(2100, 3900, 'mL/day'),
  r(2000, 3300, 'mL/day'),
];

const FLUID_STD: NutrientRange[] = [
  r(125, 150, 'mL/kg'),
  r(130, 160, 'mL/kg'),
  r(125, 145, 'mL/kg'),
  r(120, 135, 'mL/kg'),
  ...FLUID_DAY,
];

const FLUID_PKU: NutrientRange[] = [
  r(135, 160, 'mL/kg'),
  r(130, 160, 'mL/kg'),
  r(125, 145, 'mL/kg'),
  r(120, 135, 'mL/kg'),
  ...FLUID_DAY,
];

const FLUID_LEU: NutrientRange[] = [
  r(125, 160, 'mL/kg'),
  r(130, 160, 'mL/kg'),
  r(125, 145, 'mL/kg'),
  r(120, 135, 'mL/kg'),
  ...FLUID_DAY,
];

const FLUID_MMA_PA: NutrientRange[] = [
  r(125, 200, 'mL/kg'),
  r(130, 160, 'mL/kg'),
  r(125, 145, 'mL/kg'),
  r(120, 135, 'mL/kg'),
  ...FLUID_DAY,
];

/** Protein pattern shared by the amino-acid restricted disorders. */
const PROTEIN_AA_STD: NutrientRange[] = [
  r(3.0, 3.5, 'g/kg'),
  r(3.0, 3.5, 'g/kg'),
  r(2.5, 3.0, 'g/kg'),
  r(2.5, 3.0, 'g/kg'),
  atLeast(30, 'g/day'),
  atLeast(35, 'g/day'),
  atLeast(40, 'g/day'),
  atLeast(50, 'g/day'),
  atLeast(55, 'g/day'),
  atLeast(60, 'g/day'),
  atLeast(55, 'g/day'),
  atLeast(65, 'g/day'),
  atLeast(70, 'g/day'),
];

const LPI_UCD_DAY_ENERGY: NutrientRange[] = [
  r(945, 1890, 'kcal/day'),
  r(1365, 2415, 'kcal/day'),
  r(1730, 3465, 'kcal/day'),
  r(1575, 3150, 'kcal/day'),
  r(1260, 3150, 'kcal/day'),
  r(1785, 2625, 'kcal/day'),
  r(2100, 3885, 'kcal/day'),
  r(2200, 4095, 'kcal/day'),
  r(2625, 3465, 'kcal/day'),
];

export const GUIDELINES: Record<DiseaseType, AgeGuideline[]> = {
  // TABLE 1-1. Phenylketonuria
  [DiseaseType.PKU]: guidelinesFromColumns({
    PHE: [
      r(25, 70, 'mg/kg'),
      r(20, 45, 'mg/kg'),
      r(15, 35, 'mg/kg'),
      r(10, 35, 'mg/kg'),
      r(200, 400, 'mg/day'),
      r(210, 450, 'mg/day'),
      r(220, 500, 'mg/day'),
      r(250, 750, 'mg/day'),
      r(230, 700, 'mg/day'),
      r(220, 700, 'mg/day'),
      r(225, 900, 'mg/day'),
      r(295, 1100, 'mg/day'),
      r(290, 1200, 'mg/day'),
    ],
    TYR: [
      r(300, 350, 'mg/kg'),
      r(300, 350, 'mg/kg'),
      r(250, 300, 'mg/kg'),
      r(250, 300, 'mg/kg'),
      r(1.72, 3.0, 'g/day'),
      r(2.25, 3.5, 'g/day'),
      r(2.55, 4.0, 'g/day'),
      r(3.45, 5.0, 'g/day'),
      r(3.45, 5.0, 'g/day'),
      r(3.75, 5.0, 'g/day'),
      r(3.38, 5.5, 'g/day'),
      r(4.42, 6.5, 'g/day'),
      r(4.35, 6.5, 'g/day'),
    ],
    Protein: PROTEIN_AA_STD,
    Energy: ENERGY_STD,
    Fluid: FLUID_PKU,
  }),

  // TABLE 3-1. Tyrosinemia Types Ia and Ib
  [DiseaseType.TYR_I_IA_IB]: guidelinesFromColumns({
    'PHE+TYR': [
      r(65, 155, 'mg/kg'),
      r(55, 135, 'mg/kg'),
      r(50, 120, 'mg/kg'),
      r(40, 105, 'mg/kg'),
      r(380, 800, 'mg/day'),
      r(390, 900, 'mg/day'),
      r(400, 1000, 'mg/day'),
      r(800, 1200, 'mg/day'),
      r(800, 1200, 'mg/day'),
      r(800, 1000, 'mg/day'),
      r(990, 1200, 'mg/day'),
      r(1000, 1500, 'mg/day'),
      r(1000, 1500, 'mg/day'),
    ],
    Protein: PROTEIN_AA_STD,
    Energy: ENERGY_STD,
    Fluid: FLUID_PKU,
  }),

  // TABLE 4-1. Tyrosinemia Types II or III
  [DiseaseType.TYR_II_III]: guidelinesFromColumns({
    PHE: [
      r(30, 90, 'mg/kg'),
      r(30, 70, 'mg/kg'),
      r(25, 50, 'mg/kg'),
      r(20, 40, 'mg/kg'),
      r(250, 500, 'mg/day'),
      r(260, 550, 'mg/day'),
      r(270, 600, 'mg/day'),
      r(300, 650, 'mg/day'),
      r(280, 700, 'mg/day'),
      r(270, 700, 'mg/day'),
      r(275, 700, 'mg/day'),
      r(350, 750, 'mg/day'),
      r(340, 750, 'mg/day'),
    ],
    TYR: [
      r(35, 90, 'mg/kg'),
      r(30, 70, 'mg/kg'),
      r(25, 50, 'mg/kg'),
      r(20, 40, 'mg/kg'),
      r(200, 450, 'mg/day'),
      r(250, 500, 'mg/day'),
      r(260, 550, 'mg/day'),
      r(290, 500, 'mg/day'),
      r(270, 450, 'mg/day'),
      r(260, 450, 'mg/day'),
      r(260, 550, 'mg/day'),
      r(340, 550, 'mg/day'),
      r(330, 550, 'mg/day'),
    ],
    Protein: PROTEIN_AA_STD,
    Energy: ENERGY_STD,
    Fluid: FLUID_STD,
  }),

  // TABLE 5-1. Maple Syrup Urine Disease
  [DiseaseType.MSUD]: guidelinesFromColumns({
    ILE: [
      r(36, 60, 'mg/kg'),
      r(30, 50, 'mg/kg'),
      r(25, 40, 'mg/kg'),
      r(18, 33, 'mg/kg'),
      r(165, 325, 'mg/day'),
      r(215, 420, 'mg/day'),
      r(245, 470, 'mg/day'),
      r(330, 445, 'mg/day'),
      r(330, 445, 'mg/day'),
      r(300, 450, 'mg/day'),
      r(325, 435, 'mg/day'),
      r(425, 570, 'mg/day'),
      r(575, 700, 'mg/day'),
    ],
    LEU: [
      r(60, 100, 'mg/kg'),
      r(50, 85, 'mg/kg'),
      r(40, 70, 'mg/kg'),
      r(30, 55, 'mg/kg'),
      r(275, 535, 'mg/day'),
      r(360, 695, 'mg/day'),
      r(410, 785, 'mg/day'),
      r(550, 740, 'mg/day'),
      r(550, 740, 'mg/day'),
      r(400, 620, 'mg/day'),
      r(540, 720, 'mg/day'),
      r(705, 945, 'mg/day'),
      r(800, 1100, 'mg/day'),
    ],
    VAL: [
      r(42, 70, 'mg/kg'),
      r(35, 60, 'mg/kg'),
      r(28, 50, 'mg/kg'),
      r(21, 38, 'mg/kg'),
      r(190, 400, 'mg/day'),
      r(250, 490, 'mg/day'),
      r(285, 550, 'mg/day'),
      r(385, 520, 'mg/day'),
      r(385, 520, 'mg/day'),
      r(420, 650, 'mg/day'),
      r(375, 505, 'mg/day'),
      r(495, 665, 'mg/day'),
      r(560, 800, 'mg/day'),
    ],
    Protein: PROTEIN_AA_STD,
    Energy: ENERGY_STD,
    Fluid: FLUID_STD,
  }),

  // TABLE 6-1. Disorders of LEU Catabolism (isovaleric acidemia)
  [DiseaseType.LEU_CATABOLISM]: guidelinesFromColumns({
    LEU: [
      r(80, 150, 'mg/kg'),
      r(70, 140, 'mg/kg'),
      r(60, 130, 'mg/kg'),
      r(50, 120, 'mg/kg'),
      r(500, 900, 'mg/day'),
      r(600, 900, 'mg/day'),
      r(700, 900, 'mg/day'),
      r(700, 900, 'mg/day'),
      r(620, 820, 'mg/day'),
      r(620, 820, 'mg/day'),
      r(1100, 1500, 'mg/day'),
      r(1100, 1500, 'mg/day'),
      r(1000, 1400, 'mg/day'),
    ],
    Protein: PROTEIN_AA_STD,
    Energy: ENERGY_STD,
    Fluid: FLUID_LEU,
  }),

  // TABLE 7-1. Beta-Ketothiolase Deficiency
  [DiseaseType.BETA_KETOTHIOLASE]: guidelinesFromColumns({
    ILE: [
      r(90, 140, 'mg/kg'),
      r(85, 135, 'mg/kg'),
      r(80, 135, 'mg/kg'),
      r(75, 125, 'mg/kg'),
      r(750, 1000, 'mg/day'),
      r(850, 1100, 'mg/day'),
      r(1000, 1300, 'mg/day'),
      r(1200, 1500, 'mg/day'),
      r(1000, 1300, 'mg/day'),
      r(1000, 1300, 'mg/day'),
      r(1000, 1300, 'mg/day'),
      r(1300, 1650, 'mg/day'),
      r(1300, 1650, 'mg/day'),
    ],
    LEU: [
      atLeast(180, 'mg/kg'),
      atLeast(160, 'mg/kg'),
      atLeast(150, 'mg/kg'),
      atLeast(140, 'mg/kg'),
      atLeast(1000, 'mg/day'),
      atLeast(1150, 'mg/day'),
      atLeast(1300, 'mg/day'),
      atLeast(1900, 'mg/day'),
      atLeast(1300, 'mg/day'),
      atLeast(1330, 'mg/day'),
      atLeast(1900, 'mg/day'),
      atLeast(1650, 'mg/day'),
      atLeast(1650, 'mg/day'),
    ],
    VAL: [
      atLeast(100, 'mg/kg'),
      atLeast(90, 'mg/kg'),
      atLeast(80, 'mg/kg'),
      atLeast(70, 'mg/kg'),
      atLeast(750, 'mg/day'),
      atLeast(850, 'mg/day'),
      atLeast(1000, 'mg/day'),
      atLeast(1800, 'mg/day'),
      atLeast(1000, 'mg/day'),
      atLeast(1000, 'mg/day'),
      atLeast(1150, 'mg/day'),
      atLeast(1300, 'mg/day'),
      atLeast(1300, 'mg/day'),
    ],
    Protein: PROTEIN_AA_STD,
    Energy: ENERGY_STD,
    Fluid: FLUID_STD,
  }),

  // TABLE 8-1. Homocystinuria — MET and CYS stay per kg of ideal body weight
  [DiseaseType.HOMOCYSTINURIA]: guidelinesFromColumns({
    MET: [
      r(15, 30, 'mg/kg'),
      r(10, 25, 'mg/kg'),
      r(10, 25, 'mg/kg'),
      r(10, 20, 'mg/kg'),
      r(10, 20, 'mg/kg'),
      r(8, 16, 'mg/kg'),
      r(6, 12, 'mg/kg'),
      r(6, 14, 'mg/kg'),
      r(6, 12, 'mg/kg'),
      r(4, 10, 'mg/kg'),
      r(6, 14, 'mg/kg'),
      r(6, 16, 'mg/kg'),
      r(6, 15, 'mg/kg'),
    ],
    CYS: [
      fixed(300, 'mg/kg'),
      fixed(250, 'mg/kg'),
      fixed(200, 'mg/kg'),
      fixed(200, 'mg/kg'),
      r(100, 200, 'mg/kg'),
      r(100, 200, 'mg/kg'),
      r(100, 200, 'mg/kg'),
      r(50, 150, 'mg/kg'),
      r(25, 125, 'mg/kg'),
      r(25, 100, 'mg/kg'),
      r(50, 150, 'mg/kg'),
      r(25, 125, 'mg/kg'),
      r(25, 100, 'mg/kg'),
    ],
    Protein: PROTEIN_AA_STD,
    Energy: ENERGY_STD,
    Fluid: FLUID_STD,
  }),

  // TABLE 9-1. Glutaric Aciduria Type I / 2-Ketoadipic Aciduria
  [DiseaseType.GA_TYPE_I]: guidelinesFromColumns({
    LYS: [
      r(80, 100, 'mg/kg'),
      r(70, 90, 'mg/kg'),
      r(60, 80, 'mg/kg'),
      r(50, 70, 'mg/kg'),
      r(55, 65, 'mg/kg'),
      r(45, 55, 'mg/kg'),
      r(35, 45, 'mg/kg'),
      r(30, 40, 'mg/kg'),
      r(20, 30, 'mg/kg'),
      r(10, 20, 'mg/kg'),
      r(30, 40, 'mg/kg'),
      r(35, 45, 'mg/kg'),
      r(35, 45, 'mg/kg'),
    ],
    TRP: [
      r(10, 20, 'mg/kg'),
      r(10, 15, 'mg/kg'),
      r(10, 12, 'mg/kg'),
      r(10, 12, 'mg/kg'),
      r(8, 12, 'mg/kg'),
      r(7, 11, 'mg/kg'),
      r(4, 10, 'mg/kg'),
      r(4, 6, 'mg/kg'),
      r(3, 5, 'mg/kg'),
      r(3, 4, 'mg/kg'),
      r(4, 6, 'mg/kg'),
      r(6, 8, 'mg/kg'),
      r(3, 5, 'mg/kg'),
    ],
    Protein: [
      r(3.0, 3.5, 'g/kg'),
      r(3.0, 3.5, 'g/kg'),
      r(2.5, 3.0, 'g/kg'),
      r(2.5, 3.0, 'g/kg'),
      atLeast(30, 'g/day'),
      atLeast(35, 'g/day'),
      atLeast(40, 'g/day'),
      atLeast(50, 'g/day'),
      atLeast(55, 'g/day'),
      atLeast(60, 'g/day'),
      atLeast(60, 'g/day'),
      atLeast(65, 'g/day'),
      atLeast(65, 'g/day'),
    ],
    Energy: ENERGY_STD,
    Fluid: FLUID_STD,
  }),

  // TABLE 10-1. Glutaric Acidemia Type II
  [DiseaseType.GA_TYPE_II]: guidelinesFromColumns({
    Protein: [
      r(1.7, 2.0, 'g/kg'),
      r(1.4, 1.7, 'g/kg'),
      r(1.1, 1.4, 'g/kg'),
      r(1.1, 1.4, 'g/kg'),
      r(15, 23, 'g/day'),
      r(20, 30, 'g/day'),
      r(25, 34, 'g/day'),
      r(30, 40, 'g/day'),
      r(40, 45, 'g/day'),
      r(45, 50, 'g/day'),
      r(40, 42, 'g/day'),
      r(42, 49, 'g/day'),
      r(49, 55, 'g/day'),
    ],
    Fat: GUIDELINE_AGE_LABELS.map(() => r(20, 25, '%energy')),
    Energy: ENERGY_STD,
    Fluid: FLUID_STD,
  }),

  // TABLE 11-1. Lysinuric Protein Intolerance
  [DiseaseType.LPI]: guidelinesFromColumns({
    Protein: [
      r(1.5, 2.2, 'g/kg'),
      r(1.5, 2.0, 'g/kg'),
      r(1.25, 1.8, 'g/kg'),
      r(1.15, 1.6, 'g/kg'),
      r(10, 13, 'g/day'),
      r(14, 20, 'g/day'),
      r(20, 28, 'g/day'),
      r(30, 40, 'g/day'),
      r(40, 45, 'g/day'),
      r(45, 47, 'g/day'),
      r(30, 42, 'g/day'),
      r(42, 49, 'g/day'),
      r(49, 55, 'g/day'),
    ],
    Energy: [
      r(125, 140, 'kcal/kg'),
      r(120, 130, 'kcal/kg'),
      r(115, 130, 'kcal/kg'),
      r(110, 120, 'kcal/kg'),
      ...LPI_UCD_DAY_ENERGY,
    ],
    Fluid: [
      r(130, 160, 'mL/kg'),
      r(130, 160, 'mL/kg'),
      r(125, 150, 'mL/kg'),
      r(120, 130, 'mL/kg'),
      r(945, 1890, 'mL/day'),
      r(1365, 2445, 'mL/day'),
      r(1730, 3465, 'mL/day'),
      r(1575, 3150, 'mL/day'),
      r(1260, 3150, 'mL/day'),
      r(1875, 2525, 'mL/day'),
      r(2100, 3885, 'mL/day'),
      r(2200, 4095, 'mL/day'),
      r(2625, 3465, 'mL/day'),
    ],
  }),

  // TABLE 13-1. Propionic Acidemia / Methylmalonic Acidemia
  [DiseaseType.MMA_PA]: guidelinesFromColumns({
    ILE: [
      r(75, 120, 'mg/kg'),
      r(65, 100, 'mg/kg'),
      r(50, 90, 'mg/kg'),
      r(40, 80, 'mg/kg'),
      r(485, 735, 'mg/day'),
      r(630, 960, 'mg/day'),
      r(715, 1090, 'mg/day'),
      r(965, 1470, 'mg/day'),
      r(965, 1470, 'mg/day'),
      r(925, 1410, 'mg/day'),
      r(540, 765, 'mg/day'),
      r(670, 950, 'mg/day'),
      r(1175, 1190, 'mg/day'),
    ],
    MET: [
      r(30, 50, 'mg/kg'),
      r(20, 45, 'mg/kg'),
      r(10, 40, 'mg/kg'),
      r(10, 30, 'mg/kg'),
      r(180, 390, 'mg/day'),
      r(255, 510, 'mg/day'),
      r(290, 580, 'mg/day'),
      r(390, 780, 'mg/day'),
      r(275, 780, 'mg/day'),
      r(265, 750, 'mg/day'),
      r(290, 765, 'mg/day'),
      r(475, 950, 'mg/day'),
      r(475, 950, 'mg/day'),
    ],
    THR: [
      r(75, 135, 'mg/kg'),
      r(60, 100, 'mg/kg'),
      r(40, 75, 'mg/kg'),
      r(20, 40, 'mg/kg'),
      r(415, 600, 'mg/day'),
      r(540, 780, 'mg/day'),
      r(610, 885, 'mg/day'),
      r(830, 1195, 'mg/day'),
      r(830, 1195, 'mg/day'),
      r(790, 1145, 'mg/day'),
      r(810, 1170, 'mg/day'),
      r(1010, 1455, 'mg/day'),
      r(1010, 1455, 'mg/day'),
    ],
    VAL: [
      r(75, 105, 'mg/kg'),
      r(65, 90, 'mg/kg'),
      r(35, 75, 'mg/kg'),
      r(30, 60, 'mg/kg'),
      r(550, 830, 'mg/day'),
      r(720, 1080, 'mg/day'),
      r(815, 1225, 'mg/day'),
      r(1105, 1655, 'mg/day'),
      r(1105, 1655, 'mg/day'),
      r(790, 1585, 'mg/day'),
      r(1080, 1515, 'mg/day'),
      r(1345, 2015, 'mg/day'),
      r(1345, 2015, 'mg/day'),
    ],
    Protein: [
      r(2.5, 3.5, 'g/kg'),
      r(2.5, 3.5, 'g/kg'),
      r(2.5, 3.0, 'g/kg'),
      r(2.5, 3.0, 'g/kg'),
      atLeast(30, 'g/day'),
      atLeast(35, 'g/day'),
      atLeast(40, 'g/day'),
      atLeast(55, 'g/day'),
      atLeast(55, 'g/day'),
      atLeast(50, 'g/day'),
      atLeast(50, 'g/day'),
      atLeast(65, 'g/day'),
      atLeast(65, 'g/day'),
    ],
    Energy: ENERGY_STD,
    Fluid: FLUID_MMA_PA,
  }),

  // TABLE 14-1. Galactosemia
  [DiseaseType.GALACTOSEMIA]: guidelinesFromColumns({
    Protein: [
      r(3.0, 3.5, 'g/kg'),
      r(3.0, 3.5, 'g/kg'),
      r(2.5, 3.0, 'g/kg'),
      r(2.5, 3.0, 'g/kg'),
      atLeast(30, 'g/day'),
      atLeast(35, 'g/day'),
      atLeast(40, 'g/day'),
      atLeast(50, 'g/day'),
      atLeast(50, 'g/day'),
      atLeast(50, 'g/day'),
      atLeast(55, 'g/day'),
      atLeast(65, 'g/day'),
      atLeast(65, 'g/day'),
    ],
    Energy: ENERGY_STD,
    Fluid: FLUID_STD,
  }),

  // TABLE 24-1. Urea Cycle Disorders
  [DiseaseType.UCD]: guidelinesFromColumns({
    Protein: [
      r(1.25, 2.2, 'g/kg'),
      r(1.8, 2.0, 'g/kg'),
      r(1.6, 1.8, 'g/kg'),
      r(1.4, 1.6, 'g/kg'),
      r(8, 12, 'g/day'),
      r(12, 15, 'g/day'),
      r(14, 17, 'g/day'),
      r(20, 23, 'g/day'),
      r(20, 23, 'g/day'),
      r(22, 25, 'g/day'),
      r(20, 23, 'g/day'),
      r(21, 24, 'g/day'),
      r(23, 32, 'g/day'),
    ],
    Energy: [
      r(125, 150, 'kcal/kg'),
      r(120, 140, 'kcal/kg'),
      r(115, 130, 'kcal/kg'),
      r(110, 120, 'kcal/kg'),
      ...LPI_UCD_DAY_ENERGY,
    ],
    Fluid: [
      r(130, 160, 'mL/kg'),
      r(130, 160, 'mL/kg'),
      r(125, 150, 'mL/kg'),
      r(120, 130, 'mL/kg'),
      r(945, 1890, 'mL/day'),
      r(1365, 2415, 'mL/day'),
      r(1730, 3465, 'mL/day'),
      r(1575, 3150, 'mL/day'),
      r(1260, 3150, 'mL/day'),
      r(1785, 2625, 'mL/day'),
      r(2100, 3885, 'mL/day'),
      r(2200, 4095, 'mL/day'),
      r(2625, 3465, 'mL/day'),
    ],
  }),
};

export const UCD_SUBTYPES: { id: UcdSubtype; label: string }[] = [
  { id: 'CPS', label: 'CPS - Carbamyl Phosphate Synthetase' },
  { id: 'OTC', label: 'OTC - Ornithine Transcarbamylase' },
  { id: 'ASS', label: 'ASS - Citrullinemia (Argininosuccinate Synthetase)' },
  { id: 'ASA', label: 'ASA - Argininosuccinate Lyase' },
  { id: 'ARG', label: 'ARG - Arginase (Hyperargininemia)' },
];

/**
 * TABLE 24-1 states one total-protein figure for UCD with no split by enzyme
 * subtype and no Natural Protein / EAA breakdown. That breakdown instead
 * comes from Bernstein, Rohr & van Calcar (Nutrition Management of Inherited
 * Metabolic Diseases, 2nd Edition, Springer 2022) — the same numbers shown in
 * the "UCD Guideline Reference" table — grouped by enzyme (CPS/OTC, ASS/ASA,
 * ARG) across 4 age bands (0-1, 1-7, 7-19, >19 yr). Those bands are coarser
 * than Table 24-1's 13, so each Table 24-1 band maps into the Bernstein band
 * it falls inside.
 */
type UcdEnzymeGroup = 'CPS_OTC' | 'ASS_ASA' | 'ARG';

const UCD_SUBTYPE_TO_BERNSTEIN_GROUP: Record<UcdSubtype, UcdEnzymeGroup> = {
  CPS: 'CPS_OTC',
  OTC: 'CPS_OTC',
  ASS: 'ASS_ASA',
  ASA: 'ASS_ASA',
  ARG: 'ARG',
};

// Index into the 4 Bernstein bands [0-1yr, 1-7yr, 7-19yr, >19yr] for each of
// the 13 GUIDELINE_AGE_LABELS bands, in order.
const UCD_AGE_LABEL_TO_BERNSTEIN_BAND = [0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 2, 2, 3];

const UCD_BERNSTEIN_EAA_BY_GROUP: Record<UcdEnzymeGroup, NutrientRange[]> = {
  CPS_OTC: [r(0.4, 1.1, 'g/kg'), r(0.3, 0.7, 'g/kg'), r(0.4, 0.7, 'g/kg'), r(0.2, 0.5, 'g/kg')],
  ASS_ASA: [r(0.0, 0.5, 'g/kg'), r(0.0, 0.3, 'g/kg'), r(0.0, 0.3, 'g/kg'), r(0.0, 0.2, 'g/kg')],
  ARG: [r(0.0, 0.5, 'g/kg'), r(0.0, 0.3, 'g/kg'), r(0.0, 0.3, 'g/kg'), r(0.0, 0.2, 'g/kg')],
};

const UCD_BERNSTEIN_NATURAL_PROTEIN_BY_GROUP: Record<UcdEnzymeGroup, NutrientRange[]> = {
  CPS_OTC: [r(0.8, 1.1, 'g/kg'), r(0.7, 0.8, 'g/kg'), r(0.3, 1.0, 'g/kg'), r(0.6, 0.7, 'g/kg')],
  ASS_ASA: [r(0.9, 1.7, 'g/kg'), r(0.7, 0.9, 'g/kg'), r(0.4, 1.1, 'g/kg'), r(0.3, 0.8, 'g/kg')],
  ARG: [r(0.9, 1.7, 'g/kg'), r(0.7, 0.9, 'g/kg'), r(0.4, 1.1, 'g/kg'), r(0.3, 0.8, 'g/kg')],
};

export const UCD_GUIDELINES_BY_SUBTYPE: Record<UcdSubtype, AgeGuideline[]> = (
  Object.keys(UCD_SUBTYPE_TO_BERNSTEIN_GROUP) as UcdSubtype[]
).reduce((acc, subtype) => {
  const group = UCD_SUBTYPE_TO_BERNSTEIN_GROUP[subtype];
  acc[subtype] = GUIDELINES[DiseaseType.UCD].map((guide, index) => {
    const bandIndex = UCD_AGE_LABEL_TO_BERNSTEIN_BAND[index];
    return {
      ...guide,
      nutrients: {
        ...guide.nutrients,
        EAA: UCD_BERNSTEIN_EAA_BY_GROUP[group][bandIndex],
        NaturalProtein: UCD_BERNSTEIN_NATURAL_PROTEIN_BY_GROUP[group][bandIndex],
      },
    };
  });
  return acc;
}, {} as Record<UcdSubtype, AgeGuideline[]>);

const SIMILAC_READY_TO_FEED_100ML: FormulaReference = {
  name: 'Similac With Iron Infant Formula (Ready to Feed)',
  basis: '100mL',
  values: {
    Protein: 1.4,
    Energy: 68,
    PHE: 59,
    TYR: 58,
    ILE: 75,
    LEU: 144,
    VAL: 83,
    MET: 35,
    CYS: 19,
  },
};

const STANDARD_UNIFIED_CASE_100G: FormulaReference = {
  name: 'Standard Formula (Unified Case, 100g)',
  basis: '100g',
  values: {
    Energy: 526,
    Protein: 10.83,
    PHE: 430,
    TYR: 500,
    LEU: 1079,
    ILE: 573,
    VAL: 641,
    MET: 273,
    THR: 583,
    LYS: 895,
    TRP: 174,
  },
};

export const STANDARD_FORMULA_BY_DISEASE: Record<DiseaseType, FormulaReference | null> = {
  [DiseaseType.PKU]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.TYR_I_IA_IB]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.TYR_II_III]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.MSUD]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.LEU_CATABOLISM]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.BETA_KETOTHIOLASE]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.HOMOCYSTINURIA]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.GA_TYPE_I]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.GA_TYPE_II]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.LPI]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.MMA_PA]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.GALACTOSEMIA]: STANDARD_UNIFIED_CASE_100G,
  [DiseaseType.UCD]: STANDARD_UNIFIED_CASE_100G,
};

export const REFERENCE_TEXT = '';

export const FORMULA_OPTIONS: FormulaOption[] = [
  {
    id: 'STANDARD_UNIFIED_CASE_100G',
    role: 'standard',
    name: 'Standard Formula (Unified Case, 100g)',
    basis: '100g',
    values: {
      Energy: 526,
      Protein: 10.83,
      PHE: 430,
      TYR: 500,
      LEU: 1079,
      ILE: 573,
      VAL: 641,
      MET: 273,
      THR: 583,
      LYS: 895,
      TRP: 174,
    },
  },
  {
    id: 'STANDARD_CASE_100G',
    role: 'standard',
    name: 'Standard Formula (Case, 100g)',
    basis: '100g',
    values: { Energy: 510, Protein: 10.8, PHE: 430, TYR: 500 },
    diseases: [DiseaseType.PKU, DiseaseType.TYR_I_IA_IB, DiseaseType.TYR_II_III],
  },
  {
    id: 'STANDARD_MSUD_CASE_100G',
    role: 'standard',
    name: 'Standard Formula (Case MSUD, 100g)',
    basis: '100g',
    values: { Energy: 526, Protein: 10.8, LEU: 1079, ILE: 573, VAL: 641 },
    diseases: [DiseaseType.MSUD, DiseaseType.LEU_CATABOLISM, DiseaseType.BETA_KETOTHIOLASE],
  },
  {
    id: 'STANDARD_MMA_PA_CASE_100G',
    role: 'standard',
    name: 'Standard Formula (Case MMA/PA, 100g)',
    basis: '100g',
    values: { Energy: 526, Protein: 10.83, ILE: 573, MET: 273, THR: 583, VAL: 641 },
    diseases: [DiseaseType.MMA_PA],
  },
  {
    id: 'STANDARD_GA_CASE_100G',
    role: 'standard',
    name: 'Standard Formula (Case GA, 100g)',
    basis: '100g',
    values: { Energy: 526, Protein: 10.83, LYS: 895, TRP: 174 },
    diseases: [DiseaseType.GA_TYPE_I],
  },
  {
    id: 'STANDARD_UCD_CASE_100G',
    role: 'standard',
    name: 'Standard Formula (Case UCD, 100g)',
    basis: '100g',
    values: { Energy: 540, Protein: 11 },
    diseases: [DiseaseType.UCD],
  },
  {
    id: 'PHE_FREE_CASE_100G',
    role: 'special',
    name: 'PHE-free Formula (Case, 100g)',
    basis: '100g',
    values: { Energy: 473, Protein: 13.5, PHE: 0, TYR: 1440 },
    diseases: [DiseaseType.PKU],
  },
  {
    id: 'PKU_NUTRI_1_ENERGY_100G',
    role: 'special',
    ageGroup: 'INFANT',
    name: 'PKU Nutri 1 Energy (0-12 months, 100g)',
    basis: '100g',
    values: { Energy: 478, Protein: 11.9, Carbohydrate: 52.5, Fat: 24.5, PHE: 0, TYR: 1320 },
    diseases: [DiseaseType.PKU],
  },
  {
    id: 'PKU_NUTRI_2_ENERGY_100G',
    role: 'special',
    ageGroup: 'CHILD',
    name: 'PKU Nutri 2 Energy (>1 year, 100g)',
    basis: '100g',
    values: { Energy: 423, Protein: 27, Carbohydrate: 42, Fat: 14, PHE: 0, TYR: 2390 },
    diseases: [DiseaseType.PKU],
  },
  {
    id: 'GA1_ANAMIX_INFANT_100G',
    role: 'special',
    ageGroup: 'INFANT',
    name: 'GA1 Anamix Infant (0-12 months, 100g)',
    basis: '100g',
    values: { Energy: 466, Protein: 13.1, Carbohydrate: 50.1, Fat: 23, LYS: 0, TRP: 90 },
    diseases: [DiseaseType.GA_TYPE_I],
  },
  {
    id: 'GA1_ANAMIX_JUNIOR_100G',
    role: 'special',
    ageGroup: 'CHILD',
    name: 'GA1 Anamix Junior (>1 year, 100g)',
    basis: '100g',
    values: { Energy: 367, Protein: 28, Carbohydrate: 30, Fat: 12.5, LYS: 0, TRP: 200 },
    diseases: [DiseaseType.GA_TYPE_I],
  },
  {
    id: 'IVA_ANAMIX_INFANT_100G',
    role: 'special',
    ageGroup: 'INFANT',
    name: 'IVA Anamix Infant (0-12 months, 100g)',
    basis: '100g',
    values: { Energy: 466, Protein: 13.1, Carbohydrate: 50.1, Fat: 23, LEU: 0 },
    diseases: [DiseaseType.LEU_CATABOLISM],
  },
  {
    id: 'IVA_ANAMIX_JUNIOR_100G',
    role: 'special',
    ageGroup: 'CHILD',
    name: 'IVA Anamix Junior (>1 year, 100g)',
    basis: '100g',
    values: { Energy: 367, Protein: 28, Carbohydrate: 30, Fat: 12.5, LEU: 0 },
    diseases: [DiseaseType.LEU_CATABOLISM],
  },
  {
    id: 'MMA_PA_ANAMIX_INFANT_100G',
    role: 'special',
    ageGroup: 'INFANT',
    name: 'MMA/PA Anamix Infant (0-12 months, 100g)',
    basis: '100g',
    values: { Energy: 466, Protein: 13.1, Carbohydrate: 50.1, Fat: 23, ILE: 0, MET: 0, THR: 0, VAL: 0 },
    diseases: [DiseaseType.MMA_PA],
  },
  {
    id: 'MMA_PA_ANAMIX_JUNIOR_100G',
    role: 'special',
    ageGroup: 'CHILD',
    name: 'MMA/PA Anamix Junior (>1 year, 100g)',
    basis: '100g',
    values: { Energy: 367, Protein: 28, Carbohydrate: 30, Fat: 12.5, ILE: 0, MET: 0, THR: 0, VAL: 0 },
    diseases: [DiseaseType.MMA_PA],
  },
  {
    id: 'MSUD_ANAMIX_INFANT_100G',
    role: 'special',
    ageGroup: 'INFANT',
    name: 'MSUD Anamix Infant (0-12 months, 100g)',
    basis: '100g',
    values: { Energy: 466, Protein: 13.1, Carbohydrate: 50.1, Fat: 23, ILE: 0, LEU: 0, VAL: 0 },
    diseases: [DiseaseType.MSUD],
  },
  {
    id: 'MSUD_ANAMIX_JUNIOR_100G',
    role: 'special',
    ageGroup: 'CHILD',
    name: 'MSUD Anamix Junior (>1 year, 100g)',
    basis: '100g',
    values: { Energy: 375, Protein: 28, Carbohydrate: 32, Fat: 12.5, ILE: 0, LEU: 0, VAL: 0 },
    diseases: [DiseaseType.MSUD],
  },
  {
    id: 'TYR_ANAMIX_INFANT_100G',
    role: 'special',
    ageGroup: 'INFANT',
    name: 'TYR Anamix Infant (0-12 months, 100g)',
    basis: '100g',
    values: { Energy: 466, Protein: 13.1, Carbohydrate: 50.1, Fat: 23, PHE: 0, TYR: 0 },
    diseases: [DiseaseType.TYR_I_IA_IB, DiseaseType.TYR_II_III],
  },
  {
    id: 'UCD_ANAMIX_INFANT_100G',
    role: 'special',
    ageGroup: 'INFANT',
    name: 'UCD Anamix Infant (0-12 months, 100g)',
    basis: '100g',
    values: { Energy: 492, Protein: 7.5, Carbohydrate: 56.5, Fat: 26.4 },
    diseases: [DiseaseType.UCD],
  },
  {
    id: 'UCD_ANAMIX_JUNIOR_100G',
    role: 'special',
    ageGroup: 'CHILD',
    name: 'UCD Anamix Junior (>1 year, 100g)',
    basis: '100g',
    values: { Energy: 385, Protein: 12, Carbohydrate: 46, Fat: 17 },
    diseases: [DiseaseType.UCD],
  },
  {
    id: 'TYREX1_100G',
    role: 'special',
    name: 'Tyrex-1 (100g)',
    basis: '100g',
    values: { Energy: 480, Protein: 15, PHE: 0, TYR: 0 },
    diseases: [DiseaseType.TYR_I_IA_IB, DiseaseType.TYR_II_III],
  },
  {
    id: 'TYREX2_100G',
    role: 'special',
    name: 'Tyrex-2 (100g)',
    basis: '100g',
    values: { Energy: 410, Protein: 30, PHE: 0, TYR: 0 },
    diseases: [DiseaseType.TYR_I_IA_IB, DiseaseType.TYR_II_III],
  },
  {
    id: 'KETONEX1_100G',
    role: 'special',
    name: 'Ketonex-1 (100g)',
    basis: '100g',
    values: { Energy: 480, Protein: 15, ILE: 0, LEU: 0, VAL: 0 },
    diseases: [DiseaseType.MSUD, DiseaseType.BETA_KETOTHIOLASE, DiseaseType.LEU_CATABOLISM],
  },
  {
    id: 'KETONEX2_100G',
    role: 'special',
    name: 'Ketonex-2 (100g)',
    basis: '100g',
    values: { Energy: 410, Protein: 30, ILE: 0, LEU: 0, VAL: 0 },
    diseases: [DiseaseType.MSUD, DiseaseType.BETA_KETOTHIOLASE, DiseaseType.LEU_CATABOLISM],
  },
  {
    id: 'HOMINEX1_100G',
    role: 'special',
    name: 'Hominex-1 (100g)',
    basis: '100g',
    values: { Energy: 480, Protein: 15, MET: 0, CYS: 450 },
    diseases: [DiseaseType.HOMOCYSTINURIA],
  },
  {
    id: 'HOMINEX2_100G',
    role: 'special',
    name: 'Hominex-2 (100g)',
    basis: '100g',
    values: { Energy: 410, Protein: 30, MET: 0, CYS: 900 },
    diseases: [DiseaseType.HOMOCYSTINURIA],
  },
  {
    id: 'SPECIAL_PRO_PHREE_100G',
    role: 'special',
    name: 'Special Formula (Pro-Phree, 100g)',
    basis: '100g',
    values: { Energy: 510, Protein: 0 },
    diseases: [DiseaseType.GA_TYPE_I, DiseaseType.GA_TYPE_II, DiseaseType.LPI, DiseaseType.GALACTOSEMIA],
  },
  {
    id: 'CYCLINEX1_100G',
    role: 'special',
    name: 'Cyclinex-1 (100g)',
    basis: '100g',
    values: { Energy: 510, Protein: 7.5 },
    diseases: [DiseaseType.UCD],
  },
  {
    id: 'CYCLINEX2_100G',
    role: 'special',
    name: 'Cyclinex-2 (100g)',
    basis: '100g',
    values: { Energy: 440, Protein: 15 },
    diseases: [DiseaseType.UCD],
  },
  {
    id: 'FANTOMALT_100G',
    role: 'modular',
    name: 'Fantomalt (100g)',
    basis: '100g',
    values: {
      Energy: 384,
      Protein: 0,
      Carbohydrate: 96,
      Fat: 0,
    },
    note: 'Source: Fantomalt Fact Sheet SA - FC (per 100g).',
  },
  {
    id: 'SS_DUOCAL_100G',
    role: 'modular',
    name: 'Super Soluble Duocal (100g)',
    basis: '100g',
    values: {
      Energy: 492,
      Protein: 0,
      Carbohydrate: 72.7,
      Fat: 22.3,
    },
    note: 'Source: Super Soluble Duocal Fact Sheet SA - FC (per 100g).',
  },
  {
    id: 'CAL_POWDER_100G',
    role: 'modular',
    name: 'CAL Powder (100g)',
    basis: '100g',
    values: {
      Energy: 511,
      Protein: 0,
      Carbohydrate: 70,
      Fat: 28,
      LinoleicAcid: 3000,
      LinolenicAcid: 300,
    },
    note: 'Source: CAL Powder Data Sheet (per 100g dry powder).',
  },
  {
    id: 'CARBOCH_100G',
    role: 'modular',
    name: 'CarboCH (100g)',
    basis: '100g',
    values: {
      Energy: 380,
      Protein: 0,
      Carbohydrate: 95,
      Fat: 0,
    },
    note: 'Estimated from product image: 95 kcal per 25g sachet.',
  },
];

const formulaOptionById: Record<string, FormulaOption> = {};
for (const item of FORMULA_OPTIONS) {
  formulaOptionById[item.id] = item;
}

export const FORMULA_OPTION_BY_ID: Record<string, FormulaOption> = formulaOptionById;

export const DEFAULT_FORMULA_SELECTION: Record<
  DiseaseType,
  { standard: string; special?: string; modular?: string }
> = {
  [DiseaseType.PKU]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'PKU_NUTRI_1_ENERGY_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.TYR_I_IA_IB]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'TYR_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.TYR_II_III]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'TYR_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.MSUD]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'MSUD_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.LEU_CATABOLISM]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'IVA_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.BETA_KETOTHIOLASE]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'KETONEX1_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.HOMOCYSTINURIA]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'HOMINEX1_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.GA_TYPE_I]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'GA1_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.GA_TYPE_II]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'SPECIAL_PRO_PHREE_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.LPI]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'SPECIAL_PRO_PHREE_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.MMA_PA]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'MMA_PA_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.GALACTOSEMIA]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'SPECIAL_PRO_PHREE_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.UCD]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'UCD_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
};

export const SUPPORTED_DISEASES: DiseaseType[] = [
  DiseaseType.PKU,
  DiseaseType.TYR_I_IA_IB,
  DiseaseType.MSUD,
  DiseaseType.LEU_CATABOLISM,
  DiseaseType.GA_TYPE_I,
  DiseaseType.MMA_PA,
  DiseaseType.UCD,
];

export const FORMULA_LIBRARY_BY_DISEASE: Partial<
  Record<DiseaseType, Record<FormulaRole, string[]>>
> = {
  [DiseaseType.PKU]: {
    standard: ['STANDARD_UNIFIED_CASE_100G'],
    special: ['PKU_NUTRI_1_ENERGY_100G', 'PKU_NUTRI_2_ENERGY_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.TYR_I_IA_IB]: {
    standard: ['STANDARD_UNIFIED_CASE_100G'],
    special: ['TYR_ANAMIX_INFANT_100G', 'TYREX1_100G', 'TYREX2_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.MSUD]: {
    standard: ['STANDARD_UNIFIED_CASE_100G'],
    special: ['MSUD_ANAMIX_INFANT_100G', 'MSUD_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.LEU_CATABOLISM]: {
    standard: ['STANDARD_UNIFIED_CASE_100G'],
    special: ['IVA_ANAMIX_INFANT_100G', 'IVA_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.GA_TYPE_I]: {
    standard: ['STANDARD_UNIFIED_CASE_100G'],
    special: ['GA1_ANAMIX_INFANT_100G', 'GA1_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.MMA_PA]: {
    standard: ['STANDARD_UNIFIED_CASE_100G'],
    special: ['MMA_PA_ANAMIX_INFANT_100G', 'MMA_PA_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.UCD]: {
    standard: ['STANDARD_UNIFIED_CASE_100G'],
    special: ['UCD_ANAMIX_INFANT_100G', 'UCD_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
};

export const DISEASE_ANALYSIS_CONTEXT: Record<DiseaseType, 'AA' | 'PROTEIN'> = {
  [DiseaseType.PKU]: 'AA',
  [DiseaseType.TYR_I_IA_IB]: 'AA',
  [DiseaseType.TYR_II_III]: 'AA',
  [DiseaseType.MSUD]: 'AA',
  [DiseaseType.LEU_CATABOLISM]: 'AA',
  [DiseaseType.BETA_KETOTHIOLASE]: 'AA',
  [DiseaseType.HOMOCYSTINURIA]: 'AA',
  [DiseaseType.GA_TYPE_I]: 'AA',
  [DiseaseType.GA_TYPE_II]: 'PROTEIN',
  [DiseaseType.LPI]: 'PROTEIN',
  [DiseaseType.MMA_PA]: 'AA',
  [DiseaseType.GALACTOSEMIA]: 'PROTEIN',
  [DiseaseType.UCD]: 'PROTEIN',
};

export const DISEASE_ANALYSIS_NUTRIENTS: Record<DiseaseType, string[]> = {
  [DiseaseType.PKU]: ['PHE', 'TYR'],
  [DiseaseType.TYR_I_IA_IB]: ['PHE+TYR'],
  [DiseaseType.TYR_II_III]: ['PHE', 'TYR'],
  [DiseaseType.MSUD]: ['LEU', 'ILE', 'VAL'],
  [DiseaseType.LEU_CATABOLISM]: ['LEU'],
  [DiseaseType.BETA_KETOTHIOLASE]: ['LEU', 'ILE', 'VAL'],
  [DiseaseType.HOMOCYSTINURIA]: ['MET', 'CYS'],
  [DiseaseType.GA_TYPE_I]: ['LYS', 'TRP'],
  [DiseaseType.GA_TYPE_II]: ['Protein', 'Fat'],
  [DiseaseType.LPI]: ['Protein'],
  [DiseaseType.MMA_PA]: ['ILE', 'MET', 'THR', 'VAL'],
  [DiseaseType.GALACTOSEMIA]: ['Protein'],
  [DiseaseType.UCD]: ['Protein'],
};

/**
 * For diseases listed here, the Standard formula is sized by ONE specific amino acid only,
 * rather than whichever is most restrictive across all amino acids.
 * MMA/PA → MET: clinician drives Standard by methionine (the lowest-tolerance amino).
 */
export const STANDARD_LIMITER_BY_DISEASE: Partial<Record<DiseaseType, string>> = {
  [DiseaseType.MMA_PA]: 'MET',
};
