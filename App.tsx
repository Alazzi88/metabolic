import React, { useEffect, useMemo, useState } from 'react';
import {
  CalculationInputs,
  DiseaseType,
  FormulaAgeGroup,
  FormulaContribution,
  FormulaReference,
  FormulaRole,
  NutrientRange,
  TargetMode,
} from './types';
import {
  DEFAULT_FORMULA_SELECTION,
  DISEASE_ANALYSIS_NUTRIENTS,
  DISEASE_METADATA,
  FORMULA_LIBRARY_BY_DISEASE,
  FORMULA_OPTION_BY_ID,
  FORMULA_OPTIONS,
  GUIDELINES,
  SUPPORTED_DISEASES,
  UI_STRINGS,
} from './constants';
import { calculateDiet } from './calculators';

const TARGET_MODES: TargetMode[] = ['MIN', 'MID', 'MAX'];
const FOCUSED_STANDARD_NUTRIENTS = ['PHE', 'TYR', 'LEU', 'ILE', 'VAL', 'MET', 'THR', 'LYS', 'TRP'];
const CUSTOM_NUTRIENT_PRIORITY = ['PHE', 'TYR', 'LEU', 'ILE', 'VAL', 'MET', 'CYS', 'THR', 'LYS', 'TRP'];
const NON_DISEASE_CUSTOM_NUTRIENTS = new Set([
  'Energy',
  'Protein',
  'Fluid',
  'Carbohydrate',
  'Fat',
  'LinoleicAcid',
  'LinolenicAcid',
]);

const NUTRIENT_LABELS: Record<string, string> = {
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
};

type FormulaSelectorState = {
  standard: string;
  special: string;
  modular: string;
};

type CustomFormulaState = {
  name: string;
  basis: '100g' | '100mL';
  kcal: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  nutrients: Record<string, number>;
};

function initialSelectorForDisease(disease: DiseaseType): FormulaSelectorState {
  const defaults = DEFAULT_FORMULA_SELECTION[disease];
  return {
    standard: defaults.standard,
    special: defaults.special || 'NONE',
    modular: defaults.modular || 'NONE',
  };
}

function defaultCustomFormula(role: FormulaRole): CustomFormulaState {
  return {
    name:
      role === 'standard'
        ? 'Custom Standard'
        : role === 'special'
          ? 'Custom Special'
          : 'Custom Modular',
    basis: '100g',
    kcal: Number.NaN,
    protein: Number.NaN,
    carbohydrate: Number.NaN,
    fat: Number.NaN,
    nutrients: {},
  };
}

function diseaseSpecificNutrients(disease: DiseaseType): string[] {
  const nutrientSet = new Set<string>();
  const diseaseGuides = GUIDELINES[disease];
  const analysisNutrients = DISEASE_ANALYSIS_NUTRIENTS[disease] || [];

  const collect = (nutrient: string) => {
    nutrient
      .split('+')
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        if (!NON_DISEASE_CUSTOM_NUTRIENTS.has(part)) {
          nutrientSet.add(part);
        }
      });
  };

  diseaseGuides.forEach((guide) => {
    Object.keys(guide.nutrients).forEach(collect);
  });
  analysisNutrients.forEach(collect);

  return Array.from(nutrientSet).sort((a, b) => {
    const indexA = CUSTOM_NUTRIENT_PRIORITY.indexOf(a);
    const indexB = CUSTOM_NUTRIENT_PRIORITY.indexOf(b);
    if (indexA >= 0 && indexB >= 0) return indexA - indexB;
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;
    return a.localeCompare(b);
  });
}

function decimalsForUnit(unit: string): number {
  if (unit.startsWith('g')) return 2;
  if (unit === '%energy') return 1;
  return 0;
}

function formatNumber(value: number, unit: string): string {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(decimalsForUnit(unit));
}

function parseFloatOrNaN(raw: string): number {
  const value = raw.trim();
  if (value === '') return Number.NaN;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseIntOrNaN(raw: string): number {
  const value = raw.trim();
  if (value === '') return Number.NaN;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function numberInputValue(value: number): number | '' {
  return Number.isFinite(value) ? value : '';
}

function formatSourceRange(source: NutrientRange): string {
  const min = formatNumber(source.min, source.unit);
  const max = formatNumber(source.max, source.unit);

  if (source.minOnly) return `>= ${min} ${source.unit}`;
  if (source.min === source.max) return `${min} ${source.unit}`;
  if (typeof source.mid === 'number') {
    return `${formatNumber(source.mid, source.unit)} (${min}-${max}) ${source.unit}`;
  }

  return `${min}-${max} ${source.unit}`;
}

function formatDailyRange(
  source: NutrientRange,
  totalMin: number,
  totalMax: number,
  totalUnit: string,
): string {
  const min = formatNumber(totalMin, totalUnit);
  const max = formatNumber(totalMax, totalUnit);

  if (source.minOnly) return `>= ${min} ${totalUnit}`;
  if (totalMin === totalMax) return `${min} ${totalUnit}`;
  return `${min}-${max} ${totalUnit}`;
}

function nutrientLabel(key: string): string {
  return NUTRIENT_LABELS[key] || key;
}

function formulaValueUnit(key: string): string {
  if (key === 'Energy') return 'kcal';
  if (key === 'Protein' || key === 'Fat' || key === 'Carbohydrate') return 'g';
  return 'mg';
}

function formulaValueDailyUnit(key: string): 'g/day' | 'mg/day' | 'kcal/day' {
  const unit = formulaValueUnit(key);
  if (unit === 'kcal') return 'kcal/day';
  if (unit === 'g') return 'g/day';
  return 'mg/day';
}

function roleLabel(role: FormulaRole, t: typeof UI_STRINGS.en): string {
  if (role === 'standard') return t.standardFormula;
  if (role === 'special') return t.specialFormula;
  return t.modularFormula;
}

function orderAmountUnit(amountUnit: FormulaContribution['amountUnit']): 'g' | 'mL' {
  return amountUnit === 'g/day' ? 'g' : 'mL';
}

function roundedScoopCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const base = Math.floor(value);
  return value - base < 0.5 ? base : base + 1;
}

function formatRoundedScoopCount(value: number): string {
  const rounded = roundedScoopCount(value);
  const isRounded = Math.abs(value - rounded) > 1e-6;
  const scoopWord = rounded === 1 ? 'scoop' : 'scoops';
  return `${isRounded ? '=~ ' : ''}${rounded} ${scoopWord}`;
}

function safeFeedCountForOrder(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.max(1, Math.floor(value));
}

function formatHourInterval(feedsPerDayValue: number): string {
  const interval = 24 / safeFeedCountForOrder(feedsPerDayValue);
  if (Number.isInteger(interval)) return `${interval}`;
  return interval.toFixed(1);
}

function cleanOrderFormulaName(name: string): string {
  return name
    .replace(/\s*\(Unified Case,\s*100g\)/gi, '')
    .replace(/\s*\(0-12 months,\s*100g\)/gi, '')
    .replace(/\s*\(0-1 year,\s*100g\)/gi, '')
    .replace(/\s*\(100g dry powder\)/gi, '')
    .replace(/\s*\(Standard Formula\)/gi, '')
    .replace(/\s*\(Special Formula\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatOrderMixPart(
  item: FormulaContribution,
): string {
  const amountText = `${formatNumber(item.amount, item.amountUnit)} ${orderAmountUnit(item.amountUnit)}`;
  const scoopText =
    typeof item.scoops === 'number'
      ? ` (${formatRoundedScoopCount(item.scoops)})`
      : '';
  const cleanedFormulaName = cleanOrderFormulaName(item.formulaName);

  return `${amountText}${scoopText} from ${cleanedFormulaName}`;
}

function statusLabel(
  status: 'LOW' | 'NORMAL' | 'HIGH' | 'NA',
  t: typeof UI_STRINGS.en,
): string {
  if (status === 'LOW') return t.statusLow;
  if (status === 'HIGH') return t.statusHigh;
  if (status === 'NORMAL') return t.statusNormal;
  return t.statusNA;
}

function statusToneClass(status: 'LOW' | 'NORMAL' | 'HIGH' | 'NA'): string {
  if (status === 'LOW') return 'text-amber-700';
  if (status === 'HIGH') return 'text-rose-700';
  if (status === 'NORMAL') return 'text-emerald-700';
  return 'text-slate-500';
}

function formulaAgeGroupFromAgeLabel(ageLabel: string): FormulaAgeGroup {
  const normalized = ageLabel.toLowerCase();
  if (
    normalized.includes('0 - 1 year') ||
    normalized.includes('0 – 1 year') ||
    normalized.includes('0-1 year') ||
    normalized.includes('infant') ||
    normalized.includes('<1 yr') ||
    normalized.includes(' mo') ||
    normalized.includes('month')
  ) {
    return 'INFANT';
  }
  return 'CHILD';
}

function orderedFormulaEntries(values: Record<string, number>): Array<[string, number]> {
  const priorityOrder = ['Energy', 'Protein', 'Carbohydrate', 'Fat'];
  return Object.entries(values).sort(([a], [b]) => {
    const indexA = priorityOrder.indexOf(a);
    const indexB = priorityOrder.indexOf(b);
    if (indexA >= 0 && indexB >= 0) return indexA - indexB;
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;
    return a.localeCompare(b);
  });
}

function roleOptions(role: FormulaRole, disease: DiseaseType, ageGroup: FormulaAgeGroup) {
  const allowedIds = FORMULA_LIBRARY_BY_DISEASE[disease]?.[role] || [];
  const filtered = FORMULA_OPTIONS.filter((option) => {
    if (option.role !== role) return false;
    if (allowedIds.length > 0) {
      return allowedIds.includes(option.id);
    }
    if (!option.diseases) return true;
    return option.diseases.includes(disease);
  });

  const hasInfantVersion = filtered.some((option) => option.ageGroup === 'INFANT');
  const hasChildVersion = filtered.some((option) => option.ageGroup === 'CHILD');

  if (hasInfantVersion && hasChildVersion) {
    const ageMatched = filtered.filter(
      (option) => !option.ageGroup || option.ageGroup === ageGroup,
    );
    if (ageMatched.length > 0) return ageMatched;
  }

  return filtered;
}

function toCustomFormula(
  role: FormulaRole,
  custom: CustomFormulaState,
  customDiseaseNutrients: string[],
): FormulaReference {
  const values: Record<string, number> = {};

  if (Number.isFinite(custom.kcal) && custom.kcal >= 0) {
    values.Energy = custom.kcal;
  }

  if (Number.isFinite(custom.protein) && custom.protein >= 0) {
    values.Protein = custom.protein;
  }

  if (role === 'modular') {
    if (Number.isFinite(custom.carbohydrate) && custom.carbohydrate >= 0) {
      values.Carbohydrate = custom.carbohydrate;
    }
    if (Number.isFinite(custom.fat) && custom.fat >= 0) {
      values.Fat = custom.fat;
    }
  }

  if (role !== 'modular') {
    customDiseaseNutrients.forEach((nutrient) => {
      const value = custom.nutrients[nutrient];
      if (Number.isFinite(value) && value >= 0) {
        values[nutrient] = value;
      }
    });
  }

  return {
    name: custom.name || `Custom ${role}`,
    basis: custom.basis,
    values,
  };
}

const App: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(Number.NaN);
  const [disease, setDisease] = useState<DiseaseType>(DiseaseType.PKU);
  const [ageGroupIndex, setAgeGroupIndex] = useState(0);
  const [targetMode, setTargetMode] = useState<TargetMode>('MID');
  const [feedsPerDay, setFeedsPerDay] = useState<number>(Number.NaN);
  const [scoopSizeG, setScoopSizeG] = useState<number>(Number.NaN);
  const [waterPerScoopMl, setWaterPerScoopMl] = useState<number>(Number.NaN);

  const [selector, setSelector] = useState<FormulaSelectorState>(initialSelectorForDisease(DiseaseType.PKU));
  const [customStandard, setCustomStandard] = useState<CustomFormulaState>(defaultCustomFormula('standard'));
  const [customSpecial, setCustomSpecial] = useState<CustomFormulaState>(defaultCustomFormula('special'));
  const [customModular, setCustomModular] = useState<CustomFormulaState>(defaultCustomFormula('modular'));

  const t = UI_STRINGS.en;
  const diseaseMeta = DISEASE_METADATA[disease].en;

  const guides = GUIDELINES[disease];
  const safeAgeIndex = Math.min(Math.max(0, ageGroupIndex), guides.length - 1);
  const formulaAgeGroup = formulaAgeGroupFromAgeLabel(guides[safeAgeIndex]?.ageLabel || '');
  const customDiseaseNutrients = useMemo(() => diseaseSpecificNutrients(disease), [disease]);

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);

  const standardOptions = useMemo(
    () => roleOptions('standard', disease, formulaAgeGroup),
    [disease, formulaAgeGroup],
  );
  const specialOptions = useMemo(
    () => roleOptions('special', disease, formulaAgeGroup),
    [disease, formulaAgeGroup],
  );
  const modularOptions = useMemo(
    () => roleOptions('modular', disease, formulaAgeGroup),
    [disease, formulaAgeGroup],
  );

  useEffect(() => {
    setSelector((prev) => {
      const next: FormulaSelectorState = { ...prev };
      let changed = false;

      if (
        prev.standard !== 'CUSTOM' &&
        !standardOptions.some((option) => option.id === prev.standard)
      ) {
        next.standard = standardOptions[0]?.id || 'CUSTOM';
        changed = true;
      }

      if (
        prev.special !== 'CUSTOM' &&
        prev.special !== 'NONE' &&
        !specialOptions.some((option) => option.id === prev.special)
      ) {
        next.special = specialOptions[0]?.id || 'NONE';
        changed = true;
      }

      if (
        prev.modular !== 'CUSTOM' &&
        prev.modular !== 'NONE' &&
        !modularOptions.some((option) => option.id === prev.modular)
      ) {
        next.modular = modularOptions[0]?.id || 'NONE';
        changed = true;
      }

      return changed ? next : prev;
    });
  }, [standardOptions, specialOptions, modularOptions]);

  const resolvedStandard = useMemo(() => {
    if (selector.standard === 'CUSTOM') {
      return toCustomFormula('standard', customStandard, customDiseaseNutrients);
    }

    return (
      FORMULA_OPTION_BY_ID[selector.standard] ||
      standardOptions[0] ||
      toCustomFormula('standard', customStandard, customDiseaseNutrients)
    );
  }, [selector.standard, customStandard, customDiseaseNutrients, standardOptions]);

  const resolvedSpecial = useMemo(() => {
    if (selector.special === 'NONE') return null;
    if (selector.special === 'CUSTOM') {
      return toCustomFormula('special', customSpecial, customDiseaseNutrients);
    }

    return FORMULA_OPTION_BY_ID[selector.special] || null;
  }, [selector.special, customSpecial, customDiseaseNutrients]);

  const resolvedModular = useMemo(() => {
    if (selector.modular === 'NONE') return null;
    if (selector.modular === 'CUSTOM') {
      return toCustomFormula('modular', customModular, customDiseaseNutrients);
    }

    return FORMULA_OPTION_BY_ID[selector.modular] || null;
  }, [selector.modular, customModular, customDiseaseNutrients]);

  const standardGuideNutrients = useMemo(() => {
    const diseaseNutrients = new Set<string>();

    Object.keys(guides[safeAgeIndex]?.nutrients || {}).forEach((nutrient) => {
      nutrient
        .split('+')
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => diseaseNutrients.add(part));
    });

    const focusedByDisease = FOCUSED_STANDARD_NUTRIENTS.filter(
      (nutrient) =>
        diseaseNutrients.has(nutrient) && typeof resolvedStandard.values[nutrient] === 'number',
    );

    if (focusedByDisease.length > 0) return focusedByDisease;

    return Object.keys(resolvedStandard.values).filter(
      (key) => key !== 'Energy' && key !== 'Protein',
    );
  }, [resolvedStandard, guides, safeAgeIndex]);
  const standardEffectNutrients = useMemo(
    () =>
      customDiseaseNutrients.length > 0 ? customDiseaseNutrients : standardGuideNutrients,
    [customDiseaseNutrients, standardGuideNutrients],
  );
  const formulaByRole = useMemo<Record<FormulaRole, FormulaReference | null>>(
    () => ({
      standard: resolvedStandard,
      special: resolvedSpecial,
      modular: resolvedModular,
    }),
    [resolvedStandard, resolvedSpecial, resolvedModular],
  );

  const calcInputs: CalculationInputs = useMemo(
    () => ({
      weightKg,
      disease,
      ageGroupIndex: safeAgeIndex,
      targetMode,
      feedsPerDay,
      scoopSizeG,
      waterPerScoopMl,
      formulas: {
        standard: resolvedStandard,
        special: resolvedSpecial,
        modular: resolvedModular,
      },
    }),
    [
      weightKg,
      disease,
      safeAgeIndex,
      targetMode,
      feedsPerDay,
      scoopSizeG,
      waterPerScoopMl,
      resolvedStandard,
      resolvedSpecial,
      resolvedModular,
    ],
  );

  const results = useMemo(() => calculateDiet(calcInputs), [calcInputs]);
  const resultRowsByNutrient = useMemo(
    () =>
      results.rows.reduce<Record<string, (typeof results.rows)[number]>>((acc, row) => {
        acc[row.nutrient] = row;
        return acc;
      }, {}),
    [results.rows],
  );
  const planItemByRole = useMemo<Partial<Record<FormulaRole, FormulaContribution>>>(() => {
    return results.formulaPlan.items.reduce<Partial<Record<FormulaRole, FormulaContribution>>>(
      (acc, item) => {
        acc[item.role] = item;
        return acc;
      },
      {},
    );
  }, [results.formulaPlan.items]);
  const finalOrderMix = useMemo(() => {
    const usedItems = results.formulaPlan.items.filter((item) => item.amount > 0.0001);
    if (usedItems.length === 0) return '';
    return `Mix ${usedItems.map((item) => formatOrderMixPart(item)).join(' + ')}`;
  }, [results.formulaPlan.items]);
  const totalScoopsPerDayOrder = useMemo(() => {
    return formatRoundedScoopCount(results.formulaPlan.totals.scoops);
  }, [results.formulaPlan.totals.scoops]);
  const preparationInstruction = useMemo(() => {
    if (results.formulaPlan.totals.scoops <= 0.0001) return '';

    const feedCount = safeFeedCountForOrder(feedsPerDay);
    const scoopsPerFeed = results.formulaPlan.totals.scoops / feedCount;
    const waterPerScoopForOrder =
      Number.isFinite(waterPerScoopMl) && waterPerScoopMl > 0 ? waterPerScoopMl : 30;
    const roundedScoopsPerFeed = roundedScoopCount(scoopsPerFeed);
    const waterPerFeed = roundedScoopsPerFeed * waterPerScoopForOrder;

    return `Add ${formatRoundedScoopCount(scoopsPerFeed)} of mixed powder to ${formatNumber(
      waterPerFeed,
      'mL/day',
    )} mL H2O q ${formatHourInterval(feedsPerDay)} hr.`;
  }, [results.formulaPlan.totals.scoops, feedsPerDay, waterPerScoopMl]);
  const modularDeficitRecommendations = useMemo(() => {
    const carbohydrateBalance = results.formulaPlan.nutrientBalances.find(
      (balance) => balance.nutrient === 'Carbohydrate',
    );
    const fatBalance = results.formulaPlan.nutrientBalances.find(
      (balance) => balance.nutrient === 'Fat',
    );

    const modularDeficitCandidates = [
      {
        nutrient: 'Energy' as const,
        deficit: Number(results.formulaPlan.deficits.energy || 0),
        unit: 'kcal/day' as const,
      },
      {
        nutrient: 'Carbohydrate' as const,
        deficit: Number(carbohydrateBalance?.deficitToTarget || 0),
        unit: 'g/day' as const,
      },
      {
        nutrient: 'Fat' as const,
        deficit: Number(fatBalance?.deficitToTarget || 0),
        unit: 'g/day' as const,
      },
    ] satisfies Array<{
      nutrient: 'Energy' | 'Carbohydrate' | 'Fat';
      deficit: number;
      unit: 'kcal/day' | 'g/day';
    }>;

    const deficits = modularDeficitCandidates.filter((item) => item.deficit > 0.0001);

    return deficits.map((item) => {
      let bestOption: (typeof modularOptions)[number] | undefined;
      let bestPer100 = 0;

      modularOptions.forEach((option) => {
        const per100 = option.values[item.nutrient];
        if (typeof per100 === 'number' && per100 > bestPer100) {
          bestPer100 = per100;
          bestOption = option;
        }
      });

      if (!bestOption || bestPer100 <= 0) {
        return {
          ...item,
          productName: '',
          grams: Number.NaN,
        };
      }

      return {
        ...item,
        productName: bestOption.name,
        grams: (item.deficit * 100) / bestPer100,
      };
    });
  }, [results.formulaPlan.deficits.energy, results.formulaPlan.nutrientBalances, modularOptions]);

  const onChangeDisease = (nextDisease: DiseaseType) => {
    setDisease(nextDisease);
    setAgeGroupIndex(0);
    setSelector(initialSelectorForDisease(nextDisease));
  };

  const renderCustomFormulaFields = (
    role: FormulaRole,
    data: CustomFormulaState,
    setData: React.Dispatch<React.SetStateAction<CustomFormulaState>>,
  ) => {
    return (
      <div
        className="custom-grid grid grid-cols-1 md:grid-cols-4 gap-2 mt-2 bg-slate-50 border border-slate-200 rounded p-2"
      >
        <label className="text-xs">
          <span className="block mb-1">{t.customName}</span>
          <input
            value={data.name}
            onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full border border-slate-300 rounded px-2 py-1.5"
          />
        </label>

        <label className="text-xs">
          <span className="block mb-1">{t.basis}</span>
          <select
            value={data.basis}
            onChange={(e) => setData((prev) => ({ ...prev, basis: e.target.value as '100g' | '100mL' }))}
            className="w-full border border-slate-300 rounded px-2 py-1.5 bg-white"
          >
            <option value="100g">100g</option>
            <option value="100mL">100mL</option>
          </select>
        </label>

        <label className="text-xs">
          <span className="block mb-1">{t.kcalPerBasis}</span>
          <input
            type="number"
            step="0.1"
            value={numberInputValue(data.kcal)}
            onChange={(e) => setData((prev) => ({ ...prev, kcal: parseFloatOrNaN(e.target.value) }))}
            className="w-full border border-slate-300 rounded px-2 py-1.5"
          />
        </label>

        <label className="text-xs">
          <span className="block mb-1">{t.proteinPerBasis}</span>
          <input
            type="number"
            step="0.01"
            value={numberInputValue(data.protein)}
            onChange={(e) => setData((prev) => ({ ...prev, protein: parseFloatOrNaN(e.target.value) }))}
            className="w-full border border-slate-300 rounded px-2 py-1.5"
          />
        </label>

        {role === 'modular' ? (
          <>
            <label className="text-xs">
              <span className="block mb-1">Carbohydrate per 100</span>
              <input
                type="number"
                step="0.1"
                value={numberInputValue(data.carbohydrate)}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, carbohydrate: parseFloatOrNaN(e.target.value) }))
                }
                className="w-full border border-slate-300 rounded px-2 py-1.5"
              />
            </label>

            <label className="text-xs">
              <span className="block mb-1">Fat per 100</span>
              <input
                type="number"
                step="0.1"
                value={numberInputValue(data.fat)}
                onChange={(e) => setData((prev) => ({ ...prev, fat: parseFloatOrNaN(e.target.value) }))}
                className="w-full border border-slate-300 rounded px-2 py-1.5"
              />
            </label>
          </>
        ) : null}

        {role !== 'modular'
          ? customDiseaseNutrients.map((nutrient) => (
            <label key={`${role}-${nutrient}`} className="text-xs">
              <span className="block mb-1">
                {`${nutrientLabel(nutrient)} per 100 (${formulaValueUnit(nutrient)})`}
              </span>
              <input
                type="number"
                step="0.1"
                value={numberInputValue(data.nutrients[nutrient] ?? Number.NaN)}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    nutrients: {
                      ...prev.nutrients,
                      [nutrient]: parseFloatOrNaN(e.target.value),
                    },
                  }))
                }
                className="w-full border border-slate-300 rounded px-2 py-1.5"
              />
            </label>
          ))
          : null}

        {role === 'modular' ? (
          <p className="text-[11px] text-slate-500 md:col-span-4">
            For Modular, use carbohydrate and fat values. Primary limiter is not used.
          </p>
        ) : null}
      </div>
    );
  };

  const renderFormulaFacts = (formula: FormulaReference | null) => {
    if (!formula) return null;

    const rows = orderedFormulaEntries(formula.values);
    return (
      <div className="mt-3 overflow-x-auto">
        <p className="text-xs font-semibold mb-2">{`Nutrition per ${formula.basis}`}</p>
        <table className="data-table w-full text-xs border border-slate-300">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-2 py-1 text-start">{t.nutrient}</th>
              <th className="border border-slate-300 px-2 py-1 text-start">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([nutrient, value]) => {
              const unit = formulaValueUnit(nutrient);
              return (
                <tr key={`${formula.name}-${nutrient}`}>
                  <td className="border border-slate-300 px-2 py-1 font-medium">
                    {nutrientLabel(nutrient)}
                  </td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">
                    {formatNumber(value, unit)} {unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRolePlanTable = (role: FormulaRole) => {
    const item = planItemByRole[role];
    const formula = formulaByRole[role];
    const roleTitle = roleLabel(role, t);
    const showEffectNutrients = role === 'standard';
    const colSpan = 7 + (showEffectNutrients ? standardEffectNutrients.length : 0);

    return (
      <div className="subcard border border-slate-300 rounded p-3">
        <p className="font-semibold mb-2">{roleTitle}</p>
        <div className="overflow-x-auto">
          <table className="data-table w-full text-sm border border-slate-300">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-2 py-1 text-start">{t.formulaName}</th>
                <th className="border border-slate-300 px-2 py-1 text-start">{t.amount}</th>
                <th className="border border-slate-300 px-2 py-1 text-start">{t.kcal}</th>
                <th className="border border-slate-300 px-2 py-1 text-start">{t.protein}</th>
                <th className="border border-slate-300 px-2 py-1 text-start">{t.scoops}</th>
                <th className="border border-slate-300 px-2 py-1 text-start">{t.water}</th>
                <th className="border border-slate-300 px-2 py-1 text-start">{t.perFeedAmount}</th>
                {showEffectNutrients
                  ? standardEffectNutrients.map((nutrient) => (
                    <th key={`plan-header-${role}-${nutrient}`} className="border border-slate-300 px-2 py-1 text-start">
                      {nutrientLabel(nutrient)}
                    </th>
                  ))
                  : null}
              </tr>
            </thead>
            <tbody>
              {!item ? (
                <tr>
                  <td className="border border-slate-300 px-2 py-2 text-slate-500" colSpan={colSpan}>
                    No selected {roleTitle.toLowerCase()} formula.
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="border border-slate-300 px-2 py-1">{item.formulaName}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">
                    {formatNumber(item.amount, item.amountUnit)} {item.amountUnit}
                  </td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">
                    {formatNumber(item.kcal, 'kcal/day')} kcal/day
                  </td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">
                    {formatNumber(item.protein, 'g/day')} g/day
                  </td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">
                    {typeof item.scoops === 'number' ? `${formatNumber(item.scoops, 'g/day')}` : '-'}
                  </td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">
                    {typeof item.waterMl === 'number' ? `${formatNumber(item.waterMl, 'mL/day')} mL` : '-'}
                  </td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">
                    {typeof item.perFeedAmount === 'number'
                      ? `${formatNumber(item.perFeedAmount, item.amountUnit)} ${item.amountUnit.replace('/day', '')}`
                      : '-'}
                    {typeof item.perFeedScoops === 'number'
                      ? ` | ${formatNumber(item.perFeedScoops, 'g/day')} ${t.perFeedScoops}`
                      : ''}
                    {typeof item.perFeedWaterMl === 'number'
                      ? ` | ${formatNumber(item.perFeedWaterMl, 'mL/day')} mL`
                      : ''}
                  </td>
                  {showEffectNutrients
                    ? standardEffectNutrients.map((nutrient) => {
                      const per100 = formula?.values[nutrient];
                      const delivered =
                        typeof per100 === 'number' ? (per100 * item.amount) / 100 : undefined;
                      const unit = formulaValueDailyUnit(nutrient);

                      return (
                        <td key={`plan-value-${role}-${nutrient}`} className="border border-slate-300 px-2 py-1" dir="ltr">
                          {typeof delivered === 'number'
                            ? `${formatNumber(delivered, unit)} ${unit}`
                            : '-'}
                        </td>
                      );
                    })
                    : null}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell min-h-screen text-slate-900 font-sans">
      <main className="app-main max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <section className="panel hero-panel p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t.appTitle}</h1>
            </div>
          </div>

          <h2 className="font-bold mb-3">{t.patientData}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="text-sm">
              <span className="block mb-1">{t.diagnosis}</span>
              <select
                value={disease}
                onChange={(e) => onChangeDisease(e.target.value as DiseaseType)}
                className="w-full border border-slate-300 rounded px-2 py-2 bg-white"
              >
                {SUPPORTED_DISEASES.map((diseaseType) => (
                  <option key={diseaseType} value={diseaseType}>
                    {DISEASE_METADATA[diseaseType].en.short} - {DISEASE_METADATA[diseaseType].en.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="block mb-1">{t.weight}</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={numberInputValue(weightKg)}
                onChange={(e) => setWeightKg(parseFloatOrNaN(e.target.value))}
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>

            <label className="text-sm">
              <span className="block mb-1">{t.feedsPerDay}</span>
              <input
                type="number"
                min="1"
                value={numberInputValue(feedsPerDay)}
                onChange={(e) => setFeedsPerDay(parseIntOrNaN(e.target.value))}
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>

            <label className="text-sm md:col-span-2">
              <span className="block mb-1">{t.ageGroup}</span>
              <select
                value={safeAgeIndex}
                onChange={(e) => setAgeGroupIndex(Number.parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded px-2 py-2 bg-white"
              >
                {guides.map((guide, index) => (
                  <option key={guide.ageLabel} value={index}>
                    {guide.ageLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="block mb-1">{t.scoopSize}</span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={numberInputValue(scoopSizeG)}
                onChange={(e) => setScoopSizeG(parseFloatOrNaN(e.target.value))}
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>

            <label className="text-sm">
              <span className="block mb-1">{t.waterPerScoop}</span>
              <input
                type="number"
                step="1"
                min="0"
                value={numberInputValue(waterPerScoopMl)}
                onChange={(e) => setWaterPerScoopMl(parseFloatOrNaN(e.target.value))}
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>
          </div>

          <div className="mt-4">
            <p className="text-sm mb-2">{t.targetMode}</p>
            <div className="mode-switch inline-flex border border-slate-300 rounded overflow-hidden">
              {TARGET_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTargetMode(mode)}
                  className={`px-4 py-1.5 text-sm border-e border-slate-300 last:border-e-0 ${targetMode === mode ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                    }`}
                >
                  {mode === 'MIN' ? t.min : mode === 'MID' ? t.mid : t.max}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="panel p-4 md:p-6 space-y-4">
          <h2 className="font-bold">{t.formulaConfigTitle}</h2>
          <p className="text-xs text-slate-600">
            Formula version is selected by age group: {formulaAgeGroup === 'INFANT' ? 'Infant (A)' : 'Over 1 year (B)'}.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="subcard border border-slate-300 rounded p-3">
              <p className="font-semibold mb-2">{t.standardFormula}</p>
              <select
                value={selector.standard}
                onChange={(e) => setSelector((prev) => ({ ...prev, standard: e.target.value }))}
                className="w-full border border-slate-300 rounded px-2 py-2 bg-white text-sm"
              >
                {standardOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.basis})
                  </option>
                ))}
                <option value="CUSTOM">{t.customOption}</option>
              </select>
              {selector.standard === 'CUSTOM'
                ? renderCustomFormulaFields('standard', customStandard, setCustomStandard)
                : null}
              <div className="mt-3 overflow-x-auto">
                <p className="text-xs font-semibold mb-2">{t.standardGuidelineTitle}</p>
                <table className="data-table w-full text-xs border border-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 px-2 py-1 text-start">{t.typeOfFormula}</th>
                      <th className="border border-slate-300 px-2 py-1 text-start">Calories</th>
                      <th className="border border-slate-300 px-2 py-1 text-start">{t.protein}</th>
                      {standardEffectNutrients.map((nutrient) => (
                        <th key={nutrient} className="border border-slate-300 px-2 py-1 text-start">
                          {nutrientLabel(nutrient)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-2 py-1 font-medium">{t.standardGuidelineRow}</td>
                      <td className="border border-slate-300 px-2 py-1" dir="ltr">
                        {typeof resolvedStandard.values.Energy === 'number'
                          ? `${resolvedStandard.values.Energy} kcal`
                          : '-'}
                      </td>
                      <td className="border border-slate-300 px-2 py-1" dir="ltr">
                        {typeof resolvedStandard.values.Protein === 'number'
                          ? `${resolvedStandard.values.Protein} g`
                          : '-'}
                      </td>
                      {standardEffectNutrients.map((nutrient) => (
                        <td key={nutrient} className="border border-slate-300 px-2 py-1" dir="ltr">
                          {typeof resolvedStandard.values[nutrient] === 'number'
                            ? `${resolvedStandard.values[nutrient]} ${formulaValueUnit(nutrient)}`
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="subcard border border-slate-300 rounded p-3">
              <p className="font-semibold mb-2">{t.specialFormula}</p>
              <select
                value={selector.special}
                onChange={(e) => setSelector((prev) => ({ ...prev, special: e.target.value }))}
                className="w-full border border-slate-300 rounded px-2 py-2 bg-white text-sm"
              >
                <option value="NONE">{t.noneOption}</option>
                {specialOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.basis})
                  </option>
                ))}
                <option value="CUSTOM">{t.customOption}</option>
              </select>
              {selector.special === 'CUSTOM'
                ? renderCustomFormulaFields('special', customSpecial, setCustomSpecial)
                : null}
              {renderFormulaFacts(resolvedSpecial)}
            </div>

            <div className="subcard border border-slate-300 rounded p-3">
              <p className="font-semibold mb-2">{t.modularFormula}</p>
              <select
                value={selector.modular}
                onChange={(e) => setSelector((prev) => ({ ...prev, modular: e.target.value }))}
                className="w-full border border-slate-300 rounded px-2 py-2 bg-white text-sm"
              >
                <option value="NONE">{t.noneOption}</option>
                {modularOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.basis})
                  </option>
                ))}
                <option value="CUSTOM">{t.customOption}</option>
              </select>
              {selector.modular === 'CUSTOM'
                ? renderCustomFormulaFields('modular', customModular, setCustomModular)
                : null}
              {renderFormulaFacts(resolvedModular)}
            </div>
          </div>
        </section>

        <section className="panel p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.requirementsTitle}</h2>
          <p className="text-sm text-slate-600 mb-3">
            {diseaseMeta.short} - {diseaseMeta.name}
          </p>
          <div className="overflow-x-auto">
            <table className="data-table w-full text-sm border border-slate-300">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.nutrient}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.sourceRange}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.dailyRange}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.selectedTarget}</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((row) => (
                  <tr key={row.nutrient}>
                    <td className="border border-slate-300 px-2 py-1 font-medium">
                      {nutrientLabel(row.nutrient)}
                    </td>
                    <td className="border border-slate-300 px-2 py-1" dir="ltr">
                      {formatSourceRange(row.source)}
                    </td>
                    <td className="border border-slate-300 px-2 py-1" dir="ltr">
                      {formatDailyRange(row.source, row.totalMin, row.totalMax, row.totalUnit)}
                    </td>
                    <td className="border border-slate-300 px-2 py-1 font-semibold" dir="ltr">
                      {formatNumber(row.totalTarget, row.totalUnit)} {row.totalUnit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.planTitle}</h2>
          <div className="grid grid-cols-1 gap-3">
            {renderRolePlanTable('standard')}
            {renderRolePlanTable('special')}
            {renderRolePlanTable('modular')}
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-2">{t.nutrientCoverageTitle}</p>
            <div className="overflow-x-auto">
              <table className="data-table w-full text-sm border border-slate-300">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-300 px-2 py-1 text-start">{t.nutrient}</th>
                    <th className="border border-slate-300 px-2 py-1 text-start">{t.dailyRange}</th>
                    <th className="border border-slate-300 px-2 py-1 text-start">{t.targetAmount}</th>
                    <th className="border border-slate-300 px-2 py-1 text-start">{t.deliveredAmount}</th>
                    <th className="border border-slate-300 px-2 py-1 text-start">{t.deficitAmount}</th>
                    <th className="border border-slate-300 px-2 py-1 text-start">{t.excessAmount}</th>
                    <th className="border border-slate-300 px-2 py-1 text-start">{t.balanceStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.formulaPlan.nutrientBalances.map((balance) => {
                    const row = resultRowsByNutrient[balance.nutrient];

                    return (
                      <tr key={`coverage-${balance.nutrient}`}>
                        <td className="border border-slate-300 px-2 py-1 font-medium">
                          {nutrientLabel(balance.nutrient)}
                        </td>
                        <td className="border border-slate-300 px-2 py-1" dir="ltr">
                          {row
                            ? formatDailyRange(row.source, balance.min, balance.max, balance.unit)
                            : `${formatNumber(balance.min, balance.unit)}-${formatNumber(balance.max, balance.unit)} ${balance.unit}`}
                        </td>
                        <td className="border border-slate-300 px-2 py-1" dir="ltr">
                          {formatNumber(balance.target, balance.unit)} {balance.unit}
                        </td>
                        <td className="border border-slate-300 px-2 py-1" dir="ltr">
                          {formatNumber(balance.delivered, balance.unit)} {balance.unit}
                        </td>
                        <td className="border border-slate-300 px-2 py-1" dir="ltr">
                          {formatNumber(balance.deficitToTarget, balance.unit)} {balance.unit}
                        </td>
                        <td className="border border-slate-300 px-2 py-1" dir="ltr">
                          {formatNumber(balance.excessToTarget, balance.unit)} {balance.unit}
                        </td>
                        <td className={`border border-slate-300 px-2 py-1 font-semibold ${statusToneClass(balance.status)}`}>
                          {statusLabel(balance.status, t)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4">
            <div className="order-highlight subcard border-2 border-teal-300 rounded-xl p-4 md:p-5 bg-gradient-to-br from-teal-50 via-cyan-50 to-white space-y-4">
              <p className="text-lg md:text-2xl font-bold tracking-tight">{t.orderTitle}</p>

              <div className="order-mix-block rounded-xl border border-teal-200 bg-white/85 p-3 md:p-4">
                <p className="text-[11px] md:text-xs uppercase tracking-[0.08em] text-teal-700 font-semibold mb-1">
                  Final Mix
                </p>
                <p className="text-sm md:text-lg font-semibold leading-6 md:leading-8" dir="ltr">
                  {finalOrderMix || 'No formula mix yet.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                <div className="order-meta-block rounded-lg border border-teal-200 bg-white/90 p-3">
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wide">Total Scoop / Day</p>
                  <p className="text-base md:text-xl font-bold mt-1" dir="ltr">
                    {totalScoopsPerDayOrder}
                  </p>
                </div>
                <div className="order-meta-block rounded-lg border border-teal-200 bg-white/90 p-3">
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wide">Preparation</p>
                  <p className="text-sm md:text-base font-semibold mt-1 leading-6" dir="ltr">
                    {preparationInstruction || 'Add mixed powder to water as prescribed.'}
                  </p>
                </div>
              </div>
              {modularDeficitRecommendations.length > 0 ? (
                <div className="order-meta-block rounded-lg border border-teal-200 bg-white/90 p-3">
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wide">
                    Suggested Modular Adjustment (If Needed)
                  </p>
                  <div className="mt-1.5 space-y-1.5">
                    {modularDeficitRecommendations.map((recommendation) => (
                      <p
                        key={`modular-rec-${recommendation.nutrient}`}
                        className="text-sm md:text-base font-semibold leading-6"
                        dir="ltr"
                      >
                        {recommendation.productName
                          ? `If ${nutrientLabel(recommendation.nutrient)} deficit is ${formatNumber(
                            recommendation.deficit,
                            recommendation.unit,
                          )} ${recommendation.unit}, consider =~ ${formatNumber(
                            recommendation.grams,
                            'g/day',
                          )} g/day from ${cleanOrderFormulaName(recommendation.productName)}.`
                          : `If ${nutrientLabel(recommendation.nutrient)} deficit exists, no suitable modular product is available in the current list.`}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}

              {results.formulaPlan.notes.length > 0 ? (
                <div className="space-y-1.5">
                  {results.formulaPlan.notes.map((note, idx) => (
                    <p key={`note-${idx}`} className="text-xs md:text-sm text-amber-700 font-semibold">
                      {t.orderNote}: {note}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-slate-500 space-y-1 pb-8">
          <p>Developed and Programmed by Dt Yahya Alizzi</p>
          <p>Reviewed by Dt Majed Garidah </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
