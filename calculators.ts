import {
  CalculationInputs,
  CalculationOutputs,
  FormulaContribution,
  FormulaReference,
  NutrientBalance,
  NutrientRange,
  NutrientUnit,
  TargetMode,
} from './types';
import { DISEASE_METADATA, GUIDELINES } from './constants';

type DailyUnit = 'mg/day' | 'g/day' | 'kcal/day' | 'mL/day' | '%energy';
type CompletionNutrient = 'Protein' | 'Energy' | 'Carbohydrate' | 'Fat';
const EPSILON = 1e-6;
const NON_AMINO_NUTRIENTS = new Set([
  'Energy',
  'Protein',
  'Fluid',
  'Fat',
  'Carbohydrate',
  'LinoleicAcid',
  'LinolenicAcid',
]);

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

function isAminoAcidNutrient(nutrient: string): boolean {
  if (NON_AMINO_NUTRIENTS.has(nutrient)) return false;

  if (!nutrient.includes('+')) return true;

  return nutrient
    .split('+')
    .map((part) => part.trim())
    .every((part) => part.length > 0 && !NON_AMINO_NUTRIENTS.has(part));
}

function deliveredForCompletionNutrient(
  nutrient: CompletionNutrient,
  planItems: FormulaContribution[],
  formulaByRole: Partial<Record<FormulaContribution['role'], FormulaReference>>,
): number {
  if (nutrient === 'Energy') {
    return planItems.reduce((sum, item) => sum + item.kcal, 0);
  }

  if (nutrient === 'Protein') {
    return planItems.reduce((sum, item) => sum + item.protein, 0);
  }

  return planItems.reduce((sum, item) => {
    const formula = formulaByRole[item.role];
    if (!formula) return sum;

    const nutrientPer100 = formulaNutrient(formula, nutrient);
    if (typeof nutrientPer100 !== 'number') return sum;
    return sum + (nutrientPer100 * item.amount) / 100;
  }, 0);
}

function requiredAmountForFormulaCompletion(params: {
  formula: FormulaReference;
  formulaLabel: string;
  completionTargets: Array<{ nutrient: CompletionNutrient; target?: number; label: string }>;
  planItems: FormulaContribution[];
  formulaByRole: Partial<Record<FormulaContribution['role'], FormulaReference>>;
  planNotes: string[];
}): number {
  const {
    formula,
    formulaLabel,
    completionTargets,
    planItems,
    formulaByRole,
    planNotes,
  } = params;

  let requiredAmount = 0;

  completionTargets.forEach(({ nutrient, target, label }) => {
    if (typeof target !== 'number') return;

    const delivered = deliveredForCompletionNutrient(nutrient, planItems, formulaByRole);
    const deficit = Math.max(0, target - delivered);
    if (deficit <= EPSILON) return;

    const nutrientPer100 = formulaNutrient(formula, nutrient);
    if (typeof nutrientPer100 === 'number' && nutrientPer100 > EPSILON) {
      const needed = (deficit * 100) / nutrientPer100;
      if (needed > requiredAmount) requiredAmount = needed;
      return;
    }

    planNotes.push(`${formulaLabel} has zero ${label}, so ${label} deficit remains.`);
  });

  return requiredAmount;
}

function hasRemainingCompletionDeficit(params: {
  completionTargets: Array<{ nutrient: CompletionNutrient; target?: number }>;
  planItems: FormulaContribution[];
  formulaByRole: Partial<Record<FormulaContribution['role'], FormulaReference>>;
}): boolean {
  const { completionTargets, planItems, formulaByRole } = params;

  return completionTargets.some(({ nutrient, target }) => {
    if (typeof target !== 'number') return false;
    const delivered = deliveredForCompletionNutrient(nutrient, planItems, formulaByRole);
    return target - delivered > EPSILON;
  });
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
  const targetCarbohydrate = targetByNutrient.Carbohydrate;
  const targetFat = targetByNutrient.Fat;

  const planNotes: string[] = [];
  const planItems: FormulaContribution[] = [];

  const standardFormula = inputs.formulas.standard;
  const specialFormula = inputs.formulas.special || null;
  const modularFormula = inputs.formulas.modular || null;
  const formulaByRole: Partial<Record<FormulaContribution['role'], FormulaReference>> = {
    standard: standardFormula,
    special: specialFormula || undefined,
    modular: modularFormula || undefined,
  };

  const completionTargets: Array<{
    nutrient: CompletionNutrient;
    target?: number;
    label: string;
  }> = [
    { nutrient: 'Protein', target: targetProtein, label: 'protein' },
    { nutrient: 'Energy', target: targetEnergy, label: 'calories' },
    { nutrient: 'Carbohydrate', target: targetCarbohydrate, label: 'carbohydrate' },
    { nutrient: 'Fat', target: targetFat, label: 'fat' },
  ];

  let standardAmount = 0;
  let limitingNutrientForStandard: string | null = null;
  let maxStandardFromElements = Number.POSITIVE_INFINITY;

  rows.forEach((row) => {
    if (!isAminoAcidNutrient(row.nutrient) || row.source.minOnly) return;

    const standardElementPer100 = formulaNutrient(standardFormula, row.nutrient);
    if (typeof standardElementPer100 !== 'number' || standardElementPer100 <= EPSILON) return;

    const maxAmountForThisElement = (row.totalMax * 100) / standardElementPer100;
    if (maxAmountForThisElement < maxStandardFromElements) {
      maxStandardFromElements = maxAmountForThisElement;
      limitingNutrientForStandard = row.nutrient;
    }
  });

  if (Number.isFinite(maxStandardFromElements)) {
    standardAmount = Math.max(0, maxStandardFromElements);
  } else {
    const standardProteinPer100 = standardFormula.values.Protein || 0;
    if ((targetProtein || 0) > 0 && standardProteinPer100 > 0) {
      standardAmount = ((targetProtein || 0) * 100) / standardProteinPer100;
      planNotes.push('No elemental upper limit found, so standard amount is set by protein target.');
    } else if ((targetProtein || 0) > 0) {
      planNotes.push('Standard formula has zero protein, so protein deficit remains.');
    }
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

  if (limitingNutrientForStandard) {
    if (specialFormula) {
      planNotes.push(
        `${limitingNutrientForStandard} reached its highest allowed level from standard formula. Special formula will complete remaining needs.`,
      );
    } else {
      planNotes.push(
        `${limitingNutrientForStandard} reached its highest allowed level from standard formula, but no special formula is selected.`,
      );
    }
  }

  let specialAmount = 0;
  if (specialFormula) {
    specialAmount = requiredAmountForFormulaCompletion({
      formula: specialFormula,
      formulaLabel: 'Special formula',
      completionTargets,
      planItems,
      formulaByRole,
      planNotes,
    });

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
  } else if (
    hasRemainingCompletionDeficit({
      completionTargets,
      planItems,
      formulaByRole,
    })
  ) {
    planNotes.push('No special formula selected. Remaining deficits will be handled by modular.');
  }

  let modularAmount = 0;
  if (modularFormula) {
    modularAmount = requiredAmountForFormulaCompletion({
      formula: modularFormula,
      formulaLabel: 'Modular formula',
      completionTargets,
      planItems,
      formulaByRole,
      planNotes,
    });

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
  } else if (
    hasRemainingCompletionDeficit({
      completionTargets,
      planItems,
      formulaByRole,
    })
  ) {
    planNotes.push('No modular formula selected while deficits exist.');
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

  const nutrientBalances: NutrientBalance[] = rows.map((row) => {
    const delivered =
      row.nutrient === 'Energy'
        ? totalKcal
        : row.nutrient === 'Protein'
          ? totalProtein
          : row.nutrient === 'Fluid'
            ? finalVolumeMl
            : planItems.reduce((sum, item) => {
                const formula = formulaByRole[item.role];
                if (!formula) return sum;

                const nutrientPer100 = formulaNutrient(formula, row.nutrient);
                if (typeof nutrientPer100 !== 'number') return sum;
                return sum + (nutrientPer100 * item.amount) / 100;
              }, 0);

    const deficitToTarget = Math.max(0, row.totalTarget - delivered);
    const excessToTarget = Math.max(0, delivered - row.totalTarget);

    let status: NutrientBalance['status'] = 'NORMAL';
    if (row.source.minOnly) {
      status = delivered < row.totalMin - EPSILON ? 'LOW' : 'NORMAL';
    } else if (delivered < row.totalMin - EPSILON) {
      status = 'LOW';
    } else if (delivered > row.totalMax + EPSILON) {
      status = 'HIGH';
    }

    return {
      nutrient: row.nutrient,
      unit: row.totalUnit,
      min: row.totalMin,
      max: row.totalMax,
      target: row.totalTarget,
      delivered,
      deficitToTarget,
      excessToTarget,
      status,
    };
  });

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
      nutrientBalances,
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
  };
}
