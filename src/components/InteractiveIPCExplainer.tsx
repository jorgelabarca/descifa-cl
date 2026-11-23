import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Layers,
  RotateCcw,
  ShoppingBasket,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import {
  IPC_CALCULATION_STEPS,
  IPC_DIVISIONS,
  IPC_MYTHS,
  IpcDivision,
} from '../data/articles';
import { BasketSketchIcon, VideoPreviewWindow } from './EditorialIllustrations';

const AVERAGE_HOUSEHOLD_WEIGHTS = {
  alimentos: 22,
  vivienda: 17,
  transporte: 14,
  salud: 8,
  otros: 39,
};

const SIMULATOR_CATEGORIES = [
  { key: 'alimentos', label: 'Alimentos y bebidas', monthlyVar: 0.6, color: '#9E5A63' },
  { key: 'vivienda', label: 'Arriendo, luz y gas', monthlyVar: 0.9, color: '#7A8B74' },
  { key: 'transporte', label: 'Transporte y bencina', monthlyVar: 0.3, color: '#64798A' },
  { key: 'salud', label: 'Salud y remedios', monthlyVar: 0.2, color: '#8E9B77' },
  { key: 'otros', label: 'Otros (ocio, ropa, educación)', monthlyVar: -0.1, color: '#B87462' },
] as const;

interface InteractiveIPCExplainerProps {
  onOpenUfArticle?: () => void;
}

export const InteractiveIPCExplainer: React.FC<InteractiveIPCExplainerProps> = ({
  onOpenUfArticle,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<IpcDivision>(IPC_DIVISIONS[0]);
  const [simulatorMode, setSimulatorMode] = useState<'promedio' | 'personal'>('promedio');
  const [spending, setSpending] = useState(AVERAGE_HOUSEHOLD_WEIGHTS);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [simulatedMonthlyIpc, setSimulatedMonthlyIpc] = useState(0.4);
  const [mythAnswers, setMythAnswers] = useState<Record<string, boolean | null>>({});

  const totalSpendingPoints =
    spending.alimentos + spending.vivienda + spending.transporte + spending.salud + spending.otros;

  const personalIpc = useMemo(() => {
    if (totalSpendingPoints === 0) return 0;
    const weightedSum =
      spending.alimentos * 0.6 +
      spending.vivienda * 0.9 +
      spending.transporte * 0.3 +
      spending.salud * 0.2 +
      spending.otros * -0.1;
    return weightedSum / totalSpendingPoints;
  }, [spending, totalSpendingPoints]);

  const nationalIpc = 0.36;
  const baseUf = 38200;
  const ufDelta = Math.round(baseUf * (simulatedMonthlyIpc / 100));
  const nextUf = baseUf + ufDelta;
  const rentInUf = 12;

  const selectSimulatorMode = (mode: 'promedio' | 'personal') => {
    setSimulatorMode(mode);
    if (mode === 'promedio') {
      setSpending(AVERAGE_HOUSEHOLD_WEIGHTS);
    }
  };

  const updateCategoryWeight = (key: keyof typeof spending, value: number) => {
    setSimulatorMode('personal');
    setSpending((prev) => ({ ...prev, [key]: value }));
  };

  const activeStep = IPC_CALCULATION_STEPS[activeStepIndex];

  return (
    <div className="mt-10 space-y-14">
      {/* SECCIÓN 01: EXPLORADOR DE LA CANASTA */}
      <section id="canasta" aria-labelledby="heading-canasta" className="scroll-mt-24 border-t border-[#D9CEBF] pt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BasketSketchIcon className="hidden h-14 w-16 shrink-0 sm:block" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#9E5A63]">
                01 · La canasta del IPC por dentro
              </span>
              <h2 id="heading-canasta" className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]">
                ¿Qué productos mide la canasta y cuánto pesa cada uno?
              </h2>
            </div>
          </div>
          <span className="text-xs text-[#6E645C]">Haz click en cualquier división de la canasta para explorar</span>
        </div>

        <p className="mb-6 max-w-3xl font-display text-base leading-relaxed text-[#4A423C]">
          Para calcular cuánto sube el costo de la vida, el INE sigue mensualmente los precios de una{' '}
          <strong className="font-semibold text-[#2A2522]">canasta familiar</strong> compuesta por cerca de 283 productos
          y servicios organizados en 12 divisiones. Como no gastamos lo mismo en pan que en entradas al cine, cada grupo
          dentro de esta canasta recibe un peso distinto.
        </p>

        <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#6E645C]">
            <span>Distribución de la canasta del IPC (100% del gasto típico)</span>
            <span className="font-mono tabular-nums">12 divisiones</span>
          </div>
          <div
            className="flex h-9 w-full overflow-hidden rounded-lg border border-[#D2C6B7]"
            role="tablist"
            aria-label="Divisiones de la canasta del IPC"
          >
            {IPC_DIVISIONS.map((div) => {
              const isSelected = selectedDivision.id === div.id;
              return (
                <button
                  key={div.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedDivision(div)}
                  title={`${div.name}: ${div.weight}%`}
                  style={{ width: `${div.weight}%`, backgroundColor: div.color }}
                  className={`relative h-full transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A2522] ${
                    isSelected ? 'opacity-100 ring-2 ring-inset ring-[#2A2522]' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="sr-only">{div.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {IPC_DIVISIONS.map((div) => {
              const isSelected = selectedDivision.id === div.id;
              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => setSelectedDivision(div)}
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'border-[#2A2522] bg-[#2A2522] text-[#FAF6F0]'
                      : 'border-[#DDD2C4] bg-[#F5EFE6] text-[#3E3732] hover:border-[#B9AA98] hover:bg-[#EFE6D8]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: div.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate font-medium">{div.shortName}</span>
                  </span>
                  <span className="shrink-0 font-mono tabular-nums font-semibold">{div.weight}%</span>
                </button>
              );
            })}
          </div>

          <div
            className="mt-5 rounded-xl border p-5 transition-colors"
            style={{
              backgroundColor: selectedDivision.lightBg,
              borderColor: `${selectedDivision.color}55`,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: selectedDivision.textColor }}
                >
                  <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
                  <span>División seleccionada</span>
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-[#2A2522]">
                  {selectedDivision.name}
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-[#625A54]">Peso en la canasta</div>
                  <div className="font-mono text-2xl font-bold tabular-nums text-[#2A2522]">
                    {selectedDivision.weight.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#625A54]">Ejemplo variación mes</div>
                  <div
                    className={`flex items-center gap-1 font-mono text-xl font-bold tabular-nums ${
                      selectedDivision.monthlyChange >= 0 ? 'text-[#9E5A63]' : 'text-[#5A7053]'
                    }`}
                  >
                    {selectedDivision.monthlyChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {selectedDivision.monthlyChange > 0 ? '+' : ''}
                      {selectedDivision.monthlyChange.toFixed(1)}%
                    </span>
                    <span className="ml-1 font-sans text-xs font-medium">
                      {selectedDivision.monthlyChange >= 0 ? '(Subida)' : '(Baja)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 border-t border-[#2A2522]/10 pt-4 md:grid-cols-2">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[#5D534B]">
                  Ejemplos concretos que mide el INE
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm text-[#2A2522]">
                  {selectedDivision.products.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: selectedDivision.color }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[#5D534B]">
                  ¿Por qué cambian sus precios?
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[#3E3732]">
                  {selectedDivision.whyItChanges}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 02: SIMULADOR DE IPC PERSONAL */}
      <section id="simulador" aria-labelledby="heading-simulador" className="scroll-mt-24 border-t border-[#D9CEBF] pt-10">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B87462]">
            02 · Simulador interactivo
          </span>
          <h2 id="heading-simulador" className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]">
            ¿Por qué tu bolsillo siente un IPC distinto al promedio?
          </h2>
        </div>

        <p className="mb-5 max-w-2xl font-display text-base leading-relaxed text-[#4A423C]">
          Compara el cálculo real del hogar promedio oficial con tu propia estructura de gasto moviendo los controles.
        </p>

        <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-[#EBE1D2] p-1">
              <button
                type="button"
                onClick={() => selectSimulatorMode('promedio')}
                className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  simulatorMode === 'promedio'
                    ? 'bg-[#FAF6F0] text-[#2A2522] shadow-xs'
                    : 'text-[#5D534B] hover:text-[#2A2522]'
                }`}
              >
                Hogar promedio (cálculo real)
              </button>
              <button
                type="button"
                onClick={() => selectSimulatorMode('personal')}
                className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  simulatorMode === 'personal'
                    ? 'bg-[#FAF6F0] text-[#2A2522] shadow-xs'
                    : 'text-[#5D534B] hover:text-[#2A2522]'
                }`}
              >
                Tu IPC personal
              </button>
            </div>
            <button
              type="button"
              onClick={() => selectSimulatorMode('promedio')}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[#D2C6B7] bg-[#F5EFE6] px-3 py-1.5 text-xs font-medium text-[#4A423C] hover:bg-[#EAE0D0]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Restablecer</span>
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              {SIMULATOR_CATEGORIES.map((cat) => {
                const rawVal = spending[cat.key];
                const share = totalSpendingPoints > 0 ? Math.round((rawVal / totalSpendingPoints) * 100) : 0;
                return (
                  <div key={cat.key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <label htmlFor={`slider-${cat.key}`} className="font-medium text-[#2A2522]">
                        {cat.label}
                      </label>
                      <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                        <span className="text-[#6E645C]">
                          Var. mes: {cat.monthlyVar > 0 ? '+' : ''}
                          {cat.monthlyVar.toFixed(1)}%
                        </span>
                        <span className="font-semibold text-[#2A2522]">
                          {share}% {simulatorMode === 'promedio' ? 'hogar promedio' : 'de tu gasto'}
                        </span>
                      </div>
                    </div>
                    <input
                      id={`slider-${cat.key}`}
                      type="range"
                      min={0}
                      max={60}
                      step={1}
                      value={rawVal}
                      onChange={(e) => updateCategoryWeight(cat.key, Number(e.target.value))}
                      style={{ accentColor: cat.color }}
                      className="h-2 w-full cursor-pointer rounded-lg bg-[#E0D6C8]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-[#D9CEBF] bg-[#F5EFE6] p-5 lg:col-span-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5D534B]">
                  <TrendingUp className="h-4 w-4 text-[#9E5A63]" aria-hidden="true" />
                  <span>Resultado estimado del mes</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-[#D9CEBF] bg-[#FAF6F0] p-3.5">
                    <div className="text-xs text-[#6E645C]">Tu IPC personal</div>
                    <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#9E5A63]">
                      {personalIpc >= 0 ? '+' : ''}
                      {personalIpc.toFixed(2)}%
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#D9CEBF] bg-[#FAF6F0] p-3.5">
                    <div className="text-xs text-[#6E645C]">Hogar promedio</div>
                    <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#64798A]">
                      +{nationalIpc.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs font-medium text-[#3E3732]">
                      <span>Tu bolsillo</span>
                      <span className="font-mono tabular-nums">{personalIpc.toFixed(2)}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-[#E0D6C8]">
                      <div
                        className="h-full rounded-full bg-[#9E5A63] transition-transform"
                        style={{
                          width: `${Math.min(100, Math.max(8, (Math.abs(personalIpc) / 0.9) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs font-medium text-[#3E3732]">
                      <span>Canasta oficial</span>
                      <span className="font-mono tabular-nums">{nationalIpc.toFixed(2)}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-[#E0D6C8]">
                      <div
                        className="h-full rounded-full bg-[#64798A]"
                        style={{ width: `${(nationalIpc / 0.9) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-5 border-t border-[#D9CEBF] pt-3 text-xs leading-relaxed text-[#5D534B]">
                {personalIpc > nationalIpc + 0.04
                  ? 'Tu inflación estimada supera el promedio nacional porque destinas mayor proporción a categorías con alzas recientes (como alimentos o cuentas del hogar).'
                  : personalIpc < nationalIpc - 0.04
                  ? 'Tu inflación estimada es menor al promedio nacional por un menor peso en los rubros que más subieron este mes.'
                  : 'Tu patrón de consumo sigue muy de cerca la estructura de la canasta nacional promedio.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 03: METODOLOGÍA PASO A PASO */}
      <section id="metodologia" aria-labelledby="heading-metodologia" className="scroll-mt-24 border-t border-[#D9CEBF] pt-10">
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8B74]">
            03 · Del mercado al dato oficial
          </span>
          <h2 id="heading-metodologia" className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]">
            Cómo se calcula el IPC en 4 pasos
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {IPC_CALCULATION_STEPS.map((item, idx) => {
            const active = activeStepIndex === idx;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? 'border-[#2A2522] bg-[#2A2522] text-[#FAF6F0]'
                    : 'border-[#D9CEBF] bg-[#FAF5EC] text-[#2A2522] hover:border-[#B9AA98]'
                }`}
              >
                <div>
                  <span
                    className="inline-block font-mono text-xs font-bold"
                    style={{ color: active ? '#DEC1C2' : item.color }}
                  >
                    Paso {item.step}
                  </span>
                  <h3 className="mt-1.5 font-display text-base font-bold leading-snug">{item.title}</h3>
                </div>
                <p className={`mt-2 text-xs leading-relaxed ${active ? 'text-[#D9CEBF]' : 'text-[#625A54]'}`}>
                  {item.summary}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5">
          <div className="flex items-start gap-3">
            <Layers className="mt-0.5 h-5 w-5 shrink-0" style={{ color: activeStep.color }} aria-hidden="true" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[#6E645C]">
                Detalle del paso {activeStep.step}
              </div>
              <h3 className="mt-0.5 font-display text-lg font-bold text-[#2A2522]">{activeStep.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4A423C]">{activeStep.detail}</p>
            </div>
          </div>
        </div>

        <VideoPreviewWindow />
      </section>

      {/* SECCIÓN 04: EL SALTO DEL IPC A LA UF */}
      <section id="uf-conexion" aria-labelledby="heading-uf" className="scroll-mt-24 border-t border-[#D9CEBF] pt-10">
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#64798A]">
            04 · Efecto directo en tu bolsillo
          </span>
          <h2 id="heading-uf" className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]">
            ¿Cómo mueve el IPC el valor de la UF?
          </h2>
        </div>

        <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#2A2522]">
                <Calculator className="h-4 w-4 text-[#9E5A63]" aria-hidden="true" />
                <span>Simula la variación mensual del IPC</span>
              </div>
              <p className="mt-1 text-sm text-[#625A54]">
                Cada décima que sube el IPC se traslada al valor diario de la UF durante los siguientes 30 días.
              </p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <label htmlFor="uf-ipc-slider" className="font-medium text-[#2A2522]">
                    Variación IPC del mes
                  </label>
                  <span className="font-mono text-lg font-bold tabular-nums text-[#9E5A63]">
                    {simulatedMonthlyIpc > 0 ? '+' : ''}
                    {simulatedMonthlyIpc.toFixed(1)}%
                  </span>
                </div>
                <input
                  id="uf-ipc-slider"
                  type="range"
                  min={-0.3}
                  max={1.2}
                  step={0.1}
                  value={simulatedMonthlyIpc}
                  onChange={(e) => setSimulatedMonthlyIpc(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer rounded-lg bg-[#E0D6C8] accent-[#9E5A63]"
                />
                <div className="mt-1 flex justify-between font-mono text-xs text-[#7D7268]">
                  <span>-0.3%</span>
                  <span>0.0%</span>
                  <span>+0.6%</span>
                  <span>+1.2%</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
              <div className="rounded-xl border border-[#DEC1C2] bg-[#F6ECEB] p-4">
                <div className="text-xs font-medium text-[#6E363E]">Nueva UF estimada (base $38.200)</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#2A2522]">
                  ${nextUf.toLocaleString('es-CL')}
                </div>
                <div className="mt-1 font-mono text-xs font-semibold tabular-nums text-[#9E5A63]">
                  {ufDelta >= 0 ? '+' : ''}${ufDelta.toLocaleString('es-CL')} por UF en el mes
                </div>
              </div>

              <div className="rounded-xl border border-[#D9CEBF] bg-[#F5EFE6] p-4">
                <div className="text-xs font-medium text-[#5D534B]">Impacto en arriendo de 12 UF</div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-[#2A2522]">
                  ${(nextUf * rentInUf).toLocaleString('es-CL')}
                </div>
                <div className="mt-1 font-mono text-xs font-semibold tabular-nums text-[#4A423C]">
                  Diferencia: {ufDelta >= 0 ? '+' : ''}${(ufDelta * rentInUf).toLocaleString('es-CL')} / mes
                </div>
              </div>
            </div>
          </div>

          {onOpenUfArticle && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4DACB] pt-4">
              <p className="text-xs text-[#5D534B]">
                ¿Quieres ver el valor oficial de hoy y cómo subió la UF durante el último año?
              </p>
              <button
                type="button"
                onClick={onOpenUfArticle}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold text-[#9E5A63] underline-offset-4 hover:underline"
              >
                <span>Ir al especial de la UF</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN 05: MITO O REALIDAD */}
      <section id="mitos" aria-labelledby="heading-mitos" className="scroll-mt-24 border-t border-[#D9CEBF] pt-10">
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E5A63]">
            05 · Pon a prueba lo aprendido
          </span>
          <h2 id="heading-mitos" className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]">
            Mito o realidad sobre el IPC
          </h2>
        </div>

        <div className="space-y-4">
          {IPC_MYTHS.map((myth) => {
            const userChoice = mythAnswers[myth.id] ?? null;
            const answered = userChoice !== null;
            const isCorrect = answered && userChoice === myth.isTrue;

            return (
              <div key={myth.id} className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#8D8177]" aria-hidden="true" />
                    <p className="font-display text-base font-semibold text-[#2A2522]">{myth.statement}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMythAnswers((prev) => ({ ...prev, [myth.id]: false }))}
                      className={`whitespace-nowrap shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${
                        userChoice === false
                          ? 'border-[#2A2522] bg-[#2A2522] text-[#FAF6F0]'
                          : 'border-[#D2C6B7] bg-[#F5EFE6] text-[#3E3732] hover:bg-[#EAE0D0]'
                      }`}
                    >
                      Mito
                    </button>
                    <button
                      type="button"
                      onClick={() => setMythAnswers((prev) => ({ ...prev, [myth.id]: true }))}
                      className={`whitespace-nowrap shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${
                        userChoice === true
                          ? 'border-[#2A2522] bg-[#2A2522] text-[#FAF6F0]'
                          : 'border-[#D2C6B7] bg-[#F5EFE6] text-[#3E3732] hover:bg-[#EAE0D0]'
                      }`}
                    >
                      Realidad
                    </button>
                  </div>
                </div>

                {answered && (
                  <div
                    className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3.5 text-sm ${
                      isCorrect
                        ? 'border-[#B6C5AF] bg-[#EEF2EC] text-[#2B3727]'
                        : 'border-[#DEC1C2] bg-[#F6ECEB] text-[#4E2328]'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5D7356]" aria-hidden="true" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#9E5A63]" aria-hidden="true" />
                    )}
                    <div>
                      <span className="font-bold">
                        {isCorrect ? '¡Correcto!' : 'Ojo con el dato:'} Es {myth.answerLabel}.{' '}
                      </span>
                      <span>{myth.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
