export enum DiseaseType {
  PKU = 'PKU',
  TYR_I_IA_IB = 'TYR_I_IA_IB',
  TYR_II_III = 'TYR_II_III',
  MSUD = 'MSUD',
  LEU_CATABOLISM = 'LEU_CATABOLISM',
  BETA_KETOTHIOLASE = 'BETA_KETOTHIOLASE',
  HOMOCYSTINURIA = 'HOMOCYSTINURIA',
  GA_TYPE_I = 'GA_TYPE_I',
  GA_TYPE_II = 'GA_TYPE_II',
  LPI = 'LPI',
  MMA_PA = 'MMA_PA',
  GALACTOSEMIA = 'GALACTOSEMIA',
  UCD = 'UCD',
}

export type TargetMode = 'MIN' | 'MID' | 'MAX';
export type FormulaRole = 'standard' | 'special' | 'modular';

export type NutrientUnit =
  | 'mg/kg'
  | 'mg/day'
  | 'g/kg'
  | 'g/day'
  | 'kcal/kg'
  | 'kcal/day'
  | 'mL/kg'
  | 'mL/day'
  | '%energy';

export interface NutrientRange {
  min: number;
  max: number;
  unit: NutrientUnit;
  mid?: number;
  minOnly?: boolean;
}

export interface AgeGuideline {
  ageLabel: string;
  nutrients: Record<string, NutrientRange>;
}

export interface DiseaseMeta {
  en: { name: string; short: string };
  ar: { name: string; short: string };
  primaryLimiter?: string;
}

export interface FormulaReference {
  name: string;
  basis: '100mL' | '100g';
  values: Record<string, number>;
}

export interface FormulaOption extends FormulaReference {
  id: string;
  role: FormulaRole;
  diseases?: DiseaseType[];
  note?: string;
}

export interface FormulaSelection {
  standard: FormulaReference;
  special?: FormulaReference | null;
  modular?: FormulaReference | null;
}

export interface CalculationInputs {
  weightKg: number;
  disease: DiseaseType;
  ageGroupIndex: number;
  targetMode: TargetMode;
  feedsPerDay: number;
  analysisValues?: Record<string, number | undefined>;
  scoopSizeG: number;
  waterPerScoopMl: number;
  formulas: FormulaSelection;
}

export interface CalculatedRequirement {
  nutrient: string;
  source: NutrientRange;
  totalMin: number;
  totalMax: number;
  totalTarget: number;
  totalUnit: 'mg/day' | 'g/day' | 'kcal/day' | 'mL/day' | '%energy';
}

export interface FormulaContribution {
  role: FormulaRole;
  formulaName: string;
  basis: '100mL' | '100g';
  amount: number;
  amountUnit: 'mL/day' | 'g/day';
  kcal: number;
  protein: number;
  primaryLimiterDelivered?: number;
  scoops?: number;
  waterMl?: number;
  perFeedAmount?: number;
  perFeedScoops?: number;
  perFeedWaterMl?: number;
}

export interface FormulaPlan {
  primaryLimiter?: string;
  notes: string[];
  items: FormulaContribution[];
  totals: {
    kcal: number;
    protein: number;
    primaryLimiter?: number;
    powderG: number;
    scoops: number;
    waterMl: number;
    readyToFeedMl: number;
    finalVolumeMl: number;
    scoopsPerFeed: number;
    volumePerFeedMl: number;
  };
  deficits: {
    protein: number;
    energy: number;
  };
}

export interface AnalysisRecommendation {
  overallStatus: 'LOW' | 'NORMAL' | 'HIGH' | 'NA';
  items: Array<{
    nutrient: string;
    expectedMin?: number;
    expectedMax?: number;
    unit?: string;
    inputValue?: number;
    status: 'LOW' | 'NORMAL' | 'HIGH' | 'NA';
    message: string;
  }>;
}

export interface CalculationOutputs {
  rows: CalculatedRequirement[];
  highlights: {
    targetEnergy?: number;
    targetProtein?: number;
    targetFluid?: number;
    primaryLimit?: { nutrient: string; value: number; unit: string };
  };
  formulaPlan: FormulaPlan;
  analysis: AnalysisRecommendation;
}
