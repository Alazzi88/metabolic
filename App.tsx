import React, { useEffect, useMemo, useState } from 'react';
import {
  CalculationInputs,
  DiseaseType,
  FormulaAgeGroup,
  FormulaReference,
  FormulaRole,
  NutrientRange,
  TargetMode,
} from './types';
import {
  DEFAULT_FORMULA_SELECTION,
  DISEASE_METADATA,
  FORMULA_LIBRARY_BY_DISEASE,
  FORMULA_OPTION_BY_ID,
  FORMULA_OPTIONS,
  GUIDELINES,
  REFERENCE_TEXT,
  SUPPORTED_DISEASES,
  UI_STRINGS,
} from './constants';
import { calculateDiet } from './calculators';

const TARGET_MODES: TargetMode[] = ['MIN', 'MID', 'MAX'];

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
  limiter: number;
  carbohydrate: number;
  fat: number;
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
  if (role === 'modular') {
    return {
      name: 'Custom modular',
      basis: '100g',
      kcal: Number.NaN,
      protein: Number.NaN,
      limiter: Number.NaN,
      carbohydrate: Number.NaN,
      fat: Number.NaN,
    };
  }

  return {
    name: role === 'standard' ? 'Custom Standard' : 'Custom Special',
    basis: '100g',
    kcal: Number.NaN,
    protein: Number.NaN,
    limiter: Number.NaN,
    carbohydrate: Number.NaN,
    fat: Number.NaN,
  };
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

function roleLabel(role: FormulaRole, t: typeof UI_STRINGS.en): string {
  if (role === 'standard') return t.standardFormula;
  if (role === 'special') return t.specialFormula;
  return t.modularFormula;
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
  disease: DiseaseType,
  custom: CustomFormulaState,
): FormulaReference {
  const primaryLimiter = DISEASE_METADATA[disease].primaryLimiter;
  const values: Record<string, number> = {
    Energy: custom.kcal,
    Protein: custom.protein,
  };

  if (role === 'modular') {
    if (custom.carbohydrate > 0) {
      values.Carbohydrate = custom.carbohydrate;
    }
    if (custom.fat > 0) {
      values.Fat = custom.fat;
    }
  } else if (primaryLimiter && custom.limiter > 0) {
    values[primaryLimiter] = custom.limiter;
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
  const primaryLimiter = DISEASE_METADATA[disease].primaryLimiter || 'Limiter';

  const guides = GUIDELINES[disease];
  const safeAgeIndex = Math.min(Math.max(0, ageGroupIndex), guides.length - 1);
  const formulaAgeGroup = formulaAgeGroupFromAgeLabel(guides[safeAgeIndex]?.ageLabel || '');

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
      return toCustomFormula('standard', disease, customStandard);
    }

    return FORMULA_OPTION_BY_ID[selector.standard] || standardOptions[0] || toCustomFormula('standard', disease, customStandard);
  }, [selector.standard, disease, customStandard, standardOptions]);

  const resolvedSpecial = useMemo(() => {
    if (selector.special === 'NONE') return null;
    if (selector.special === 'CUSTOM') {
      return toCustomFormula('special', disease, customSpecial);
    }

    return FORMULA_OPTION_BY_ID[selector.special] || null;
  }, [selector.special, disease, customSpecial]);

  const resolvedModular = useMemo(() => {
    if (selector.modular === 'NONE') return null;
    if (selector.modular === 'CUSTOM') {
      return toCustomFormula('modular', disease, customModular);
    }

    return FORMULA_OPTION_BY_ID[selector.modular] || null;
  }, [selector.modular, disease, customModular]);

  const standardGuideNutrients = useMemo(() => {
    return Object.keys(resolvedStandard.values).filter(
      (key) => key !== 'Energy' && key !== 'Protein',
    );
  }, [resolvedStandard]);

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
        className={`custom-grid grid grid-cols-1 ${
          role === 'modular' ? 'md:grid-cols-6' : 'md:grid-cols-5'
        } gap-2 mt-2 bg-slate-50 border border-slate-200 rounded p-2`}
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
        ) : (
          <label className="text-xs">
            <span className="block mb-1">{t.limiterPerBasis} ({primaryLimiter})</span>
            <input
              type="number"
              step="0.1"
              value={numberInputValue(data.limiter)}
              onChange={(e) => setData((prev) => ({ ...prev, limiter: parseFloatOrNaN(e.target.value) }))}
              className="w-full border border-slate-300 rounded px-2 py-1.5"
            />
          </label>
        )}

        {role === 'modular' ? (
          <p className="text-[11px] text-slate-500 md:col-span-6">
            For modular, use carbohydrate and fat values. Primary limiter is not used.
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
                  className={`px-4 py-1.5 text-sm border-e border-slate-300 last:border-e-0 ${
                    targetMode === mode ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
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
                      {standardGuideNutrients.map((nutrient) => (
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
                      {standardGuideNutrients.map((nutrient) => (
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
          <h2 className="font-bold mb-3">{t.summaryTitle}</h2>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="subcard border border-slate-300 rounded p-3 space-y-1">
              <p>
                {t.targetEnergy}:{' '}
                <strong dir="ltr">
                  {typeof results.highlights.targetEnergy === 'number'
                    ? `${formatNumber(results.highlights.targetEnergy, 'kcal/day')} kcal/day`
                    : '-'}
                </strong>
              </p>
              <p>
                {t.targetProtein}:{' '}
                <strong dir="ltr">
                  {typeof results.highlights.targetProtein === 'number'
                    ? `${formatNumber(results.highlights.targetProtein, 'g/day')} g/day`
                    : '-'}
                </strong>
              </p>
              <p>
                {t.targetFluid}:{' '}
                <strong dir="ltr">
                  {typeof results.highlights.targetFluid === 'number'
                    ? `${formatNumber(results.highlights.targetFluid, 'mL/day')} mL/day`
                    : '-'}
                </strong>
              </p>
              <p>
                {t.primaryLimit}:{' '}
                <strong dir="ltr">
                  {results.highlights.primaryLimit
                    ? `${results.highlights.primaryLimit.nutrient} = ${formatNumber(
                        results.highlights.primaryLimit.value,
                        results.highlights.primaryLimit.unit,
                      )} ${results.highlights.primaryLimit.unit}`
                    : '-'}
                </strong>
              </p>
            </div>
          </div>
        </section>

        <section className="panel p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.planTitle}</h2>
          <div className="overflow-x-auto">
            <table className="data-table w-full text-sm border border-slate-300">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.role}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.formulaName}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.amount}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.kcal}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.protein}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.limiterDelivered}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.scoops}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.water}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.perFeedAmount}</th>
                </tr>
              </thead>
              <tbody>
                {results.formulaPlan.items.map((item) => (
                  <tr key={`${item.role}-${item.formulaName}`}>
                    <td className="border border-slate-300 px-2 py-1 font-medium">{roleLabel(item.role, t)}</td>
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
                      {typeof item.primaryLimiterDelivered === 'number' && results.highlights.primaryLimit
                        ? `${formatNumber(item.primaryLimiterDelivered, results.highlights.primaryLimit.unit)} ${results.highlights.primaryLimit.unit}`
                        : '-'}
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
                  </tr>
                ))}
              </tbody>
            </table>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
            <div className="subcard border border-slate-300 rounded p-3 space-y-1">
              <p className="font-semibold">{t.totalsTitle}</p>
              <p>{t.totalKcal}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.kcal, 'kcal/day')} kcal/day</strong></p>
              <p>{t.totalProtein}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.protein, 'g/day')} g/day</strong></p>
              <p>{t.totalPowder}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.powderG, 'g/day')} g/day</strong></p>
              <p>{t.totalScoops}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.scoops, 'g/day')}</strong></p>
              <p>{t.totalWater}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.waterMl, 'mL/day')} mL/day</strong></p>
              <p>{t.totalVolume}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.finalVolumeMl, 'mL/day')} mL/day</strong></p>
              <p>{t.volumePerFeed}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.volumePerFeedMl, 'mL/day')} mL/feed</strong></p>
              <p>{t.scoopsPerFeed}: <strong dir="ltr">{formatNumber(results.formulaPlan.totals.scoopsPerFeed, 'g/day')} scoops/feed</strong></p>
              <p>{t.proteinDeficit}: <strong dir="ltr">{formatNumber(results.formulaPlan.deficits.protein, 'g/day')} g/day</strong></p>
              <p>{t.energyDeficit}: <strong dir="ltr">{formatNumber(results.formulaPlan.deficits.energy, 'kcal/day')} kcal/day</strong></p>
            </div>

            <div className="subcard border border-slate-300 rounded p-3 space-y-2">
              <p className="font-semibold">{t.orderTitle}</p>
              {results.formulaPlan.items.map((item, idx) => {
                if (item.amount <= 0.0001) return null;

                return (
                  <p key={`${item.role}-${idx}`} className="text-sm" dir="ltr">
                    {idx + 1}. {roleLabel(item.role, t)}: {formatNumber(item.amount, item.amountUnit)} {item.amountUnit}{' '}
                    ({formatNumber(item.kcal, 'kcal/day')} kcal, {formatNumber(item.protein, 'g/day')} g protein)
                    {typeof item.scoops === 'number'
                      ? ` | ${formatNumber(item.scoops, 'g/day')} scoops/day + ${formatNumber(item.waterMl || 0, 'mL/day')} mL water/day`
                      : ''}
                  </p>
                );
              })}
              {results.formulaPlan.notes.map((note, idx) => (
                <p key={`note-${idx}`} className="text-xs text-amber-700">
                  {t.orderNote}: {note}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="panel panel-muted p-4 md:p-6 text-xs text-slate-600 space-y-1">
          <p>{t.reference}</p>
          <p>{REFERENCE_TEXT}</p>
        </section>

        <footer className="text-center text-xs text-slate-500 space-y-1 pb-8">
          <p>This website Developed By Yahya Alizzi</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
