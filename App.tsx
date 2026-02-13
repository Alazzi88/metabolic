import React, { useEffect, useMemo, useState } from 'react';
import { DiseaseType, TargetMode, CalculationInputs } from './types';
import { DISEASE_METADATA, GUIDELINES, UI_STRINGS } from './constants';
import { calculateDiet } from './calculators';

const TARGET_MODES: TargetMode[] = ['MIN', 'MID', 'MAX'];

function formatValue(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(decimals);
}

function formatRange(min: number, max: number, unit: string, decimals = 0): string {
  return `${min.toFixed(decimals)}-${max.toFixed(decimals)} ${unit}`;
}

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [inputs, setInputs] = useState<CalculationInputs>({
    weightKg: 4,
    disease: DiseaseType.PKU,
    ageGroupIndex: 0,
    targetMode: 'MID',
    feedsPerDay: 8,
  });

  const t = UI_STRINGS[lang];
  const currentGuide = GUIDELINES[inputs.disease][inputs.ageGroupIndex];
  const diseaseMeta = DISEASE_METADATA[inputs.disease][lang];
  const results = useMemo(() => calculateDiet(inputs), [inputs]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const requirementRows = useMemo(() => {
    const weight = Math.max(0, inputs.weightKg || 0);
    const rows: Array<{ nutrient: string; perKg: string; totalDay: string }> = [
      {
        nutrient: lang === 'ar' ? 'الطاقة' : 'Energy',
        perKg: formatRange(currentGuide.kcalPerKg.min, currentGuide.kcalPerKg.max, 'kcal/kg', 0),
        totalDay: formatRange(
          currentGuide.kcalPerKg.min * weight,
          currentGuide.kcalPerKg.max * weight,
          'kcal/day',
          0,
        ),
      },
      {
        nutrient: lang === 'ar' ? 'البروتين' : 'Protein',
        perKg: formatRange(currentGuide.proPerKg.min, currentGuide.proPerKg.max, 'g/kg', 2),
        totalDay: formatRange(
          currentGuide.proPerKg.min * weight,
          currentGuide.proPerKg.max * weight,
          'g/day',
          2,
        ),
      },
      {
        nutrient: lang === 'ar' ? 'السوائل' : 'Fluids',
        perKg: '150 ml/kg',
        totalDay: `${formatValue(weight * 150, 0)} ml/day`,
      },
    ];

    if (currentGuide.ucdPro) {
      rows.push(
        {
          nutrient: lang === 'ar' ? 'Intact Protein (UCD)' : 'Intact Protein (UCD)',
          perKg: formatRange(currentGuide.ucdPro.intact.min, currentGuide.ucdPro.intact.max, 'g/kg', 2),
          totalDay: formatRange(
            currentGuide.ucdPro.intact.min * weight,
            currentGuide.ucdPro.intact.max * weight,
            'g/day',
            2,
          ),
        },
        {
          nutrient: lang === 'ar' ? 'Medical Protein (UCD)' : 'Medical Protein (UCD)',
          perKg: formatRange(currentGuide.ucdPro.medical.min, currentGuide.ucdPro.medical.max, 'g/kg', 2),
          totalDay: formatRange(
            currentGuide.ucdPro.medical.min * weight,
            currentGuide.ucdPro.medical.max * weight,
            'g/day',
            2,
          ),
        },
      );
    }

    if (currentGuide.limits) {
      Object.entries(currentGuide.limits).forEach(([aa, range]) => {
        rows.push({
          nutrient: aa,
          perKg: formatRange(range.min, range.max, 'mg/kg', 0),
          totalDay: formatRange(range.min * weight, range.max * weight, 'mg/day', 0),
        });
      });
    }

    if (currentGuide.dailyLimits) {
      Object.entries(currentGuide.dailyLimits).forEach(([aa, range]) => {
        rows.push({
          nutrient: aa,
          perKg: '-',
          totalDay: formatRange(range.min, range.max, 'mg/day', 0),
        });
      });
    }

    return rows;
  }, [currentGuide, inputs.weightKg, lang]);

  const primaryLimiter = DISEASE_METADATA[inputs.disease].primaryLimiter;
  const primaryLimitUnit = inputs.disease === DiseaseType.UCD ? 'g/day' : 'mg/day';
  const primaryLimitDecimals = inputs.disease === DiseaseType.UCD ? 2 : 0;

  return (
    <div className={`min-h-screen bg-[#f6f6f3] text-slate-900 ${lang === 'ar' ? "font-['Tajawal']" : 'font-sans'}`}>
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <label className="text-sm">
              <span className="block mb-1">{t.diagnosis}</span>
              <select
                value={inputs.disease}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    disease: e.target.value as DiseaseType,
                    ageGroupIndex: 0,
                  }))
                }
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
                value={inputs.weightKg}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, weightKg: Number.parseFloat(e.target.value) || 0 }))
                }
                className="w-full border border-slate-300 rounded px-2 py-2"
              />
            </label>

            <label className="text-sm md:col-span-2">
              <span className="block mb-1">{t.ageGroup}</span>
              <select
                value={inputs.ageGroupIndex}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, ageGroupIndex: Number.parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full border border-slate-300 rounded px-2 py-2 bg-white"
              >
                {GUIDELINES[inputs.disease].map((guide, index) => (
                  <option key={guide.ageLabel} value={index}>
                    {guide.ageLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="block mb-1">{t.feedsPerDay}</span>
              <input
                type="number"
                min="1"
                value={inputs.feedsPerDay}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, feedsPerDay: Number.parseInt(e.target.value, 10) || 1 }))
                }
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
                  onClick={() => setInputs((prev) => ({ ...prev, targetMode: mode }))}
                  className={`px-4 py-1.5 text-sm border-e border-slate-300 last:border-e-0 ${
                    inputs.targetMode === mode ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  {mode === 'MIN' ? t.min : mode === 'MID' ? t.mid : t.max}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.requirementsTitle}</h2>
          <p className="text-sm text-slate-600 mb-3">{diseaseMeta.short} - {diseaseMeta.name}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-300">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.nutrient}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.perKg}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.totalDay}</th>
                </tr>
              </thead>
              <tbody>
                {requirementRows.map((row) => (
                  <tr key={`${row.nutrient}-${row.perKg}-${row.totalDay}`}>
                    <td className="border border-slate-300 px-2 py-1 font-medium">{row.nutrient}</td>
                    <td className="border border-slate-300 px-2 py-1" dir="ltr">{row.perKg}</td>
                    <td className="border border-slate-300 px-2 py-1" dir="ltr">{row.totalDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.resultsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="border border-slate-300 rounded p-3">
              <p>{t.targetEnergy}: <strong dir="ltr">{formatValue(results.targets.kcal, 0)} kcal/day</strong></p>
              <p>{t.targetProtein}: <strong dir="ltr">{formatValue(results.targets.protein, 2)} g/day</strong></p>
              <p>{t.targetFluids}: <strong dir="ltr">{formatValue(results.targets.fluids, 0)} ml/day</strong></p>
              <p>
                {t.primaryLimit} ({primaryLimiter}):{' '}
                <strong dir="ltr">
                  {formatValue(results.targets.limits[primaryLimiter] || 0, primaryLimitDecimals)} {primaryLimitUnit}
                </strong>
              </p>
            </div>

            <div className="border border-slate-300 rounded p-3">
              <p>{t.kcalFromBase}: <strong dir="ltr">{formatValue(results.analysis.kcalBeforeModular, 0)} kcal/day</strong></p>
              <p>{t.kcalDeficit}: <strong dir="ltr">{formatValue(results.analysis.kcalDeficit, 0)} kcal/day</strong></p>
              <p>{t.proteinDeficit}: <strong dir="ltr">{formatValue(results.analysis.proteinDeficitAfterStandard, 2)} g/day</strong></p>
              <p>{t.modularStatus}: <strong>{results.analysis.modularNeeded ? t.needed : t.notNeeded}</strong></p>
              <p>{t.modularToAdd}: <strong dir="ltr">{formatValue(results.recipe.modularG, 1)} g/day</strong></p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.formulaPlanTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-300">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.formulaType}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.gramsPerDay}</th>
                  <th className="border border-slate-300 px-2 py-1 text-start">{t.scoopsPerDay}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-2 py-1">{t.standard}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.standardG, 1)}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.standardScoops, 1)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-2 py-1">{t.special}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.specialG, 1)}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.specialScoops, 1)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-2 py-1">{t.modular}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.modularG, 1)}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.modularScoops, 1)}</td>
                </tr>
                <tr className="bg-slate-50 font-semibold">
                  <td className="border border-slate-300 px-2 py-1">{t.totalPowder}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.totalG, 1)}</td>
                  <td className="border border-slate-300 px-2 py-1" dir="ltr">{formatValue(results.recipe.totalScoops, 1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-slate-300 rounded-md p-4 md:p-6">
          <h2 className="font-bold mb-3">{t.prepTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="border border-slate-300 rounded p-3">
              <p>{t.totalVolume}</p>
              <p className="font-semibold" dir="ltr">{formatValue(results.recipe.totalVolume, 0)} ml/day</p>
            </div>
            <div className="border border-slate-300 rounded p-3">
              <p>{t.perFeedVolume}</p>
              <p className="font-semibold" dir="ltr">{formatValue(results.recipe.volumePerFeed, 0)} ml/feed</p>
            </div>
            <div className="border border-slate-300 rounded p-3">
              <p>{t.perFeedScoops}</p>
              <p className="font-semibold" dir="ltr">{formatValue(results.recipe.scoopsPerFeed, 1)} scoops/feed</p>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-slate-500 space-y-1 pb-8">
          <p>This website Developed By Yahya Alizzi</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
