import {
  CalculationInputs,
  CalculationOutputs,
  FormulaContribution,
  FormulaReference,
  NutrientRange,
  NutrientUnit,
  TargetMode,
} from './types';
import {
  DISEASE_ANALYSIS_CONTEXT,
  DISEASE_ANALYSIS_NUTRIENTS,
  DISEASE_METADATA,
  GUIDELINES,
} from './constants';

type DailyUnit = 'mg/day' | 'g/day' | 'kcal/day' | 'mL/day' | '%energy';

function toDailyUnit(unit: NutrientUnit): DailyUnit {
  if (unit === 'mg/kg' || unit === 'mg/day') return 'mg/day';
  if (unit === 'g/kg' || unit === 'g/day') return 'g/day';
  if (unit === 'kcal/kg' || unit === 'kcal/day') return 'kcal/day';
  if (unit === 'mL/kg' || unit === 'mL/day') return 'mL/day';
  return '%energy';
}

function toDailyValue(value: number, unit: NutrientUnit, weightKg: number): number {
  if (unit.endsWith('/kg')) return value * weightKg;
  return value;
}

function pickTarget(range: NutrientRange, mode: TargetMode): number {
  if (range.minOnly) return range.min;
  if (mode === 'MIN') return range.min;
  if (mode === 'MAX') return range.max;
  if (typeof range.mid === 'number') return range.mid;
  return (range.min + range.max) / 2;
}

function resolveCompositeValue(key: string, values: Record<string, number | undefined>): number | undefined {
  const direct = values[key];
  if (typeof direct === 'number') return direct;

  if (!key.includes('+')) return undefined;

  const parts = key
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean);

  let total = 0;

  for (const part of parts) {
    const value = values[part];
    if (typeof value !== 'number') return undefined;
    total += value;
  }

  return total;
}

function resolveUnitForComposite(key: string, unitMap: Record<string, string>): string {
  const direct = unitMap[key];
  if (direct) return direct;

  if (!key.includes('+')) return 'day';

  const firstPart = key
    .split('+')
    .map((part) => part.trim())
    .find(Boolean);

  if (!firstPart) return 'day';
  return unitMap[firstPart] || 'day';
}

function formulaNutrient(formula: FormulaReference, nutrient: string): number | undefined {
  return resolveCompositeValue(nutrient, formula.values);
}

function makeContribution(params: {
  role: FormulaContribution['role'];
  formula: FormulaReference;
  amount: number;
  feedsPerDay: number;
  scoopSizeG: number;
  waterPerScoopMl: number;
  primaryLimiter?: string;
}): FormulaContribution {
  const {
    role,
    formula,
    amount,
    feedsPerDay,
    scoopSizeG,
    waterPerScoopMl,
    primaryLimiter,
  } = params;

  const amountUnit = formula.basis === '100g' ? 'g/day' : 'mL/day';
  const kcal = ((formula.values.Energy || 0) * amount) / 100;
  const protein = ((formula.values.Protein || 0) * amount) / 100;

  const primaryLimiterPer100 =
    primaryLimiter && primaryLimiter.length > 0
      ? formulaNutrient(formula, primaryLimiter)
      : undefined;

  const primaryLimiterDelivered =
    typeof primaryLimiterPer100 === 'number' ? (primaryLimiterPer100 * amount) / 100 : undefined;

  let scoops: number | undefined;
  let waterMl: number | undefined;
  let perFeedScoops: number | undefined;
  let perFeedWaterMl: number | undefined;

  if (formula.basis === '100g' && scoopSizeG > 0) {
    scoops = amount / scoopSizeG;
    waterMl = scoops * waterPerScoopMl;
    perFeedScoops = scoops / feedsPerDay;
    perFeedWaterMl = waterMl / feedsPerDay;
  }

  return {
    role,
    formulaName: formula.name,
    basis: formula.basis,
    amount,
    amountUnit,
    kcal,
    protein,
    primaryLimiterDelivered,
    scoops,
    waterMl,
    perFeedAmount: amount / feedsPerDay,
    perFeedScoops,
    perFeedWaterMl,
  };
}

function analysisMessage(
  diseaseContext: 'AA' | 'PROTEIN',
  nutrient: string,
  status: 'LOW' | 'NORMAL' | 'HIGH' | 'NA',
): string {
  if (status === 'NA') {
    return `No analysis input entered for ${nutrient}.`;
  }

  if (diseaseContext === 'AA') {
    if (status === 'LOW') {
      return `${nutrient} is below the expected range from selected guideline. Usually no extra restriction is needed now; continue follow-up.`;
    }

    if (status === 'HIGH') {
      return `${nutrient} is above the expected range from selected guideline. Usually tighten restriction and avoid increasing intact standard load.`;
    }

    return `${nutrient} is within expected range. Keep current strategy and routine follow-up.`;
  }

  if (status === 'LOW') {
    return `${nutrient} is below expected range. Usually no need for further protein restriction now.`;
  }

  if (status === 'HIGH') {
    return `${nutrient} is above expected range. Consider reducing intact protein exposure and supporting energy by modular/non-protein calories.`;
  }

  return `${nutrient} is within expected range. Keep current strategy and routine follow-up.`;
}

export function calculateDiet(inputs: CalculationInputs): CalculationOutputs {
  const safeWeight = Math.max(0, inputs.weightKg || 0);
  const safeFeeds = Math.max(1, Math.floor(inputs.feedsPerDay || 1));
  const safeScoopSizeG = Math.max(0.1, inputs.scoopSizeG || 5);
  const safeWaterPerScoopMl = Math.max(0, inputs.waterPerScoopMl || 0);

  const diseaseGuides = GUIDELINES[inputs.disease];
  const safeAgeIndex = Math.min(Math.max(0, inputs.ageGroupIndex), diseaseGuides.length - 1);
  const ageGuide = diseaseGuides[safeAgeIndex];

  const rows = Object.entries(ageGuide.nutrients).map(([nutrient, source]) => {
    const totalMin = toDailyValue(source.min, source.unit, safeWeight);
    const totalMax = toDailyValue(source.max, source.unit, safeWeight);
    const totalTarget = toDailyValue(pickTarget(source, inputs.targetMode), source.unit, safeWeight);

    return {
      nutrient,
      source,
      totalMin,
      totalMax,
      totalTarget,
      totalUnit: toDailyUnit(source.unit),
    };
  });

  const targetByNutrient: Record<string, number> = {};
  const unitByNutrient: Record<string, string> = {};

  rows.forEach((row) => {
    targetByNutrient[row.nutrient] = row.totalTarget;
    unitByNutrient[row.nutrient] = row.totalUnit;
  });

  const primaryLimiter = DISEASE_METADATA[inputs.disease].primaryLimiter;
  const primaryLimitValue =
    primaryLimiter && primaryLimiter.length > 0
      ? resolveCompositeValue(primaryLimiter, targetByNutrient)
      : undefined;

  const primaryLimitUnit = primaryLimiter
    ? resolveUnitForComposite(primaryLimiter, unitByNutrient)
    : 'day';

  const targetEnergy = targetByNutrient.Energy;
  const targetProtein = targetByNutrient.Protein;
  const targetFluid = targetByNutrient.Fluid;

  const planNotes: string[] = [];
  const planItems: FormulaContribution[] = [];

  const standardFormula = inputs.formulas.standard;
  const specialFormula = inputs.formulas.special || null;
  const modularFormula = inputs.formulas.modular || null;

  let standardAmount = 0;

  const standardLimiterPer100 =
    primaryLimiter && primaryLimiter.length > 0
      ? formulaNutrient(standardFormula, primaryLimiter)
      : undefined;

  if (
    typeof primaryLimitValue === 'number' &&
    typeof standardLimiterPer100 === 'number' &&
    standardLimiterPer100 > 0
  ) {
    standardAmount = (primaryLimitValue * 100) / standardLimiterPer100;
  } else if (typeof targetProtein === 'number' && (standardFormula.values.Protein || 0) > 0) {
    standardAmount = (targetProtein * 100) / (standardFormula.values.Protein || 1);
    planNotes.push('Primary limiter not available in standard formula values. Standard amount set by protein target.');
  } else {
    standardAmount = 0;
    planNotes.push('Unable to calculate standard amount from limiter/protein.');
  }

  const standardItem = makeContribution({
    role: 'standard',
    formula: standardFormula,
    amount: standardAmount,
    feedsPerDay: safeFeeds,
    scoopSizeG: safeScoopSizeG,
    waterPerScoopMl: safeWaterPerScoopMl,
    primaryLimiter,
  });
  planItems.push(standardItem);

  const proteinAfterStandard = Math.max(0, (targetProtein || 0) - standardItem.protein);

  let specialAmount = 0;
  if (specialFormula) {
    if ((specialFormula.values.Protein || 0) > 0) {
      specialAmount = (proteinAfterStandard * 100) / (specialFormula.values.Protein || 1);
    } else if (proteinAfterStandard > 0) {
      planNotes.push('Special formula has zero protein, so protein deficit remains.');
    }

    const specialItem = makeContribution({
      role: 'special',
      formula: specialFormula,
      amount: specialAmount,
      feedsPerDay: safeFeeds,
      scoopSizeG: safeScoopSizeG,
      waterPerScoopMl: safeWaterPerScoopMl,
      primaryLimiter,
    });
    planItems.push(specialItem);
  } else {
    if (proteinAfterStandard > 0) {
      planNotes.push('No special formula selected while protein deficit exists.');
    }
  }

  const kcalBeforeModular = planItems.reduce((sum, item) => sum + item.kcal, 0);
  const energyDeficit = Math.max(0, (targetEnergy || 0) - kcalBeforeModular);

  let modularAmount = 0;
  if (modularFormula) {
    if ((modularFormula.values.Energy || 0) > 0) {
      modularAmount = (energyDeficit * 100) / (modularFormula.values.Energy || 1);
    } else if (energyDeficit > 0) {
      planNotes.push('Modular formula has zero calories, so energy deficit remains.');
    }

    const modularItem = makeContribution({
      role: 'modular',
      formula: modularFormula,
      amount: modularAmount,
      feedsPerDay: safeFeeds,
      scoopSizeG: safeScoopSizeG,
      waterPerScoopMl: safeWaterPerScoopMl,
      primaryLimiter,
    });
    planItems.push(modularItem);
  } else if (energyDeficit > 0) {
    planNotes.push('No modular formula selected while energy deficit exists.');
  }

  const totalKcal = planItems.reduce((sum, item) => sum + item.kcal, 0);
  const totalProtein = planItems.reduce((sum, item) => sum + item.protein, 0);

  const totalPrimaryLimiter = planItems.reduce((sum, item) => {
    if (typeof item.primaryLimiterDelivered !== 'number') return sum;
    return sum + item.primaryLimiterDelivered;
  }, 0);

  const totalPowderG = planItems.reduce(
    (sum, item) => (item.amountUnit === 'g/day' ? sum + item.amount : sum),
    0,
  );

  const totalScoops = planItems.reduce((sum, item) => sum + (item.scoops || 0), 0);
  const totalWaterMl = planItems.reduce((sum, item) => sum + (item.waterMl || 0), 0);
  const totalReadyToFeedMl = planItems.reduce(
    (sum, item) => (item.amountUnit === 'mL/day' ? sum + item.amount : sum),
    0,
  );

  const finalVolumeMl = totalReadyToFeedMl + totalWaterMl;

  const analysisContext = DISEASE_ANALYSIS_CONTEXT[inputs.disease];
  const analysisTargets = DISEASE_ANALYSIS_NUTRIENTS[inputs.disease] || [];
  const analysisValues = inputs.analysisValues || {};

  const rowsByNutrient = rows.reduce<Record<string, (typeof rows)[number]>>((acc, row) => {
    acc[row.nutrient] = row;
    return acc;
  }, {});

  const analysisItems = analysisTargets.map((nutrient) => {
    const row = rowsByNutrient[nutrient];
    const expectedMin = row?.totalMin;
    const expectedMax = row?.totalMax;
    const unit = row?.totalUnit;
    const rawInput = analysisValues[nutrient];
    const inputValue =
      typeof rawInput === 'number' && Number.isFinite(rawInput) ? rawInput : undefined;

    let status: 'LOW' | 'NORMAL' | 'HIGH' | 'NA' = 'NA';

    if (
      typeof inputValue === 'number' &&
      typeof expectedMin === 'number' &&
      typeof expectedMax === 'number'
    ) {
      if (inputValue < expectedMin) {
        status = 'LOW';
      } else if (inputValue > expectedMax) {
        status = 'HIGH';
      } else {
        status = 'NORMAL';
      }
    } else if (typeof inputValue === 'number') {
      status = 'NA';
    }

    return {
      nutrient,
      expectedMin,
      expectedMax,
      unit,
      inputValue,
      status,
      message: analysisMessage(analysisContext, nutrient, status),
    };
  });

  const overallStatus: 'LOW' | 'NORMAL' | 'HIGH' | 'NA' =
    analysisItems.length === 0 || analysisItems.every((item) => item.status === 'NA')
      ? 'NA'
      : analysisItems.some((item) => item.status === 'HIGH')
        ? 'HIGH'
        : analysisItems.some((item) => item.status === 'LOW')
          ? 'LOW'
          : 'NORMAL';

  const analysis = {
    overallStatus,
    items: analysisItems,
  };

  return {
    rows,
    highlights: {
      targetEnergy: typeof targetEnergy === 'number' ? targetEnergy : undefined,
      targetProtein: typeof targetProtein === 'number' ? targetProtein : undefined,
      targetFluid: typeof targetFluid === 'number' ? targetFluid : undefined,
      primaryLimit:
        primaryLimiter && typeof primaryLimitValue === 'number'
          ? {
              nutrient: primaryLimiter,
              value: primaryLimitValue,
              unit: primaryLimitUnit,
            }
          : undefined,
    },
    formulaPlan: {
      primaryLimiter,
      notes: planNotes,
      items: planItems,
      totals: {
        kcal: totalKcal,
        protein: totalProtein,
        primaryLimiter:
          primaryLimiter && Number.isFinite(totalPrimaryLimiter) ? totalPrimaryLimiter : undefined,
        powderG: totalPowderG,
        scoops: totalScoops,
        waterMl: totalWaterMl,
        readyToFeedMl: totalReadyToFeedMl,
        finalVolumeMl,
        scoopsPerFeed: totalScoops / safeFeeds,
        volumePerFeedMl: finalVolumeMl / safeFeeds,
      },
      deficits: {
        protein: Math.max(0, (targetProtein || 0) - totalProtein),
        energy: Math.max(0, (targetEnergy || 0) - totalKcal),
      },
    },
    analysis,
  };
}
