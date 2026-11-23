import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  Calendar,
  Pause,
  Play,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import {
  UF_NEARBY_DAYS,
  UF_TODAY,
  UF_YEARLY_SERIES,
} from '../data/articles';

const formatClp = (amount: number, decimals = 2): string =>
  amount.toLocaleString('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const formatRoundedClp = (amount: number): string =>
  Math.round(amount).toLocaleString('es-CL');

type IpcScenarioKey = 'positivo' | 'cero' | 'negativo';

const IPC_SCENARIOS: Record<
  IpcScenarioKey,
  {
    label: string;
    ipcRate: number;
    dailyPesos: number;
    monthlyPesos: number;
    tone: string;
    bg: string;
    border: string;
    explanation: string;
  }
> = {
  positivo: {
    label: 'IPC +0,5%',
    ipcRate: 0.5,
    dailyPesos: 6.88,
    monthlyPesos: 206.96,
    tone: '#9E5A63',
    bg: '#F6ECEB',
    border: '#DEC1C2',
    explanation:
      'Cuando los precios suben un 0,5% en el mes, la UF reparte ese porcentaje en 30 cuotas diarias parejas: cerca de +$6,88 cada día entre el 10 y el 9.',
  },
  cero: {
    label: 'IPC 0,0%',
    ipcRate: 0.0,
    dailyPesos: 0,
    monthlyPesos: 0,
    tone: '#64798A',
    bg: '#ECF1F4',
    border: '#C5D2DC',
    explanation:
      'Si el IPC marca 0,0% (como ocurrió hacia diciembre de 2025, cuando la UF quedó fija en $39.697,26), la UF se congela por completo durante todo ese ciclo.',
  },
  negativo: {
    label: 'IPC -0,2%',
    ipcRate: -0.2,
    dailyPesos: -2.76,
    monthlyPesos: -82.78,
    tone: '#485643',
    bg: '#EEF2EC',
    border: '#B6C5AF',
    explanation:
      'Aunque es menos frecuente, cuando el IPC mensual es negativo la UF también retrocede unos pesos cada día durante los 30 días siguientes.',
  },
};

export const InteractiveUFExplainer: React.FC = () => {
  // Active index in UF_YEARLY_SERIES (defaults to the latest point: Nov 2026)
  const [selectedIndex, setSelectedIndex] = useState<number>(UF_YEARLY_SERIES.length - 1);
  const [compareFromIndex, setCompareFromIndex] = useState<number>(0); // 0 = Nov 2025
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Scenario explorer for "Why does it rise daily?"
  const [scenario, setScenario] = useState<IpcScenarioKey>('positivo');

  // Pocket calculator state
  const [ufAmount, setUfAmount] = useState<number>(15);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev >= UF_YEARLY_SERIES.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 650);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (selectedIndex >= UF_YEARLY_SERIES.length - 1) {
      setSelectedIndex(compareFromIndex);
    }
    setIsPlaying(true);
  };

  const handleResetVisualizer = () => {
    setIsPlaying(false);
    setCompareFromIndex(0);
    setSelectedIndex(UF_YEARLY_SERIES.length - 1);
  };

  const handleSelectBaseMonth = (baseIdx: number) => {
    setIsPlaying(false);
    setCompareFromIndex(baseIdx);
    if (selectedIndex < baseIdx) {
      setSelectedIndex(UF_YEARLY_SERIES.length - 1);
    }
  };

  const activePoint = UF_YEARLY_SERIES[selectedIndex];
  const basePoint = UF_YEARLY_SERIES[compareFromIndex];
  const prevPoint = selectedIndex > 0 ? UF_YEARLY_SERIES[selectedIndex - 1] : null;

  const diffFromBase = activePoint.value - basePoint.value;
  const pctFromBase = (diffFromBase / basePoint.value) * 100;
  const monthDelta = prevPoint ? activePoint.value - prevPoint.value : 0;
  const monthDeltaPct = prevPoint ? (monthDelta / prevPoint.value) * 100 : 0;

  // Full 12-month headline stats (Nov 2025 -> Nov 2026)
  const fullYearDelta = UF_TODAY.value - UF_TODAY.yearlyBaseValue;
  const fullYearPct = (fullYearDelta / UF_TODAY.yearlyBaseValue) * 100;

  // Chart geometry (SVG coordinate system)
  const chart = useMemo(() => {
    const width = 760;
    const height = 270;
    const padLeft = 64;
    const padRight = 24;
    const padTop = 24;
    const padBottom = 42;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const minVal = 39500;
    const maxVal = 41550;

    const coords = UF_YEARLY_SERIES.map((pt, idx) => {
      const x = padLeft + (idx / (UF_YEARLY_SERIES.length - 1)) * plotW;
      const y = padTop + (1 - (pt.value - minVal) / (maxVal - minVal)) * plotH;
      return { ...pt, x, y, idx };
    });

    const fullPath = coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(' ');

    const activeSlice = coords.slice(compareFromIndex, selectedIndex + 1);
    const activeLinePath =
      activeSlice.length > 0
        ? activeSlice
            .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
            .join(' ')
        : '';

    const activeAreaPath =
      activeSlice.length > 1
        ? `${activeLinePath} L ${activeSlice[activeSlice.length - 1].x.toFixed(1)} ${(
            padTop + plotH
          ).toFixed(1)} L ${activeSlice[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
        : '';

    const gridTicks = [39500, 40000, 40500, 41000, 41500].map((val) => ({
      val,
      y: padTop + (1 - (val - minVal) / (maxVal - minVal)) * plotH,
    }));

    return {
      width,
      height,
      padTop,
      plotH,
      coords,
      fullPath,
      activeLinePath,
      activeAreaPath,
      gridTicks,
    };
  }, [compareFromIndex, selectedIndex]);

  const activeScenario = IPC_SCENARIOS[scenario];
  const pocketToday = ufAmount * UF_TODAY.value;
  const pocketNov2025 = ufAmount * UF_TODAY.yearlyBaseValue;
  const pocketYearDiff = pocketToday - pocketNov2025;

  return (
    <div className="mt-10 space-y-14">
      {/* SECCIÓN 01: VALOR DE LA UF HOY */}
      <section
        id="valor-hoy"
        aria-labelledby="heading-valor-hoy"
        className="scroll-mt-24 border-t border-[#D9CEBF] pt-8"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B87462]">
              01 · Dato oficial vigente
            </span>
            <h2
              id="heading-valor-hoy"
              className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]"
            >
              ¿Cuánto vale la UF hoy?
            </h2>
          </div>
          <span className="text-xs text-[#6E645C]">
            Fuente: Banco Central / SII · {UF_TODAY.dateLabel}
          </span>
        </div>

        <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Hero Today Number */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E5A63]">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Valor oficial hoy · {UF_TODAY.dateLabel}</span>
              </div>

              <div className="mt-2 font-mono text-4xl font-bold tracking-tight text-[#2A2522] tabular-nums sm:text-5xl">
                ${formatClp(UF_TODAY.value)}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#9E5A63] tabular-nums">
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  +${formatClp(UF_TODAY.dailyDelta)} hoy
                </span>
                <span className="text-[#C7BAAB]" aria-hidden="true">
                  ·
                </span>
                <span className="font-mono font-semibold text-[#5D7356] tabular-nums">
                  +${formatClp(fullYearDelta)} ({`+${fullYearPct.toFixed(2)}%`}) en 12 meses
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#4A423C]">
                Cada día del actual ciclo (del 10 de noviembre al 9 de diciembre) la UF avanza alrededor de{' '}
                <strong className="font-mono font-semibold text-[#2A2522]">+$6,88 diarios</strong> hasta cerrar noviembre en{' '}
                <strong className="font-mono font-semibold text-[#2A2522]">${formatClp(UF_TODAY.monthEndValue)}</strong>.
              </p>
            </div>

            {/* Daily Step Calendar Strip */}
            <div className="rounded-xl border border-[#D9CEBF] bg-[#F5EFE6] p-4 lg:col-span-6">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[#5D534B]">
                <span>Avance diario en torno a hoy</span>
                <span className="font-mono normal-case text-[#7D7268]">Pesos por 1 UF</span>
              </div>
              <div className="divide-y divide-[#E2D8CA]">
                {UF_NEARBY_DAYS.map((day) => (
                  <div
                    key={day.dateLabel}
                    className={`flex items-center justify-between gap-3 py-2.5 px-2.5 rounded-md ${
                      day.isToday ? 'bg-[#F6ECEB] font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          day.isToday ? 'bg-[#9E5A63]' : 'bg-[#C7BAAB]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className={day.isToday ? 'text-[#2A2522]' : 'text-[#4A423C]'}>
                        {day.dateLabel}
                      </span>
                      {day.note && (
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wide ${
                            day.isToday ? 'text-[#9E5A63]' : 'text-[#7D7268]'
                          }`}
                        >
                          · {day.note}
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono text-sm tabular-nums ${
                        day.isToday ? 'font-bold text-[#9E5A63]' : 'text-[#2A2522]'
                      }`}
                    >
                      ${formatClp(day.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 02: VISUALIZADOR ACTIVO DEL ÚLTIMO AÑO (NOV 2025 -> NOV 2026) */}
      <section
        id="visualizador-uf"
        aria-labelledby="heading-visualizador-uf"
        className="scroll-mt-24 border-t border-[#D9CEBF] pt-10"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9E5A63]">
              02 · Visualizador activo (últimos 12 meses)
            </span>
            <h2
              id="heading-visualizador-uf"
              className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]"
            >
              ¿Cuánto ha subido la UF desde noviembre de 2025?
            </h2>
          </div>
          <span className="text-xs text-[#6E645C]">
            Haz click en cualquier mes, mueve la barra o reproduce la evolución
          </span>
        </div>

        <p className="mb-5 max-w-3xl font-display text-base leading-relaxed text-[#4A423C]">
          En el último año, la Unidad de Fomento pasó de{' '}
          <strong className="font-mono font-semibold text-[#2A2522]">$39.697,26</strong> (23 de noviembre de 2025) a{' '}
          <strong className="font-mono font-semibold text-[#2A2522]">$41.391,69</strong> hoy. Explora mes a mes cómo se
          fue acumulando ese aumento de <strong className="font-semibold text-[#9E5A63]">+$1.694,43 (+4,27%)</strong>.
        </p>

        <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5 sm:p-6">
          {/* Interactive Controls Bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E4DACB] pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg bg-[#9E5A63] px-3.5 py-2 text-xs font-semibold text-[#FAF6F0] transition-colors hover:bg-[#844850] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5A63]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    <span>Pausar recorrido</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    <span>Reproducir último año</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetVisualizer}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[#D2C6B7] bg-[#F5EFE6] px-3 py-2 text-xs font-medium text-[#4A423C] transition-colors hover:bg-[#EAE0D0]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Ver año completo</span>
              </button>
            </div>

            {/* Baseline Comparison Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-medium text-[#6E645C]">Comparar desde:</span>
              {[
                { label: 'Nov 2025 (1 año)', idx: 0 },
                { label: 'May 2026 (6 meses)', idx: 6 },
                { label: 'Ago 2026 (3 meses)', idx: 9 },
              ].map((opt) => {
                const isActive = compareFromIndex === opt.idx;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSelectBaseMonth(opt.idx)}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'border-[#2A2522] bg-[#2A2522] text-[#FAF6F0]'
                        : 'border-[#D9CEBF] bg-[#F5EFE6] text-[#4A423C] hover:bg-[#EAE0D0]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chart.width} ${chart.height}`}
              className="h-auto w-full min-w-[540px] select-none"
              role="img"
              aria-label="Gráfico interactivo de la evolución mensual de la UF desde noviembre de 2025 hasta noviembre de 2026"
            >
              <defs>
                <linearGradient id="uf-active-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B87462" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#B87462" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Currency Labels */}
              {chart.gridTicks.map((tick) => (
                <g key={tick.val}>
                  <line
                    x1={64}
                    y1={tick.y}
                    x2={chart.width - 24}
                    y2={tick.y}
                    stroke="#E4DACB"
                    strokeDasharray="3 4"
                    strokeWidth="1"
                  />
                  <text
                    x={56}
                    y={tick.y + 4}
                    textAnchor="end"
                    fill="#7D7268"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    ${tick.val.toLocaleString('es-CL')}
                  </text>
                </g>
              ))}

              {/* Subtle Full-Year Reference Track */}
              <path
                d={chart.fullPath}
                fill="none"
                stroke="#D9CEBF"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Active Highlighted Area & Curve */}
              {chart.activeAreaPath && (
                <path d={chart.activeAreaPath} fill="url(#uf-active-fill)" />
              )}
              {chart.activeLinePath && (
                <path
                  d={chart.activeLinePath}
                  fill="none"
                  stroke="#B87462"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Vertical Marker Line for Active Month */}
              <line
                x1={chart.coords[selectedIndex].x}
                y1={chart.padTop}
                x2={chart.coords[selectedIndex].x}
                y2={chart.padTop + chart.plotH}
                stroke="#9E5A63"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Baseline Start Marker */}
              <circle
                cx={chart.coords[compareFromIndex].x}
                cy={chart.coords[compareFromIndex].y}
                r={5}
                fill="#7A8B74"
                stroke="#FAF5EC"
                strokeWidth="2"
              />

              {/* Interactive Month Nodes & X-Axis Labels */}
              {chart.coords.map((pt) => {
                const isSelected = pt.idx === selectedIndex;
                const isInRange = pt.idx >= compareFromIndex && pt.idx <= selectedIndex;
                return (
                  <g
                    key={pt.id}
                    onClick={() => {
                      setIsPlaying(false);
                      if (pt.idx < compareFromIndex) {
                        setCompareFromIndex(0);
                      }
                      setSelectedIndex(pt.idx);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Invisible generous click target */}
                    <rect
                      x={pt.x - 24}
                      y={chart.padTop}
                      width={48}
                      height={chart.plotH + 34}
                      fill="transparent"
                    />

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 7 : isInRange ? 4.5 : 3.5}
                      fill={isSelected ? '#9E5A63' : isInRange ? '#FAF6F0' : '#E5DBCD'}
                      stroke={isSelected ? '#FAF6F0' : isInRange ? '#B87462' : '#B9AA98'}
                      strokeWidth={isSelected ? 2.5 : 2}
                    />

                    <text
                      x={pt.x}
                      y={chart.height - 14}
                      textAnchor="middle"
                      fill={isSelected ? '#9E5A63' : '#6E645C'}
                      fontSize="10.5"
                      fontWeight={isSelected ? '700' : '500'}
                      fontFamily="monospace"
                    >
                      {pt.monthShort}
                    </text>
                  </g>
                );
              })}

              {/* Floating Callout Value above Selected Point */}
              {(() => {
                const sel = chart.coords[selectedIndex];
                const boxW = 94;
                const clampedX = Math.min(Math.max(sel.x - boxW / 2, 66), chart.width - boxW - 10);
                const boxY = Math.max(4, sel.y - 34);
                return (
                  <g pointerEvents="none">
                    <rect
                      x={clampedX}
                      y={boxY}
                      width={boxW}
                      height={22}
                      rx={5}
                      fill="#2A2522"
                    />
                    <text
                      x={clampedX + boxW / 2}
                      y={boxY + 14.5}
                      textAnchor="middle"
                      fill="#FAF6F0"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="monospace"
                    >
                      ${formatClp(sel.value)}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Interactive Timeline Scrubber */}
          <div className="mt-3 px-1">
            <label htmlFor="uf-timeline-scrubber" className="sr-only">
              Deslizador temporal de la UF entre noviembre de 2025 y noviembre de 2026
            </label>
            <input
              id="uf-timeline-scrubber"
              type="range"
              min={compareFromIndex}
              max={UF_YEARLY_SERIES.length - 1}
              step={1}
              value={Math.max(compareFromIndex, selectedIndex)}
              onChange={(e) => {
                setIsPlaying(false);
                setSelectedIndex(Number(e.target.value));
              }}
              className="h-2 w-full cursor-pointer rounded-lg bg-[#E0D6C8] accent-[#9E5A63]"
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-[#7D7268]">
              <span>{basePoint.monthShort}</span>
              <span>Abr 26 (cruza $40 mil)</span>
              <span>Nov 26 (hoy)</span>
            </div>
          </div>

          {/* Live Selected Month Detail Panel */}
          <div className="mt-5 grid gap-4 rounded-xl border border-[#D9CEBF] bg-[#F5EFE6] p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs text-[#6E645C]">Fecha seleccionada</div>
              <div className="mt-0.5 font-display text-base font-bold text-[#2A2522]">
                {activePoint.dateLabel}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#9E5A63] tabular-nums">
                ${formatClp(activePoint.value)}
              </div>
            </div>

            <div>
              <div className="text-xs text-[#6E645C]">
                Aumento desde {basePoint.monthShort}
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-[#2A2522] tabular-nums">
                {diffFromBase >= 0 ? '+' : ''}${formatClp(diffFromBase)}
              </div>
              <div className="mt-0.5 font-mono text-xs font-semibold text-[#5D7356] tabular-nums">
                {pctFromBase >= 0 ? '+' : ''}
                {pctFromBase.toFixed(2)}% acumulado
              </div>
            </div>

            <div>
              <div className="text-xs text-[#6E645C]">Cambio frente al mes previo</div>
              <div className="mt-1 font-mono text-xl font-bold text-[#2A2522] tabular-nums">
                {prevPoint ? `${monthDelta >= 0 ? '+' : ''}$${formatClp(monthDelta)}` : 'Mes base'}
              </div>
              <div className="mt-0.5 font-mono text-xs text-[#6E645C] tabular-nums">
                {prevPoint
                  ? `${monthDeltaPct >= 0 ? '+' : ''}${monthDeltaPct.toFixed(2)}% mensual`
                  : 'Inicio de la serie'}
              </div>
            </div>

            <div>
              <div className="text-xs text-[#6E645C]">Ejemplo: pago de 15 UF</div>
              <div className="mt-1 font-mono text-xl font-bold text-[#2A2522] tabular-nums">
                ${formatRoundedClp(activePoint.value * 15)}
              </div>
              <div className="mt-0.5 font-mono text-xs text-[#9E5A63] tabular-nums">
                {diffFromBase >= 0 ? '+' : ''}${formatRoundedClp(diffFromBase * 15)} vs {basePoint.monthShort}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#5D534B]">
            <strong className="font-semibold text-[#2A2522]">Lectura del mes ({activePoint.monthShort}):</strong>{' '}
            {activePoint.note}
          </p>
        </div>
      </section>

      {/* SECCIÓN 03: ¿POR QUÉ SUBE TODOS LOS DÍAS? */}
      <section
        id="por-que-sube"
        aria-labelledby="heading-por-que-sube"
        className="scroll-mt-24 border-t border-[#D9CEBF] pt-10"
      >
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8B74]">
            03 · El mecanismo detrás del reajuste
          </span>
          <h2
            id="heading-por-que-sube"
            className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]"
          >
            ¿Por qué cambia todos los días y no una sola vez al mes?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5">
            <div className="font-mono text-xs font-bold text-[#9E5A63]">Paso 01 · El dato</div>
            <h3 className="mt-1 font-display text-lg font-bold text-[#2A2522]">
              El INE publica el IPC del mes
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4A423C]">
              Cada inicio de mes se conoce cuánto subieron o bajaron los precios durante el mes anterior. La UF toma ese
              porcentaje oficial como punto de referencia.
            </p>
          </div>

          <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5">
            <div className="font-mono text-xs font-bold text-[#B87462]">Paso 02 · El calendario</div>
            <h3 className="mt-1 font-display text-lg font-bold text-[#2A2522]">
              Del día 10 al día 9 siguiente
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4A423C]">
              En lugar de dar un salto brusco de cientos de pesos un solo día, el Banco Central reparte ese porcentaje en
              alzas o bajas parejas cada jornada entre el 10 y el 9.
            </p>
          </div>

          <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5">
            <div className="font-mono text-xs font-bold text-[#64798A]">Paso 03 · El sentido</div>
            <h3 className="mt-1 font-display text-lg font-bold text-[#2A2522]">
              Evitar saltos en los contratos
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4A423C]">
              Así, firmar un contrato, pagar un dividendo o cobrar una boleta el día 14 o el día 28 refleja el ajuste
              proporcional exacto sin distorsiones de fin de mes.
            </p>
          </div>
        </div>

        {/* Interactive 3-scenario test: Can the UF stop or fall? */}
        <div className="mt-5 rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-[#2A2522]">
                ¿La UF siempre sube? Prueba qué pasa según el IPC
              </h3>
              <p className="mt-0.5 text-xs text-[#625A54]">
                Selecciona un escenario mensual de inflación para ver cómo reacciona el valor diario de la UF.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 rounded-lg bg-[#EBE1D2] p-1">
              {(Object.keys(IPC_SCENARIOS) as IpcScenarioKey[]).map((key) => {
                const item = IPC_SCENARIOS[key];
                const active = scenario === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setScenario(key)}
                    className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#FAF6F0] text-[#2A2522] shadow-xs'
                        : 'text-[#5D534B] hover:text-[#2A2522]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="mt-4 grid gap-4 rounded-xl border p-4 sm:grid-cols-12 sm:items-center"
            style={{
              backgroundColor: activeScenario.bg,
              borderColor: activeScenario.border,
            }}
          >
            <div className="sm:col-span-5 flex items-center gap-4">
              <div className="rounded-lg border border-[#2A2522]/10 bg-[#FAF6F0] px-3.5 py-2.5">
                <div className="text-[11px] text-[#6E645C]">Variación diaria aprox.</div>
                <div
                  className="mt-0.5 flex items-center gap-1 font-mono text-xl font-bold tabular-nums"
                  style={{ color: activeScenario.tone }}
                >
                  {activeScenario.dailyPesos > 0 ? (
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : activeScenario.dailyPesos < 0 ? (
                    <ArrowDownRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : null}
                  <span>
                    {activeScenario.dailyPesos > 0 ? '+' : ''}
                    ${formatClp(activeScenario.dailyPesos)} / día
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[#6E645C]">En el ciclo (30 días)</div>
                <div className="font-mono text-base font-bold text-[#2A2522] tabular-nums">
                  {activeScenario.monthlyPesos > 0 ? '+' : ''}
                  ${formatClp(activeScenario.monthlyPesos)}
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#3E3732] sm:col-span-7">
              {activeScenario.explanation}
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 04: CALCULADORA DE BOLSILLO EN UF */}
      <section
        id="calculadora-uf"
        aria-labelledby="heading-calculadora-uf"
        className="scroll-mt-24 border-t border-[#D9CEBF] pt-10"
      >
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#64798A]">
            04 · Impacto real en tu presupuesto
          </span>
          <h2
            id="heading-calculadora-uf"
            className="mt-1 font-display text-2xl font-bold tracking-tight text-[#2A2522]"
          >
            Tu bolsillo en UF: ¿cuánto subió un monto en 12 meses?
          </h2>
        </div>

        <div className="rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#2A2522]">
                <Calculator className="h-4 w-4 text-[#9E5A63]" aria-hidden="true" />
                <span>Elige o ajusta una cantidad en UF</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: '1 UF', val: 1 },
                  { label: '4 UF · Isapre', val: 4 },
                  { label: '15 UF · Arriendo', val: 15 },
                  { label: '25 UF · Dividendo', val: 25 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setUfAmount(preset.val)}
                    className={`whitespace-nowrap shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      ufAmount === preset.val
                        ? 'border-[#2A2522] bg-[#2A2522] text-[#FAF6F0]'
                        : 'border-[#D9CEBF] bg-[#F5EFE6] text-[#3E3732] hover:bg-[#EAE0D0]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <label htmlFor="uf-pocket-slider" className="font-medium text-[#2A2522]">
                    Monto del compromiso mensual
                  </label>
                  <span className="font-mono text-lg font-bold text-[#9E5A63] tabular-nums">
                    {ufAmount} UF
                  </span>
                </div>
                <input
                  id="uf-pocket-slider"
                  type="range"
                  min={1}
                  max={60}
                  step={1}
                  value={ufAmount}
                  onChange={(e) => setUfAmount(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer rounded-lg bg-[#E0D6C8] accent-[#B87462]"
                />
                <div className="mt-1 flex justify-between font-mono text-xs text-[#7D7268]">
                  <span>1 UF</span>
                  <span>20 UF</span>
                  <span>40 UF</span>
                  <span>60 UF</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
              <div className="rounded-xl border border-[#D9CEBF] bg-[#F5EFE6] p-4">
                <div className="text-xs font-medium text-[#5D534B]">
                  En noviembre de 2025 ({ufAmount} UF)
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-[#2A2522] tabular-nums">
                  ${formatRoundedClp(pocketNov2025)}
                </div>
                <div className="mt-1 font-mono text-xs text-[#6E645C] tabular-nums">
                  UF base: ${formatClp(UF_TODAY.yearlyBaseValue)}
                </div>
              </div>

              <div className="rounded-xl border border-[#DEC1C2] bg-[#F6ECEB] p-4">
                <div className="text-xs font-medium text-[#6E363E]">
                  Hoy 23 nov 2026 ({ufAmount} UF)
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-[#2A2522] tabular-nums">
                  ${formatRoundedClp(pocketToday)}
                </div>
                <div className="mt-1 flex items-center gap-1 font-mono text-xs font-semibold text-[#9E5A63] tabular-nums">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>+${formatRoundedClp(pocketYearDiff)} al mes en 1 año</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
