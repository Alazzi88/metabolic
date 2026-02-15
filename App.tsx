import React, { useEffect, useMemo, useState } from 'react';
import {
  CalculationInputs,
  DiseaseType,
  FormulaReference,
  FormulaRole,
  NutrientRange,
  TargetMode,
} from './types';
import {
  DEFAULT_FORMULA_SELECTION,
  DISEASE_ANALYSIS_NUTRIENTS,
  DISEASE_METADATA,
  FORMULA_OPTION_BY_ID,
  FORMULA_OPTIONS,
  GUIDELINES,
  REFERENCE_TEXT,
  UI_STRINGS,
} from './constants';
import { calculateDiet } from './calculators';

const TARGET_MODES: TargetMode[] = ['MIN', 'MID', 'MAX'];

const NUTRIENT_LABELS: Record<string, { ar: string; en: string }> = {
  Energy: { ar: 'الطاقة', en: 'Energy' },
  Protein: { ar: 'البروتين', en: 'Protein' },
  Fluid: { ar: 'السوائل', en: 'Fluid' },
  Fat: { ar: 'الدهون', en: 'Fat' },
  PHE: { ar: 'فينيل ألانين', en: 'PHE' },
  TYR: { ar: 'تيروزين', en: 'TYR' },
  'PHE+TYR': { ar: 'PHE + TYR', en: 'PHE + TYR' },
  ILE: { ar: 'آيزوليوسين', en: 'ILE' },
  LEU: { ar: 'ليوسين', en: 'LEU' },
  VAL: { ar: 'فالين', en: 'VAL' },
  MET: { ar: 'ميثيونين', en: 'MET' },
  CYS: { ar: 'سيستين', en: 'CYS' },
  THR: { ar: 'ثريونين', en: 'THR' },
  LYS: { ar: 'لايسين', en: 'LYS' },
  TRP: { ar: 'تريبتوفان', en: 'TRP' },
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
      name: 'Custom Modular',
      basis: '100g',
      kcal: 500,
      protein: 0,
      limiter: 0,
    };
  }

  return {
    name: role === 'standard' ? 'Custom Standard' : 'Custom Special',
    basis: '100g',
    kcal: 470,
    protein: 13,
    limiter: 0,
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

function nutrientLabel(key: string, lang: 'ar' | 'en'): string {
  return NUTRIENT_LABELS[key]?.[lang] || key;
}

function roleLabel(role: FormulaRole, t: typeof UI_STRINGS.ar): string {
  if (role === 'standard') return t.standardFormula;
  if (role === 'special') return t.specialFormula;
  return t.modularFormula;
}

function statusLabel(
  status: 'LOW' | 'NORMAL' | 'HIGH' | 'NA',
  t: typeof UI_STRINGS.ar,
): string {
  if (status === 'LOW') return t.statusLow;
  if (status === 'HIGH') return t.statusHigh;
  if (status === 'NORMAL') return t.statusNormal;
  return t.statusNA;
}

function roleOptions(role: FormulaRole, disease: DiseaseType) {
  return FORMULA_OPTIONS.filter((option) => {
    if (option.role !== role) return false;
    if (!option.diseases) return true;
    return option.diseases.includes(disease);
  });
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

  if (primaryLimiter && custom.limiter > 0) {
    values[primaryLimiter] = custom.limiter;
  }

  return {
    name: custom.name || `Custom ${role}`,
    basis: custom.basis,
    values,
  };
}

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [weightKg, setWeightKg] = useState(4);
  const [disease, setDisease] = useState<DiseaseType>(DiseaseType.PKU);
  const [ageGroupIndex, setAgeGroupIndex] = useState(0);
  const [targetMode, setTargetMode] = useState<TargetMode>('MID');
  const [feedsPerDay, setFeedsPerDay] = useState(12);
  const [analysisValues, setAnalysisValues] = useState<Record<string, number | undefined>>({});
  const [scoopSizeG, setScoopSizeG] = useState(5);
  const [waterPerScoopMl, setWaterPerScoopMl] = useState(30);

  const [selector, setSelector] = useState<FormulaSelectorState>(initialSelectorForDisease(DiseaseType.PKU));
  const [customStandard, setCustomStandard] = useState<CustomFormulaState>(defaultCustomFormula('standard'));
  const [customSpecial, setCustomSpecial] = useState<CustomFormulaState>(defaultCustomFormula('special'));
  const [customModular, setCustomModular] = useState<CustomFormulaState>(defaultCustomFormula('modular'));

  const t = UI_STRINGS[lang];
  const diseaseMeta = DISEASE_METADATA[disease][lang];
  const primaryLimiter = DISEASE_METADATA[disease].primaryLimiter || 'Limiter';

  const guides = GUIDELINES[disease];
  const safeAgeIndex = Math.min(Math.max(0, ageGroupIndex), guides.length - 1);
  const analysisTargets = DISEASE_ANALYSIS_NUTRIENTS[disease] || [];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const standardOptions = useMemo(() => roleOptions('standard', disease), [disease]);
  const specialOptions = useMemo(() => roleOptions('special', disease), [disease]);
  const modularOptions = useMemo(() => roleOptions('modular', disease), [disease]);

  const resolvedStandard = useMemo(() => {
    if (selector.standard === 'CUSTOM') {
      return toCustomFormula('standard', disease, customStandard);
    }

    return FORMULA_OPTION_BY_ID[selector.standard] || standardOptions[0] || FORMULA_OPTION_BY_ID.SIMILAC_RTF_100ML;
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

  const calcInputs: CalculationInputs = useMemo(
    () => ({
      weightKg,
      disease,
      ageGroupIndex: safeAgeIndex,
      targetMode,
      feedsPerDay,
      analysisValues,
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
      analysisValues,
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
  const analysisByNutrient = useMemo(
    () =>
      results.analysis.items.reduce<Record<string, (typeof results.analysis.items)[number]>>(
        (acc, item) => {
          acc[item.nutrient] = item;
          return acc;
        },
        {},
      ),
    [results.analysis.items],
  );

  const onChangeDisease = (nextDisease: DiseaseType) => {
    setDisease(nextDisease);
    setAgeGroupIndex(0);
    setSelector(initialSelectorForDisease(nextDisease));
    setAnalysisValues({});
  };

  const renderCustomFormulaFields = (
    role: FormulaRole,
    data: CustomFormulaState,
    setData: React.Dispatch<React.SetStateAction<CustomFormulaState>>,
  ) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2 bg-slate-50 border border-slate-200 rounded p-2">
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
            value={data.kcal}
            onChange={(e) => setData((prev) => ({ ...prev, kcal: Number.parseFloat(e.target.value) || 0 }))}
            className="w-full border border-slate-300 rounded px-2 py-1.5"
          />
        </label>

        <label className="text-xs">
          <span className="block mb-1">{t.proteinPerBasis}</span>
          <input
            type="number"
            step="0.01"
            value={data.protein}
            onChange={(e) => setData((prev) => ({ ...prev, protein: Number.parseFloat(e.target.value) || 0 }))}
            className="w-full border border-slate-300 rounded px-2 py-1.5"
          />
        </label>

        <label className="text-xs">
          <span className="block mb-1">{t.limiterPerBasis} ({primaryLimiter})</span>
          <input
            type="number"
            step="0.1"
            value={data.limiter}
            onChange={(e) => setData((prev) => ({ ...prev, limiter: Number.parseFloat(e.target.value) || 0 }))}
            className="w-full border border-slate-300 rounded px-2 py-1.5"
          />
        </label>

        {role === 'modular' ? (
          <p className="text-[11px] text-slate-500 md:col-span-5">
            {lang === 'ar'
              ? 'للموديولار غالبًا البروتين = 0 والعنصر المحدد = 0.'
              : 'For modular, protein and primary limiter are usually zero.'}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-[#f6f6f3] text-slate-900 ${lang === 'ar' ? "font-['Tajawal']" : 'font-sans'}`}>
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t.appTitle}</h1>
              <p className="text-sm text-slate-600">{t.subtitle}</p>
            </div>
            <button
              onClick={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
              className="border border-slate-400 px-3 py-1.5 text-sm rounded hover:bg-slate-50"
            >
              {t.switchLang}
            </button>
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
                {Object.entries(DISEASE_METADATA).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta[lang].short} - {meta[lang].name}
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
                value={weightKg}
                onChange={(e) => setWeightKg(Number.parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>

            <label className="text-sm">
              <span className="block mb-1">{t.feedsPerDay}</span>
              <input
                type="number"
                min="1"
                value={feedsPerDay}
                onChange={(e) => setFeedsPerDay(Number.parseInt(e.target.value, 10) || 1)}
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
                value={scoopSizeG}
                onChange={(e) => setScoopSizeG(Number.parseFloat(e.target.value) || 5)}
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>

            <label className="text-sm">
              <span className="block mb-1">{t.waterPerScoop}</span>
              <input
                type="number"
                step="1"
                min="0"
                value={waterPerScoopMl}
                onChange={(e) => setWaterPerScoopMl(Number.parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>
          </div>

          <div className="mt-4">
            <p className="text-sm mb-2">{t.targetMode}</p>
            <div className="inline-flex border border-slate-300 rounded overflow-hidden">
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

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6 space-y-4">
          <h2 className="font-bold">{t.formulaConfigTitle}</h2>

          <div className="grid grid-cols-1 gap-3">
            <div className="border border-slate-300 rounded p-3">
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
            </div>

            <div className="border border-slate-300 rounded p-3">
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
            </div>

            <div className="border border-slate-300 rounded p-3">
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
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.requirementsTitle}</h2>
          <p className="text-sm text-slate-600 mb-3">
            {diseaseMeta.short} - {diseaseMeta.name}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-300">
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
                      {nutrientLabel(row.nutrient, lang)}
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

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.analysisInputsTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-300">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.analysisItemLabel}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.analysisExpectedRange}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.analysisInputValue}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.analysisStatus}</th>
                </tr>
              </thead>
              <tbody>
                {analysisTargets.map((nutrientKey) => {
                  const row = resultRowsByNutrient[nutrientKey];
                  const analysisItem = analysisByNutrient[nutrientKey];
                  const inputValue = analysisValues[nutrientKey];

                  return (
                    <tr key={nutrientKey}>
                      <td className="border border-slate-300 px-2 py-1 font-medium">
                        {nutrientLabel(nutrientKey, lang)}
                      </td>
                      <td className="border border-slate-300 px-2 py-1" dir="ltr">
                        {row
                          ? formatDailyRange(row.source, row.totalMin, row.totalMax, row.totalUnit)
                          : '-'}
                      </td>
                      <td className="border border-slate-300 px-2 py-1" dir="ltr">
                        <input
                          type="number"
                          step="0.1"
                          value={typeof inputValue === 'number' ? inputValue : ''}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            setAnalysisValues((prev) => ({
                              ...prev,
                              [nutrientKey]: value === '' ? undefined : Number.parseFloat(value) || 0,
                            }));
                          }}
                          className="w-32 border border-slate-300 rounded px-2 py-1"
                        />
                        <span className="ms-2 text-xs text-slate-500">
                          {analysisItem?.unit || row?.totalUnit || ''}
                        </span>
                      </td>
                      <td className="border border-slate-300 px-2 py-1">
                        <div className="font-medium">{statusLabel(analysisItem?.status || 'NA', t)}</div>
                        <div className="text-xs text-slate-600">
                          {analysisItem?.message || '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.summaryTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="border border-slate-300 rounded p-3 space-y-1">
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

            <div className="border border-slate-300 rounded p-3 space-y-1">
              <p className="font-semibold">{t.analysisTitle}</p>
              <p>
                {t.analysisStatus}:{' '}
                <strong>
                  {statusLabel(results.analysis.overallStatus, t)}
                </strong>
              </p>
              {results.analysis.items.map((item) => (
                <p key={item.nutrient} className="text-xs text-slate-700">
                  {nutrientLabel(item.nutrient, lang)}: {t.analysisAdvice} {item.message}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.planTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-300">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
            <div className="border border-slate-300 rounded p-3 space-y-1">
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

            <div className="border border-slate-300 rounded p-3 space-y-2">
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

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6 text-xs text-slate-600 space-y-1">
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
