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

export const GUIDELINES: Record<DiseaseType, AgeGuideline[]> = {
  [DiseaseType.PKU]: [
    {
      ageLabel: 'Birth to <3 mo',
      nutrients: {
        PHE: r(25, 70, 'mg/kg'),
        TYR: r(1100, 1300, 'mg/day'),
        Protein: r(2.5, 3.0, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(135, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        PHE: r(20, 45, 'mg/kg'),
        TYR: r(1400, 2100, 'mg/day'),
        Protein: r(2.0, 3.0, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        PHE: r(15, 35, 'mg/kg'),
        TYR: r(2500, 3000, 'mg/day'),
        Protein: r(2.0, 2.5, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 110),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        PHE: r(10, 35, 'mg/kg'),
        TYR: r(2500, 3000, 'mg/day'),
        Protein: r(2.0, 2.5, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to 4 yr',
      nutrients: {
        PHE: r(200, 320, 'mg/day'),
        TYR: r(2800, 3500, 'mg/day'),
        Protein: r(1.5, 2.0, 'g/kg'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 yr to Adult',
      nutrients: {
        PHE: r(200, 1100, 'mg/day'),
        TYR: r(4000, 6000, 'mg/day'),
        Protein: r(1.0, 1.5, 'g/kg'),
        Energy: r(1400, 3300, 'kcal/day', 2400),
        Fluid: r(1400, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.TYR_I_IA_IB]: [
    {
      ageLabel: '0 to 3 mo',
      nutrients: {
        'PHE+TYR': r(65, 155, 'mg/kg'),
        Protein: r(3.0, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(135, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to 6 mo',
      nutrients: {
        'PHE+TYR': r(55, 135, 'mg/kg'),
        Protein: r(3.0, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to 9 mo',
      nutrients: {
        'PHE+TYR': r(50, 120, 'mg/kg'),
        Protein: r(2.5, 3.0, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 110),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to 12 mo',
      nutrients: {
        'PHE+TYR': r(40, 105, 'mg/kg'),
        Protein: r(2.5, 3.0, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to 4 yr',
      nutrients: {
        'PHE+TYR': r(380, 800, 'mg/day'),
        Protein: atLeast(30, 'g/day'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        'PHE+TYR': r(390, 900, 'mg/day'),
        Protein: atLeast(35, 'g/day'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        'PHE+TYR': r(400, 1000, 'mg/day'),
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1650, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        'PHE+TYR': r(800, 1200, 'mg/day'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        'PHE+TYR': r(800, 1200, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        'PHE+TYR': r(800, 1000, 'mg/day'),
        Protein: atLeast(60, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        'PHE+TYR': r(990, 1200, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        'PHE+TYR': r(1000, 1500, 'mg/day'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        'PHE+TYR': r(1000, 1500, 'mg/day'),
        Protein: atLeast(70, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.TYR_II_III]: [
    {
      ageLabel: '0 to <3 mo',
      nutrients: {
        PHE: r(30, 90, 'mg/kg'),
        TYR: r(35, 90, 'mg/kg'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        PHE: r(30, 70, 'mg/kg'),
        TYR: r(30, 70, 'mg/kg'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        PHE: r(25, 50, 'mg/kg'),
        TYR: r(25, 50, 'mg/kg'),
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 110),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        PHE: r(20, 40, 'mg/kg'),
        TYR: r(20, 40, 'mg/kg'),
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to <4 yr',
      nutrients: {
        PHE: r(250, 500, 'mg/day'),
        TYR: r(200, 450, 'mg/day'),
        Protein: atLeast(30, 'g/day'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        PHE: r(260, 550, 'mg/day'),
        TYR: r(250, 500, 'mg/day'),
        Protein: atLeast(35, 'g/day'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        PHE: r(270, 600, 'mg/day'),
        TYR: r(260, 550, 'mg/day'),
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1730, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        PHE: r(300, 650, 'mg/day'),
        TYR: r(290, 500, 'mg/day'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        PHE: r(280, 700, 'mg/day'),
        TYR: r(270, 450, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        PHE: r(270, 700, 'mg/day'),
        TYR: r(260, 450, 'mg/day'),
        Protein: atLeast(60, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        PHE: r(275, 700, 'mg/day'),
        TYR: r(260, 550, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        PHE: r(350, 750, 'mg/day'),
        TYR: r(340, 550, 'mg/day'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        PHE: r(340, 750, 'mg/day'),
        TYR: r(330, 550, 'mg/day'),
        Protein: atLeast(70, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.MSUD]: [
    {
      ageLabel: '0 to 6 mo',
      nutrients: {
        ILE: r(30, 90, 'mg/kg'),
        LEU: r(40, 100, 'mg/kg'),
        VAL: r(40, 95, 'mg/kg'),
        Protein: r(2.5, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '7 to 12 mo',
      nutrients: {
        ILE: r(30, 70, 'mg/kg'),
        LEU: r(40, 75, 'mg/kg'),
        VAL: r(30, 80, 'mg/kg'),
        Protein: r(2.5, 3.0, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to 3 yr',
      nutrients: {
        ILE: r(20, 70, 'mg/kg'),
        LEU: r(40, 70, 'mg/kg'),
        VAL: r(30, 70, 'mg/kg'),
        Protein: r(1.5, 2.5, 'g/kg'),
        Energy: r(80, 130, 'kcal/kg', 105),
        Fluid: r(900, 1300, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to 8 yr',
      nutrients: {
        ILE: r(20, 30, 'mg/kg'),
        LEU: r(35, 65, 'mg/kg'),
        VAL: r(30, 50, 'mg/kg'),
        Protein: r(1.3, 2.0, 'g/kg'),
        Energy: r(50, 120, 'kcal/kg', 85),
        Fluid: r(1300, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '9 to 13 yr',
      nutrients: {
        ILE: r(20, 30, 'mg/kg'),
        LEU: r(30, 60, 'mg/kg'),
        VAL: r(25, 40, 'mg/kg'),
        Protein: r(1.2, 1.8, 'g/kg'),
        Energy: r(40, 90, 'kcal/kg', 65),
        Fluid: r(1500, 2400, 'mL/day'),
      },
    },
    {
      ageLabel: '14 to 18 yr',
      nutrients: {
        ILE: r(10, 30, 'mg/kg'),
        LEU: r(15, 50, 'mg/kg'),
        VAL: r(15, 30, 'mg/kg'),
        Protein: r(1.2, 1.8, 'g/kg'),
        Energy: r(35, 70, 'kcal/kg', 50),
        Fluid: r(1800, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: '>=19 yr (Adult)',
      nutrients: {
        ILE: r(10, 30, 'mg/kg'),
        LEU: r(15, 50, 'mg/kg'),
        VAL: r(15, 30, 'mg/kg'),
        Protein: r(1.1, 1.7, 'g/kg'),
        Energy: r(35, 45, 'kcal/kg', 40),
        Fluid: r(2100, 3000, 'mL/day'),
      },
    },
  ],

  [DiseaseType.LEU_CATABOLISM]: [
    {
      ageLabel: '0 to <3 mo',
      nutrients: {
        LEU: r(80, 150, 'mg/kg'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        LEU: r(70, 140, 'mg/kg'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        LEU: r(60, 130, 'mg/kg'),
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 110),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        LEU: r(50, 120, 'mg/kg'),
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to <4 yr',
      nutrients: {
        LEU: r(500, 900, 'mg/day'),
        Protein: atLeast(30, 'g/day'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        LEU: r(600, 900, 'mg/day'),
        Protein: atLeast(35, 'g/day'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        LEU: r(700, 900, 'mg/day'),
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1730, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        LEU: r(700, 900, 'mg/day'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        LEU: r(620, 820, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        LEU: r(620, 820, 'mg/day'),
        Protein: atLeast(60, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        LEU: r(1100, 1500, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        LEU: r(1100, 1500, 'mg/day'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        LEU: r(1000, 1400, 'mg/day'),
        Protein: atLeast(70, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.BETA_KETOTHIOLASE]: [
    {
      ageLabel: '0 to <3 mo',
      nutrients: {
        ILE: r(90, 140, 'mg/kg'),
        LEU: atLeast(180, 'mg/kg'),
        VAL: atLeast(100, 'mg/kg'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        ILE: r(85, 135, 'mg/kg'),
        LEU: atLeast(160, 'mg/kg'),
        VAL: atLeast(90, 'mg/kg'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        ILE: r(80, 135, 'mg/kg'),
        LEU: atLeast(150, 'mg/kg'),
        VAL: atLeast(80, 'mg/kg'),
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 110),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        ILE: r(75, 125, 'mg/kg'),
        LEU: atLeast(140, 'mg/kg'),
        VAL: atLeast(70, 'mg/kg'),
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to <4 yr',
      nutrients: {
        ILE: r(750, 1000, 'mg/day'),
        LEU: atLeast(1000, 'mg/day'),
        VAL: atLeast(750, 'mg/day'),
        Protein: atLeast(30, 'g/day'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        ILE: r(850, 1100, 'mg/day'),
        LEU: atLeast(1150, 'mg/day'),
        VAL: atLeast(850, 'mg/day'),
        Protein: atLeast(35, 'g/day'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        ILE: r(1000, 1300, 'mg/day'),
        LEU: atLeast(1300, 'mg/day'),
        VAL: atLeast(1000, 'mg/day'),
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1650, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        ILE: r(1200, 1500, 'mg/day'),
        LEU: atLeast(1900, 'mg/day'),
        VAL: atLeast(1800, 'mg/day'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        ILE: r(1000, 1300, 'mg/day'),
        LEU: atLeast(1300, 'mg/day'),
        VAL: atLeast(1000, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        ILE: r(1000, 1300, 'mg/day'),
        LEU: atLeast(1330, 'mg/day'),
        VAL: atLeast(1000, 'mg/day'),
        Protein: atLeast(60, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        ILE: r(1000, 1300, 'mg/day'),
        LEU: atLeast(1900, 'mg/day'),
        VAL: atLeast(1150, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        ILE: r(1300, 1650, 'mg/day'),
        LEU: atLeast(1650, 'mg/day'),
        VAL: atLeast(1300, 'mg/day'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        ILE: r(1300, 1650, 'mg/day'),
        LEU: atLeast(1650, 'mg/day'),
        VAL: atLeast(1300, 'mg/day'),
        Protein: atLeast(70, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.HOMOCYSTINURIA]: [
    {
      ageLabel: '0 to 6 mo',
      nutrients: {
        MET: r(15, 60, 'mg/kg'),
        CYS: r(85, 150, 'mg/day'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to 12 mo',
      nutrients: {
        MET: r(12, 43, 'mg/kg'),
        CYS: r(85, 150, 'mg/day'),
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to 4 yr',
      nutrients: {
        MET: r(9, 28, 'mg/kg'),
        CYS: r(60, 100, 'mg/day'),
        Protein: atLeast(30, 'g/day'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to 7 yr',
      nutrients: {
        MET: r(7, 22, 'mg/kg'),
        CYS: r(50, 80, 'mg/day'),
        Protein: atLeast(35, 'g/day'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to 11 yr',
      nutrients: {
        MET: r(7, 22, 'mg/kg'),
        CYS: r(30, 50, 'mg/day'),
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1650, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        MET: r(6, 14, 'mg/kg'),
        CYS: r(50, 150, 'mg/day'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        MET: r(6, 12, 'mg/kg'),
        CYS: r(25, 125, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        MET: r(4, 10, 'mg/kg'),
        CYS: r(25, 100, 'mg/day'),
        Protein: atLeast(60, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        MET: r(6, 14, 'mg/kg'),
        CYS: r(50, 150, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        MET: r(6, 16, 'mg/kg'),
        CYS: r(25, 125, 'mg/day'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        MET: r(6, 15, 'mg/kg'),
        CYS: r(25, 100, 'mg/day'),
        Protein: atLeast(70, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.GA_TYPE_I]: [
    {
      ageLabel: 'Birth to 6 mo',
      nutrients: {
        LYS: r(65, 100, 'mg/kg'),
        TRP: r(10, 20, 'mg/kg'),
        Protein: r(2.75, 3.0, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to 12 mo',
      nutrients: {
        LYS: r(55, 90, 'mg/kg'),
        TRP: r(10, 12, 'mg/kg'),
        Protein: r(2.5, 3.0, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to 4 yr',
      nutrients: {
        LYS: r(50, 80, 'mg/kg'),
        TRP: r(8, 12, 'mg/kg'),
        Protein: r(1.8, 2.6, 'g/kg'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to 7 yr',
      nutrients: {
        LYS: r(40, 70, 'mg/kg'),
        TRP: r(7, 11, 'mg/kg'),
        Protein: r(1.6, 2.0, 'g/kg'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        LYS: r(35, 45, 'mg/kg'),
        TRP: r(4, 10, 'mg/kg'),
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1650, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        LYS: r(30, 40, 'mg/kg'),
        TRP: r(4, 6, 'mg/kg'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        LYS: r(20, 30, 'mg/kg'),
        TRP: r(3, 5, 'mg/kg'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        LYS: r(10, 20, 'mg/kg'),
        TRP: r(3, 4, 'mg/kg'),
        Protein: atLeast(60, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        LYS: r(30, 40, 'mg/kg'),
        TRP: r(4, 6, 'mg/kg'),
        Protein: atLeast(60, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        LYS: r(35, 45, 'mg/kg'),
        TRP: r(6, 8, 'mg/kg'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        LYS: r(35, 45, 'mg/kg'),
        TRP: r(3, 5, 'mg/kg'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.GA_TYPE_II]: [
    {
      ageLabel: '0 to <3 mo',
      nutrients: {
        Protein: r(1.7, 2, 'g/kg'),
        Fat: r(20, 25, '%energy'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        Protein: r(1.4, 1.7, 'g/kg'),
        Fat: r(20, 25, '%energy'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        Protein: r(1.1, 1.4, 'g/kg'),
        Fat: r(20, 25, '%energy'),
        Energy: r(80, 135, 'kcal/kg', 110),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        Protein: r(1.1, 1.4, 'g/kg'),
        Fat: r(20, 25, '%energy'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to <4 yr',
      nutrients: {
        Protein: r(15, 23, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        Protein: r(20, 30, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        Protein: r(25, 34, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1650, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        Protein: r(30, 40, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        Protein: r(40, 45, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        Protein: r(45, 50, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        Protein: r(40, 42, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        Protein: r(42, 49, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        Protein: r(49, 55, 'g/day'),
        Fat: r(20, 25, '%energy'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.LPI]: [
    {
      ageLabel: '0 to <3 mo',
      nutrients: {
        Protein: r(1.5, 2.2, 'g/kg'),
        Energy: r(125, 140, 'kcal/kg'),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        Protein: r(1.5, 2, 'g/kg'),
        Energy: r(120, 130, 'kcal/kg'),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        Protein: r(1.25, 1.8, 'g/kg'),
        Energy: r(115, 130, 'kcal/kg'),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        Protein: r(1.15, 1.6, 'g/kg'),
        Energy: r(110, 120, 'kcal/kg'),
        Fluid: r(120, 130, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to <4 yr',
      nutrients: {
        Protein: r(10, 13, 'g/day'),
        Energy: r(945, 1890, 'kcal/day'),
        Fluid: r(945, 1890, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        Protein: r(14, 20, 'g/day'),
        Energy: r(1365, 2415, 'kcal/day'),
        Fluid: r(1365, 2445, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        Protein: r(20, 28, 'g/day'),
        Energy: r(1730, 3465, 'kcal/day'),
        Fluid: r(1730, 3465, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        Protein: r(30, 40, 'g/day'),
        Energy: r(1575, 3150, 'kcal/day'),
        Fluid: r(1575, 3150, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        Protein: r(40, 45, 'g/day'),
        Energy: r(1260, 3150, 'kcal/day'),
        Fluid: r(1260, 3150, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        Protein: r(45, 47, 'g/day'),
        Energy: r(1785, 2625, 'kcal/day'),
        Fluid: r(1875, 2525, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        Protein: r(30, 42, 'g/day'),
        Energy: r(2100, 3885, 'kcal/day'),
        Fluid: r(2100, 3885, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        Protein: r(42, 49, 'g/day'),
        Energy: r(2200, 4095, 'kcal/day'),
        Fluid: r(2200, 4095, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        Protein: r(49, 55, 'g/day'),
        Energy: r(2625, 3465, 'kcal/day'),
        Fluid: r(2625, 3465, 'mL/day'),
      },
    },
  ],

  [DiseaseType.MMA_PA]: [
    {
      ageLabel: '0 to 3 mo',
      nutrients: {
        ILE: r(75, 120, 'mg/kg'),
        MET: r(30, 50, 'mg/kg'),
        THR: r(75, 135, 'mg/kg'),
        VAL: r(75, 105, 'mg/kg'),
        Protein: r(2.5, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 200, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to 6 mo',
      nutrients: {
        ILE: r(65, 100, 'mg/kg'),
        MET: r(20, 45, 'mg/kg'),
        THR: r(60, 100, 'mg/kg'),
        VAL: r(65, 90, 'mg/kg'),
        Protein: r(2.5, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '7 to 12 mo',
      nutrients: {
        ILE: r(50, 90, 'mg/kg'),
        MET: r(10, 40, 'mg/kg'),
        THR: r(40, 75, 'mg/kg'),
        VAL: r(35, 75, 'mg/kg'),
        Protein: r(2.0, 3.0, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to 3 yr',
      nutrients: {
        ILE: r(40, 80, 'mg/kg'),
        MET: r(10, 30, 'mg/kg'),
        THR: r(20, 40, 'mg/kg'),
        VAL: r(30, 60, 'mg/kg'),
        Protein: r(1.5, 2.5, 'g/kg'),
        Energy: r(80, 130, 'kcal/kg', 105),
        Fluid: r(900, 1300, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to 8 yr',
      nutrients: {
        ILE: r(40, 80, 'mg/kg'),
        MET: r(10, 30, 'mg/kg'),
        THR: r(20, 40, 'mg/kg'),
        VAL: r(30, 60, 'mg/kg'),
        Protein: r(1.3, 2.0, 'g/kg'),
        Energy: r(56, 88, 'kcal/kg', 72),
        Fluid: r(1300, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        ILE: r(715, 1090, 'mg/day'),
        MET: r(290, 580, 'mg/day'),
        THR: r(610, 885, 'mg/day'),
        VAL: r(815, 1225, 'mg/day'),
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1650, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        ILE: r(965, 1470, 'mg/day'),
        MET: r(390, 780, 'mg/day'),
        THR: r(830, 1195, 'mg/day'),
        VAL: r(1105, 1655, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        ILE: r(965, 1470, 'mg/day'),
        MET: r(275, 780, 'mg/day'),
        THR: r(830, 1195, 'mg/day'),
        VAL: r(1105, 1655, 'mg/day'),
        Protein: atLeast(55, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        ILE: r(925, 1410, 'mg/day'),
        MET: r(265, 750, 'mg/day'),
        THR: r(790, 1145, 'mg/day'),
        VAL: r(790, 1585, 'mg/day'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        ILE: r(540, 765, 'mg/day'),
        MET: r(290, 765, 'mg/day'),
        THR: r(810, 1170, 'mg/day'),
        VAL: r(1080, 1515, 'mg/day'),
        Protein: atLeast(50, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        ILE: r(670, 950, 'mg/day'),
        MET: r(475, 950, 'mg/day'),
        THR: r(1010, 1455, 'mg/day'),
        VAL: r(1345, 2015, 'mg/day'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        ILE: r(1175, 1190, 'mg/day'),
        MET: r(475, 950, 'mg/day'),
        THR: r(1010, 1455, 'mg/day'),
        VAL: r(1345, 2015, 'mg/day'),
        Protein: atLeast(65, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.GALACTOSEMIA]: [
    {
      ageLabel: '0 to <3 mo',
      nutrients: {
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 120),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        Protein: r(3, 3.5, 'g/kg'),
        Energy: r(95, 145, 'kcal/kg', 115),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 110),
        Fluid: r(125, 145, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        Protein: r(2.5, 3, 'g/kg'),
        Energy: r(80, 135, 'kcal/kg', 105),
        Fluid: r(120, 135, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to <4 yr',
      nutrients: {
        Protein: atLeast(30, 'g/day'),
        Energy: r(900, 1800, 'kcal/day', 1300),
        Fluid: r(900, 1800, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        Protein: atLeast(35, 'g/day'),
        Energy: r(1300, 2300, 'kcal/day', 1700),
        Fluid: r(1300, 2300, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        Protein: atLeast(40, 'g/day'),
        Energy: r(1650, 3300, 'kcal/day', 2400),
        Fluid: r(1650, 3300, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        Protein: atLeast(50, 'g/day'),
        Energy: r(1500, 3000, 'kcal/day', 2200),
        Fluid: r(1500, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        Protein: atLeast(50, 'g/day'),
        Energy: r(1200, 3000, 'kcal/day', 2100),
        Fluid: r(1200, 3000, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        Protein: atLeast(50, 'g/day'),
        Energy: r(1400, 2500, 'kcal/day', 2100),
        Fluid: r(1400, 2500, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        Protein: atLeast(55, 'g/day'),
        Energy: r(2000, 3700, 'kcal/day', 2700),
        Fluid: r(2000, 3700, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        Protein: atLeast(65, 'g/day'),
        Energy: r(2100, 3900, 'kcal/day', 2800),
        Fluid: r(2100, 3900, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        Protein: atLeast(65, 'g/day'),
        Energy: r(2000, 3300, 'kcal/day', 2900),
        Fluid: r(2000, 3300, 'mL/day'),
      },
    },
  ],

  [DiseaseType.UCD]: [
    {
      ageLabel: '0 to <3 mo',
      nutrients: {
        Protein: r(1.25, 2.2, 'g/kg'),
        Energy: r(125, 150, 'kcal/kg'),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '3 to <6 mo',
      nutrients: {
        Protein: r(1.8, 2, 'g/kg'),
        Energy: r(120, 140, 'kcal/kg'),
        Fluid: r(130, 160, 'mL/kg'),
      },
    },
    {
      ageLabel: '6 to <9 mo',
      nutrients: {
        Protein: r(1.6, 1.8, 'g/kg'),
        Energy: r(115, 130, 'kcal/kg'),
        Fluid: r(125, 150, 'mL/kg'),
      },
    },
    {
      ageLabel: '9 to <12 mo',
      nutrients: {
        Protein: r(1.4, 1.6, 'g/kg'),
        Energy: r(110, 120, 'kcal/kg'),
        Fluid: r(120, 130, 'mL/kg'),
      },
    },
    {
      ageLabel: '1 to <4 yr',
      nutrients: {
        Protein: r(8, 12, 'g/day'),
        Energy: r(945, 1890, 'kcal/day'),
        Fluid: r(945, 1890, 'mL/day'),
      },
    },
    {
      ageLabel: '4 to <7 yr',
      nutrients: {
        Protein: r(12, 15, 'g/day'),
        Energy: r(1365, 2415, 'kcal/day'),
        Fluid: r(1365, 2415, 'mL/day'),
      },
    },
    {
      ageLabel: '7 to <11 yr',
      nutrients: {
        Protein: r(14, 17, 'g/day'),
        Energy: r(1730, 3465, 'kcal/day'),
        Fluid: r(1730, 3465, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 11 to <15 yr',
      nutrients: {
        Protein: r(20, 23, 'g/day'),
        Energy: r(1575, 3150, 'kcal/day'),
        Fluid: r(1575, 3150, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women 15 to <19 yr',
      nutrients: {
        Protein: r(20, 23, 'g/day'),
        Energy: r(1260, 3150, 'kcal/day'),
        Fluid: r(1260, 3150, 'mL/day'),
      },
    },
    {
      ageLabel: 'Women >=19 yr',
      nutrients: {
        Protein: r(22, 25, 'g/day'),
        Energy: r(1785, 2625, 'kcal/day'),
        Fluid: r(1785, 2625, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 11 to <15 yr',
      nutrients: {
        Protein: r(20, 23, 'g/day'),
        Energy: r(2100, 3885, 'kcal/day'),
        Fluid: r(2100, 3885, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men 15 to <19 yr',
      nutrients: {
        Protein: r(21, 24, 'g/day'),
        Energy: r(2200, 4095, 'kcal/day'),
        Fluid: r(2200, 4095, 'mL/day'),
      },
    },
    {
      ageLabel: 'Men >=19 yr',
      nutrients: {
        Protein: r(23, 32, 'g/day'),
        Energy: r(2625, 3465, 'kcal/day'),
        Fluid: r(2625, 3465, 'mL/day'),
      },
    },
  ],
};

export const UCD_SUBTYPES: { id: UcdSubtype; label: string }[] = [
  { id: 'CPS', label: 'CPS - Carbamyl Phosphate Synthetase' },
  { id: 'OTC', label: 'OTC - Ornithine Transcarbamylase' },
  { id: 'ASS', label: 'ASS - Citrullinemia (Argininosuccinate Synthetase)' },
  { id: 'ASA', label: 'ASA - Argininosuccinate Lyase' },
  { id: 'ARG', label: 'ARG - Arginase (Hyperargininemia)' },
];

export const UCD_GUIDELINES_BY_SUBTYPE: Record<UcdSubtype, AgeGuideline[]> = {
  CPS: [
    {
      ageLabel: '0 to 1 yr',
      nutrients: {
        NaturalProtein: r(0.8, 1.1, 'g/kg'),
        EAA: r(0.4, 1.1, 'g/kg'),
        Protein: r(1.2, 2.2, 'g/kg'),
        Energy: r(120, 145, 'kcal/kg'),
        LCitrulline: r(100, 200, 'mg/kg'),
      },
    },
    {
      ageLabel: '1 to 7 yr',
      nutrients: {
        NaturalProtein: r(0.7, 0.8, 'g/kg'),
        EAA: r(0.3, 0.7, 'g/kg'),
        Protein: r(1.0, 1.2, 'g/kg'),
        Energy: r(100, 120, 'kcal/kg'),
        LCitrulline: r(100, 200, 'mg/kg'),
      },
    },
    {
      ageLabel: '7 to 19 yr',
      nutrients: {
        NaturalProtein: r(0.3, 1.0, 'g/kg'),
        EAA: r(0.4, 0.7, 'g/kg'),
        Protein: r(0.8, 1.4, 'g/kg'),
        Energy: r(80, 110, 'kcal/kg'),
        LCitrulline: r(100, 200, 'mg/kg'),
      },
    },
    {
      ageLabel: '>19 yr (Adult)',
      nutrients: {
        NaturalProtein: r(0.6, 0.7, 'g/kg'),
        EAA: r(0.2, 0.5, 'g/kg'),
        Protein: r(0.8, 1.0, 'g/kg'),
        Energy: r(35, 65, 'kcal/kg'),
      },
    },
  ],
  OTC: [
    {
      ageLabel: '0 to 1 yr',
      nutrients: {
        NaturalProtein: r(0.8, 1.1, 'g/kg'),
        EAA: r(0.4, 1.1, 'g/kg'),
        Protein: r(1.2, 2.2, 'g/kg'),
        Energy: r(120, 145, 'kcal/kg'),
        LCitrulline: r(100, 200, 'mg/kg'),
      },
    },
    {
      ageLabel: '1 to 7 yr',
      nutrients: {
        NaturalProtein: r(0.7, 0.8, 'g/kg'),
        EAA: r(0.3, 0.7, 'g/kg'),
        Protein: r(1.0, 1.2, 'g/kg'),
        Energy: r(100, 120, 'kcal/kg'),
        LCitrulline: r(100, 200, 'mg/kg'),
      },
    },
    {
      ageLabel: '7 to 19 yr',
      nutrients: {
        NaturalProtein: r(0.3, 1.0, 'g/kg'),
        EAA: r(0.4, 0.7, 'g/kg'),
        Protein: r(0.8, 1.4, 'g/kg'),
        Energy: r(80, 110, 'kcal/kg'),
        LCitrulline: r(100, 200, 'mg/kg'),
      },
    },
    {
      ageLabel: '>19 yr (Adult)',
      nutrients: {
        NaturalProtein: r(0.6, 0.7, 'g/kg'),
        EAA: r(0.2, 0.5, 'g/kg'),
        Protein: r(0.8, 1.0, 'g/kg'),
        Energy: r(35, 65, 'kcal/kg'),
      },
    },
  ],
  ASS: [
    {
      ageLabel: '0 to 1 yr',
      nutrients: {
        NaturalProtein: r(0.9, 1.7, 'g/kg'),
        EAA: r(0.0, 0.5, 'g/kg'),
        Protein: r(1.2, 2.2, 'g/kg'),
        Energy: r(120, 145, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
    {
      ageLabel: '1 to 7 yr',
      nutrients: {
        NaturalProtein: r(0.7, 0.9, 'g/kg'),
        EAA: r(0.0, 0.3, 'g/kg'),
        Protein: r(1.0, 1.2, 'g/kg'),
        Energy: r(100, 120, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
    {
      ageLabel: '7 to 19 yr',
      nutrients: {
        NaturalProtein: r(0.4, 1.1, 'g/kg'),
        EAA: r(0.0, 0.3, 'g/kg'),
        Protein: r(0.8, 1.4, 'g/kg'),
        Energy: r(80, 110, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
    {
      ageLabel: '>19 yr (Adult)',
      nutrients: {
        NaturalProtein: r(0.3, 0.8, 'g/kg'),
        EAA: r(0.0, 0.2, 'g/kg'),
        Protein: r(0.8, 1.0, 'g/kg'),
        Energy: r(35, 65, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
  ],
  ASA: [
    {
      ageLabel: '0 to 1 yr',
      nutrients: {
        NaturalProtein: r(0.9, 1.7, 'g/kg'),
        EAA: r(0.0, 0.5, 'g/kg'),
        Protein: r(1.2, 2.2, 'g/kg'),
        Energy: r(120, 145, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
    {
      ageLabel: '1 to 7 yr',
      nutrients: {
        NaturalProtein: r(0.7, 0.9, 'g/kg'),
        EAA: r(0.0, 0.3, 'g/kg'),
        Protein: r(1.0, 1.2, 'g/kg'),
        Energy: r(100, 120, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
    {
      ageLabel: '7 to 19 yr',
      nutrients: {
        NaturalProtein: r(0.4, 1.1, 'g/kg'),
        EAA: r(0.0, 0.3, 'g/kg'),
        Protein: r(0.8, 1.4, 'g/kg'),
        Energy: r(80, 110, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
    {
      ageLabel: '>19 yr (Adult)',
      nutrients: {
        NaturalProtein: r(0.3, 0.8, 'g/kg'),
        EAA: r(0.0, 0.2, 'g/kg'),
        Protein: r(0.8, 1.0, 'g/kg'),
        Energy: r(35, 65, 'kcal/kg'),
        LArginine: r(100, 300, 'mg/kg'),
      },
    },
  ],
  ARG: [
    {
      ageLabel: '0 to 1 yr',
      nutrients: {
        NaturalProtein: r(0.9, 1.7, 'g/kg'),
        EAA: r(0.0, 0.5, 'g/kg'),
        Protein: r(1.2, 2.2, 'g/kg'),
        Energy: r(120, 145, 'kcal/kg'),
      },
    },
    {
      ageLabel: '1 to 7 yr',
      nutrients: {
        NaturalProtein: r(0.7, 0.9, 'g/kg'),
        EAA: r(0.0, 0.3, 'g/kg'),
        Protein: r(1.0, 1.2, 'g/kg'),
        Energy: r(100, 120, 'kcal/kg'),
      },
    },
    {
      ageLabel: '7 to 19 yr',
      nutrients: {
        NaturalProtein: r(0.4, 1.1, 'g/kg'),
        EAA: r(0.0, 0.3, 'g/kg'),
        Protein: r(0.8, 1.4, 'g/kg'),
        Energy: r(80, 110, 'kcal/kg'),
      },
    },
    {
      ageLabel: '>19 yr (Adult)',
      nutrients: {
        NaturalProtein: r(0.3, 0.8, 'g/kg'),
        EAA: r(0.0, 0.2, 'g/kg'),
        Protein: r(0.8, 1.0, 'g/kg'),
        Energy: r(35, 65, 'kcal/kg'),
      },
    },
  ],
};

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
    id: 'SIMILAC_RTF_100ML',
    role: 'standard',
    name: 'Similac With Iron (Ready-to-Feed, 100mL)',
    basis: '100mL',
    values: {
      Energy: 68,
      Protein: 1.4,
      PHE: 59,
      TYR: 58,
      ILE: 75,
      LEU: 144,
      VAL: 83,
      MET: 35,
      CYS: 19,
    },
  },
  {
    id: 'SIMILAC_POWDER_100G',
    role: 'standard',
    name: 'Similac Powder (100g)',
    basis: '100g',
    // Amino acids per 100 g (= per-1 g reference table × 100). Verified against
    // the clinical Similac/1 g powder reference sheet.
    values: {
      Energy: 517,
      Protein: 13.7,
      LEU: 1032,
      ILE: 536,
      VAL: 582,
      MET: 271,
      PHE: 675,
      TYR: 450,
      THR: 493,
      LYS: 754,
      TRP: 151,
    },
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
    values: { Energy: 466, Protein: 13.1, Carbohydrate: 50.1, Fat: 23, ILE: 420, MET: 0, THR: 0, VAL: 0 },
    diseases: [DiseaseType.MMA_PA],
  },
  {
    id: 'MMA_PA_ANAMIX_JUNIOR_100G',
    role: 'special',
    ageGroup: 'CHILD',
    name: 'MMA/PA Anamix Junior (>1 year, 100g)',
    basis: '100g',
    values: { Energy: 367, Protein: 28, Carbohydrate: 30, Fat: 12.5, ILE: 25, MET: 0, THR: 0, VAL: 0 },
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
  [DiseaseType.PKU]: { standard: 'SIMILAC_POWDER_100G', special: 'PKU_NUTRI_1_ENERGY_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.TYR_I_IA_IB]: { standard: 'SIMILAC_POWDER_100G', special: 'TYR_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.TYR_II_III]: { standard: 'SIMILAC_POWDER_100G', special: 'TYR_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.MSUD]: { standard: 'SIMILAC_POWDER_100G', special: 'MSUD_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.LEU_CATABOLISM]: { standard: 'SIMILAC_POWDER_100G', special: 'IVA_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.BETA_KETOTHIOLASE]: { standard: 'SIMILAC_POWDER_100G', special: 'KETONEX1_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.HOMOCYSTINURIA]: { standard: 'SIMILAC_POWDER_100G', special: 'HOMINEX1_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.GA_TYPE_I]: { standard: 'SIMILAC_POWDER_100G', special: 'GA1_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.GA_TYPE_II]: { standard: 'SIMILAC_POWDER_100G', special: 'SPECIAL_PRO_PHREE_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.LPI]: { standard: 'SIMILAC_POWDER_100G', special: 'SPECIAL_PRO_PHREE_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.MMA_PA]: { standard: 'SIMILAC_POWDER_100G', special: 'MMA_PA_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.GALACTOSEMIA]: { standard: 'STANDARD_UNIFIED_CASE_100G', special: 'SPECIAL_PRO_PHREE_100G', modular: 'CAL_POWDER_100G' },
  [DiseaseType.UCD]: { standard: 'SIMILAC_POWDER_100G', special: 'UCD_ANAMIX_INFANT_100G', modular: 'CAL_POWDER_100G' },
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
    standard: ['SIMILAC_POWDER_100G', 'STANDARD_UNIFIED_CASE_100G'],
    special: ['PKU_NUTRI_1_ENERGY_100G', 'PKU_NUTRI_2_ENERGY_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.TYR_I_IA_IB]: {
    standard: ['SIMILAC_POWDER_100G', 'STANDARD_UNIFIED_CASE_100G'],
    special: ['TYR_ANAMIX_INFANT_100G', 'TYREX1_100G', 'TYREX2_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.MSUD]: {
    standard: ['SIMILAC_POWDER_100G', 'STANDARD_UNIFIED_CASE_100G'],
    special: ['MSUD_ANAMIX_INFANT_100G', 'MSUD_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.LEU_CATABOLISM]: {
    standard: ['SIMILAC_POWDER_100G', 'STANDARD_UNIFIED_CASE_100G'],
    special: ['IVA_ANAMIX_INFANT_100G', 'IVA_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.GA_TYPE_I]: {
    standard: ['SIMILAC_POWDER_100G', 'STANDARD_UNIFIED_CASE_100G'],
    special: ['GA1_ANAMIX_INFANT_100G', 'GA1_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.MMA_PA]: {
    standard: ['SIMILAC_POWDER_100G', 'STANDARD_UNIFIED_CASE_100G'],
    special: ['MMA_PA_ANAMIX_INFANT_100G', 'MMA_PA_ANAMIX_JUNIOR_100G'],
    modular: ['CAL_POWDER_100G', 'SS_DUOCAL_100G', 'FANTOMALT_100G', 'CARBOCH_100G'],
  },
  [DiseaseType.UCD]: {
    standard: ['SIMILAC_POWDER_100G', 'STANDARD_UNIFIED_CASE_100G'],
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
