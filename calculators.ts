import { DiseaseType, CalculationInputs, CalculationOutputs, TargetMode } from './types';
import {
  GUIDELINES,
  DEFAULT_FORMULAS,
  DISEASE_METADATA,
  FORMULA_KEY_BY_DISEASE,
  STANDARD_FORMULA_GUIDELINES,
} from './constants';

const SCOOP_SIZE_G = 5;
const WATER_PER_SCOOP_ML = 30;

function getTarget(range: { min: number; max: number }, mode: TargetMode): number {
  if (mode === 'MIN') return range.min;
  if (mode === 'MAX') return range.max;
  return (range.min + range.max) / 2;
}

export function calculateDiet(inputs: CalculationInputs): CalculationOutputs {
  const safeWeight = Math.max(0, inputs.weightKg || 0);
  const safeFeeds = Math.max(1, Math.floor(inputs.feedsPerDay || 1));
  const { disease, targetMode } = inputs;

  const diseaseGuides = GUIDELINES[disease];
  const safeAgeIndex = Math.min(Math.max(0, inputs.ageGroupIndex), diseaseGuides.length - 1);
  const ageGuide = diseaseGuides[safeAgeIndex];

  const targetKcal = safeWeight * getTarget(ageGuide.kcalPerKg, targetMode);
  const targetPro = safeWeight * getTarget(ageGuide.proPerKg, targetMode);
  const targetFluid = safeWeight * 150;

  const targetLimits: Record<string, number> = {};

  if (ageGuide.limits) {
    Object.entries(ageGuide.limits).forEach(([aa, range]) => {
      targetLimits[aa] = safeWeight * getTarget(range, targetMode);
    });
  }

  if (ageGuide.dailyLimits) {
    Object.entries(ageGuide.dailyLimits).forEach(([aa, range]) => {
      targetLimits[aa] = getTarget(range, targetMode);
    });
  }

  const formulaKeys = FORMULA_KEY_BY_DISEASE[disease];
  const std = STANDARD_FORMULA_GUIDELINES[disease];
  const spec = DEFAULT_FORMULAS[formulaKeys.special];
  const mod = DEFAULT_FORMULAS.MODULAR;

  let standardG = 0;
  const primaryLimiter = DISEASE_METADATA[disease].primaryLimiter;

  if (disease === DiseaseType.UCD && ageGuide.ucdPro) {
    const intactTarget = safeWeight * getTarget(ageGuide.ucdPro.intact, targetMode);
    standardG = (intactTarget * 100) / std.protein;
    targetLimits[primaryLimiter] = intactTarget;
  } else if (targetLimits[primaryLimiter]) {
    standardG = (targetLimits[primaryLimiter] * 100) / std.limiter;
  }

  const proteinFromStandard = (standardG * std.protein) / 100;
  const kcalFromStandard = (standardG * std.kcal) / 100;

  let specialG = 0;
  let proteinDeficitAfterStandard = Math.max(0, targetPro - proteinFromStandard);

  if (disease === DiseaseType.UCD && ageGuide.ucdPro) {
    const medicalTarget = safeWeight * getTarget(ageGuide.ucdPro.medical, targetMode);
    specialG = (medicalTarget * 100) / spec.protein;
    proteinDeficitAfterStandard = medicalTarget;
  } else {
    specialG = (proteinDeficitAfterStandard * 100) / spec.protein;
  }

  const proteinFromSpecial = (specialG * spec.protein) / 100;
  const kcalFromSpecial = (specialG * spec.kcal) / 100;

  const kcalBeforeModular = kcalFromStandard + kcalFromSpecial;
  const kcalDeficit = Math.max(0, targetKcal - kcalBeforeModular);
  const modularG = (kcalDeficit * 100) / mod.kcal;
  const modularNeeded = kcalDeficit > 0.01;

  const totalG = standardG + specialG + modularG;
  const totalScoops = totalG / SCOOP_SIZE_G;
  const totalVolume = totalScoops * WATER_PER_SCOOP_ML;

  const primaryActualLimit = std.limiter > 0
    ? (standardG * std.limiter) / 100
    : proteinFromStandard;

  const modularKcal = (modularG * mod.kcal) / 100;

  return {
    targets: {
      kcal: targetKcal,
      protein: targetPro,
      fluids: targetFluid,
      limits: targetLimits,
    },
    recipe: {
      standardG,
      specialG,
      modularG,
      totalG,
      totalScoops,
      totalVolume,
      scoopsPerFeed: totalScoops / safeFeeds,
      volumePerFeed: totalVolume / safeFeeds,
      standardScoops: standardG / SCOOP_SIZE_G,
      specialScoops: specialG / SCOOP_SIZE_G,
      modularScoops: modularG / SCOOP_SIZE_G,
    },
    analysis: {
      kcalFromStandard,
      kcalFromSpecial,
      kcalBeforeModular,
      kcalDeficit,
      modularNeeded,
      proteinFromStandard,
      proteinFromSpecial,
      proteinDeficitAfterStandard,
    },
    actuals: {
      kcal: kcalBeforeModular + modularKcal,
      protein: proteinFromStandard + proteinFromSpecial,
      limits: {
        [primaryLimiter]: primaryActualLimit,
      },
    },
  };
}
