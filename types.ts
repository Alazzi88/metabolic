export enum DiseaseType {
  PKU = 'PKU',
  MMA_PA = 'MMA_PA',
  MSUD = 'MSUD',
  GA = 'GA',
  UCD = 'UCD'
}

export type TargetMode = 'MIN' | 'MID' | 'MAX';

export interface AgeGuideline {
  ageLabel: string;
  kcalPerKg: { min: number; max: number };
  proPerKg: { min: number; max: number };
  // دعم الحدود المتعددة (mg/kg) مثل MET, ILE, LYS...
  limits?: Record<string, { min: number; max: number }>;
  // دعم الحدود اليومية الثابتة (mg/day)
  dailyLimits?: Record<string, { min: number; max: number }>;
  // توزيع بروتين UCD
  ucdPro?: {
    medical: { min: number; max: number };
    intact: { min: number; max: number };
  };
}

export interface FormulaStats {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  limiter: number; // القيمة المحددة الأساسية لكل 100 جرام
  tyr?: number; // mg per 100g
}

export interface CalculationInputs {
  weightKg: number;
  disease: DiseaseType;
  ageGroupIndex: number;
  targetMode: TargetMode;
  feedsPerDay: number;
}

export interface CalculationOutputs {
  targets: {
    kcal: number;
    protein: number;
    fluids: number;
    limits: Record<string, number>;
  };
  recipe: {
    standardG: number;
    specialG: number;
    modularG: number;
    totalG: number;
    totalScoops: number;
    totalVolume: number;
    scoopsPerFeed: number;
    volumePerFeed: number;
    standardScoops: number;
    specialScoops: number;
    modularScoops: number;
  };
  analysis: {
    kcalFromStandard: number;
    kcalFromSpecial: number;
    kcalBeforeModular: number;
    kcalDeficit: number;
    modularNeeded: boolean;
    proteinFromStandard: number;
    proteinFromSpecial: number;
    proteinDeficitAfterStandard: number;
  };
  actuals: {
    kcal: number;
    protein: number;
    limits: Record<string, number>;
  };
}
