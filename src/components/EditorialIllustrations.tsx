import React, { useState } from 'react';
import { Maximize2, Pause, Play, Subtitles, Volume2 } from 'lucide-react';
import { getAssetUrl } from '../utils/assetUrl';

export const WatercolorCornerAccents: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    {/* Top-left dusty rose & sand watercolor wash */}
    <svg
      className="absolute -left-24 -top-16 h-80 w-96 opacity-45"
      viewBox="0 0 400 320"
      fill="none"
    >
      <path
        d="M15,40 C75,-10 175,15 220,75 C255,120 205,195 140,210 C75,225 -10,170 5,95 Z"
        fill="#DEC1C2"
      />
      <path
        d="M120,10 C190,-15 295,18 310,85 C322,138 258,162 200,140 C150,120 90,55 120,10 Z"
        fill="#E9D7C3"
        opacity="0.7"
      />
    </svg>

    {/* Top-right dusty rose & sage wash */}
    <svg
      className="absolute -right-20 -top-10 h-72 w-96 opacity-40"
      viewBox="0 0 400 300"
      fill="none"
    >
      <path
        d="M90,20 C170,-15 290,10 355,65 C395,100 385,185 320,210 C255,235 165,175 115,125 C75,85 55,40 90,20 Z"
        fill="#DFC4C4"
      />
      <path
        d="M210,35 C270,15 365,45 385,125 C400,190 355,260 285,245 C225,232 185,150 210,35 Z"
        fill="#C9D0C3"
        opacity="0.6"
      />
    </svg>

    {/* Bottom-right botanical wash */}
    <svg
      className="absolute -bottom-16 -right-12 h-80 w-80 opacity-45"
      viewBox="0 0 320 320"
      fill="none"
    >
      <circle cx="235" cy="235" r="110" fill="#D4DBD0" opacity="0.6" />
      <circle cx="275" cy="145" r="72" fill="#E3C7C7" opacity="0.5" />
      {/* Subtle botanical stems */}
      <path d="M235,310 Q220,215 185,135" stroke="#7E8C77" strokeWidth="1.8" fill="none" />
      <path d="M220,245 Q175,220 162,195 Q195,200 220,245 Z" fill="#A6B39F" stroke="#6E7C67" strokeWidth="1" />
      <path d="M210,205 Q255,175 268,148 Q232,162 210,205 Z" fill="#A6B39F" stroke="#6E7C67" strokeWidth="1" />
      <path d="M196,170 Q152,145 142,118 Q175,130 196,170 Z" fill="#B7C2B0" stroke="#6E7C67" strokeWidth="1" />
    </svg>
  </div>
);

export const BasketSketchIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 96 84" className={className} fill="none" aria-hidden="true">
    {/* Soft watercolor backdrop blob */}
    <ellipse cx="48" cy="46" rx="34" ry="26" fill="#DCE2D7" opacity="0.7" />
    {/* Hand-sketched market basket */}
    <path
      d="M20 36 H76 L68 70 C67 73 64 75 60 75 H36 C32 75 29 73 28 70 L20 36 Z"
      fill="#B8C3B2"
      stroke="#5C6856"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M15 36 H81"
      stroke="#5C6856"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M34 36 L42 15 M62 36 L54 15"
      stroke="#5C6856"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Small items peeking out */}
    <circle cx="38" cy="29" r="5" fill="#D2A78D" stroke="#5C6856" strokeWidth="1.4" />
    <rect x="48" y="21" width="11" height="14" rx="2" fill="#DFC4C4" stroke="#5C6856" strokeWidth="1.4" />
    {/* Basket weave lines */}
    <line x1="36" y1="45" x2="38" y2="66" stroke="#FAF6F0" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="48" y1="45" x2="48" y2="66" stroke="#FAF6F0" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="60" y1="45" x2="58" y2="66" stroke="#FAF6F0" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UFEditorialIllustration: React.FC = () => {
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <figure className="relative w-full overflow-hidden rounded-xl border border-[#D9CEBF] bg-[#FAF5EC]">
      {!imgFailed ? (
        <img
          src={getAssetUrl('assets/aistudio/Ilustraci_n_editorial_sobre_la_UF_chilena_b75f89aa.png')}
          alt="Ilustración editorial en tinta y acuarela sobre la UF chilena: calendario de la UF, monedas apiladas, casa y edificio con bandera chilena, flecha al alza y joven reflexionando sobre el costo de vida"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="block h-auto w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center bg-[#EFE7DA] p-6 text-center text-sm text-[#6E645C]">
          <p className="font-display text-base font-medium text-[#2A2522]">
            La Unidad de Fomento (UF) y su impacto diario en Chile
          </p>
        </div>
      )}
      <figcaption className="border-t border-[#E4DACB] bg-[#FAF5EC]/95 px-4 py-2 text-xs italic text-[#6E645C]">
        Fig. 1 — La Unidad de Fomento traslada la variación del IPC del mes anterior a un ajuste diario que impacta arriendos, créditos y contratos.
      </figcaption>
    </figure>
  );
};

export const EditorialIllustration: React.FC<{ articleId?: string }> = ({ articleId = 'ipc' }) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  if (articleId === 'uf') {
    return <UFEditorialIllustration />;
  }

  return (
    <figure className="relative w-full overflow-hidden rounded-xl border border-[#D9CEBF] bg-[#FAF5EC]">
      {!imgFailed ? (
        <img
          src={getAssetUrl('assets/aistudio/Gemini_Generated_Image_eb7x8web7x8web7x_3a088f0f.jpg')}
          alt="Ilustración editorial en tinta y acuarela de una mujer revisando su boleta con bolsas de supermercado frente a una ciudad y un carrito de compras con el gráfico del IPC al alza"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="block h-auto w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center bg-[#EFE7DA] p-6 text-center text-sm text-[#6E645C]">
          <BasketSketchIcon className="h-16 w-20" />
          <p className="mt-2 font-display text-base font-medium text-[#2A2522]">
            El impacto cotidiano del IPC en la canasta del hogar
          </p>
        </div>
      )}
      <figcaption className="border-t border-[#E4DACB] bg-[#FAF5EC]/95 px-4 py-2 text-xs italic text-[#6E645C]">
        Fig. 1 — El efecto de la variación de precios en la canasta cotidiana de los hogares.
      </figcaption>
    </figure>
  );
};

export const VideoPreviewWindow: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="mt-6 rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#9E5A63]">
            Cápsula en video
          </span>
          <h3 className="mt-0.5 font-display text-lg font-bold text-[#2A2522]">
            Estacionalidad y ajuste mensual del IPC
          </h3>
        </div>
        <span className="font-mono text-xs text-[#6E645C] tabular-nums">Duración · 02:14</span>
      </div>

      {/* Video Player Window */}
      <div className="overflow-hidden rounded-xl border border-[#C9BCAE] bg-[#241F1C] shadow-md">
        <div className="relative aspect-[16/9] w-full bg-[#2A2522]">
          {!imgFailed ? (
            <img
              src={getAssetUrl('assets/aistudio/Gemini_Generated_Image_m64qb7m64qb7m64q_2e2a64ac.jpg')}
              alt="Vista previa de video con Aquiles Baeza explicando cómo el INE considera la estacionalidad de ciertos productos en el IPC"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#332B26] p-6 text-center text-[#FAF6F0]">
              <p className="font-display text-lg font-semibold">
                El INE considera la estacionalidad de ciertos productos
              </p>
              <span className="mt-1 text-xs text-[#D9CEBF]">Aquiles Baeza · Descifra.cl</span>
            </div>
          )}

          {/* Subtle center-left play trigger positioned clear of speaker & lower-third */}
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pausar vista previa de video' : 'Reproducir vista previa de video'}
            className="absolute left-1/2 top-[42%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#FAF6F0]/90 bg-[#9E5A63]/90 text-[#FAF6F0] shadow-xl transition-transform hover:scale-105 hover:bg-[#9E5A63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF6F0]"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-current" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
            )}
          </button>

          {/* Subtle playback state banner when clicked */}
          {isPlaying && (
            <div className="absolute right-3 top-3 rounded-md bg-[#241F1C]/85 px-2.5 py-1 text-[11px] font-medium text-[#FAF6F0]">
              Vista previa editorial
            </div>
          )}
        </div>

        {/* Classic Player Control Bar below frame so lower-third stays completely legible */}
        <div className="flex items-center gap-3 border-t border-[#3A322D] bg-[#241F1C] px-4 py-2.5 text-[#EFE7DA]">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className="rounded p-1 text-[#EFE7DA] transition-colors hover:bg-[#3A322D] hover:text-white"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            )}
          </button>

          <span className="font-mono text-[11px] text-[#D9CEBF] tabular-nums whitespace-nowrap">
            {isPlaying ? '00:18' : '00:00'} / 02:14
          </span>

          {/* Scrubber Track */}
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#4A403A]" aria-hidden="true">
            <div
              className="h-full rounded-full bg-[#9E5A63] transition-all duration-300"
              style={{ width: isPlaying ? '14%' : '4%' }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[#D9CEBF]">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label="Subtítulos"
              className="rounded p-1 transition-colors hover:bg-[#3A322D] hover:text-white"
            >
              <Subtitles className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label="Volumen"
              className="rounded p-1 transition-colors hover:bg-[#3A322D] hover:text-white"
            >
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label="Pantalla completa"
              className="rounded p-1 transition-colors hover:bg-[#3A322D] hover:text-white"
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

