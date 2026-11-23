import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ArticleSummary, UF_TODAY } from '../data/articles';
import { MENU_ITEMS } from './Header';
import { getAssetUrl } from '../utils/assetUrl';

interface HomeViewProps {
  articles: ArticleSummary[];
  selectedSection: string;
  onSelectSection: (section: string) => void;
  onOpenArticle: (articleId: string) => void;
}

const ARTICLE_THUMBNAILS: Record<string, { src: string; alt: string }> = {
  ipc: {
    src: 'assets/aistudio/Gemini_Generated_Image_eb7x8web7x8web7x_3a088f0f.jpg',
    alt: 'Vista previa del artículo sobre el IPC',
  },
  uf: {
    src: 'assets/aistudio/Ilustraci_n_editorial_sobre_la_UF_chilena_b75f89aa.png',
    alt: 'Vista previa del artículo sobre la UF chilena',
  },
};

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  selectedSection,
  onSelectSection,
  onOpenArticle,
}) => {
  const [memberRequested, setMemberRequested] = useState<boolean>(false);
  const [failedThumbs, setFailedThumbs] = useState<Record<string, boolean>>({});

  const ipcArticle = articles.find((a) => a.id === 'ipc') ?? articles[0];
  const ufArticle = articles.find((a) => a.id === 'uf');
  const economyArticles = articles.filter((a) => a.id === 'ipc' || a.id === 'uf');
  const sectionPreviewArticles = articles.filter(
    (a) => a.category === selectedSection && a.id !== 'ipc' && a.id !== 'uf'
  );

  const renderFeaturedCard = (
    article: ArticleSummary,
    headerLabel: string,
    headerRight: string
  ) => {
    const thumb = ARTICLE_THUMBNAILS[article.id];
    const thumbFailed = failedThumbs[article.id];

    return (
      <div
        key={article.id}
        className="overflow-hidden rounded-2xl border border-[#D2C6B7] bg-[#FAF5EC] shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4DACB] bg-[#EFE7DA]/80 px-5 py-3">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: article.accentHex }}
          >
            {headerLabel}
          </span>
          <span className="font-mono text-xs text-[#6E645C] tabular-nums">{headerRight}</span>
        </div>

        <button
          type="button"
          onClick={() => onOpenArticle(article.id)}
          className="group grid w-full items-center gap-5 p-5 text-left transition-colors hover:bg-[#F5EFE6]/70 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E5A63] sm:grid-cols-12"
        >
          <div className="overflow-hidden rounded-xl border border-[#D9CEBF] bg-[#EFE7DA] sm:col-span-5">
            {thumb && !thumbFailed ? (
              <img
                src={getAssetUrl(thumb.src)}
                alt={thumb.alt}
                referrerPolicy="no-referrer"
                onError={() => setFailedThumbs((prev) => ({ ...prev, [article.id]: true }))}
                className="block aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex aspect-[16/10] w-full items-center justify-center p-4 text-center font-display text-sm font-semibold text-[#9E5A63]">
                {article.title}
              </div>
            )}
          </div>

          <div className="sm:col-span-7">
            <h2 className="font-display text-xl font-bold leading-snug text-[#2A2522] group-hover:text-[#9E5A63]">
              {article.title}
            </h2>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#5D534B] sm:text-sm">
              {article.subtitle}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E5A63]">
              <span>Leer artículo completo</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <section
      aria-label="Pantalla principal de Descifra.cl"
      className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[960px] flex-col items-center justify-center py-10 text-center sm:py-14"
    >
      {/* Logo grande + Slogan en manuscrita */}
      <div className="max-w-2xl">
        <h1 className="font-display text-6xl font-bold tracking-tight text-[#9E5A63] sm:text-7xl lg:text-[5.25rem] lg:leading-none">
          Descifra.cl
        </h1>

        <p
          className="mt-3 text-3xl font-semibold text-[#3E3732] sm:text-4xl"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Toda la actualidad a un click
        </p>

        <div className="mx-auto mt-5 h-[1.5px] w-20 bg-[#9E5A63]/70" aria-hidden="true" />
      </div>

      {/* Botón Hazte miembro ahora */}
      <div className="mt-7 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setMemberRequested((prev) => !prev)}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#9E5A63] px-7 py-3 text-sm font-semibold tracking-wide text-[#FAF6F0] shadow-xs transition-colors hover:bg-[#844850] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5A63]"
        >
          {memberRequested && <Check className="h-4 w-4" aria-hidden="true" />}
          <span>{memberRequested ? '¡Gracias por tu interés!' : 'Hazte miembro ahora'}</span>
        </button>
        {memberRequested && (
          <p className="text-xs text-[#6E645C]">
            Muy pronto abriremos las inscripciones para la comunidad Descifra.cl.
          </p>
        )}
      </div>

      {/* Selección de secciones (mismas del menú desplegable izquierdo) */}
      <div className="mt-10 w-full max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6E645C]">
          Explora por sección
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-2.5"
          role="group"
          aria-label="Secciones editoriales"
        >
          {MENU_ITEMS.map((item) => {
            const isActive = selectedSection === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelectSection(item.label)}
                className={`inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5A63] ${
                  isActive
                    ? 'border-[#2A2522] bg-[#2A2522] text-[#FAF6F0]'
                    : 'border-[#D9CEBF] bg-[#FAF5EC] text-[#3E3732] hover:border-[#B9AA98] hover:bg-[#EFE7DA]'
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.accent }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido editorial según la sección seleccionada */}
      <div className="mt-11 w-full max-w-2xl space-y-6 text-left">
        {selectedSection === 'Portada' && (
          <>
            {renderFeaturedCard(
              ipcArticle,
              'Revisa nuestro último artículo',
              ipcArticle.category
            )}

            {ufArticle && (
              <div className="pt-2">
                <div className="mb-2.5 flex items-baseline justify-between gap-2 px-1">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#6E645C]">
                    Sección Economía
                  </h2>
                  <button
                    type="button"
                    onClick={() => onSelectSection('Economía')}
                    className="text-xs font-semibold text-[#9E5A63] underline-offset-4 hover:underline"
                  >
                    Ver todos en Economía
                  </button>
                </div>

                {renderFeaturedCard(
                  ufArticle,
                  'Economía · Especial UF',
                  `UF hoy: $${UF_TODAY.value.toLocaleString('es-CL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                )}
              </div>
            )}
          </>
        )}

        {selectedSection === 'Economía' && (
          <div className="space-y-5">
            <div className="flex items-baseline justify-between border-b border-[#D9CEBF] pb-2">
              <h2 className="font-display text-xl font-bold text-[#2A2522]">
                Sección Economía
              </h2>
              <span className="text-xs text-[#6E645C]">
                {economyArticles.length} artículos interactivos
              </span>
            </div>

            {economyArticles.map((article) =>
              renderFeaturedCard(
                article,
                article.id === 'uf' ? 'Economía · Especial UF' : 'Economía · Edición semanal',
                article.id === 'uf'
                  ? `UF hoy: $${UF_TODAY.value.toLocaleString('es-CL', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : article.readTime
              )
            )}
          </div>
        )}

        {selectedSection !== 'Portada' && selectedSection !== 'Economía' && (
          <div className="rounded-2xl border border-[#D2C6B7] bg-[#FAF5EC] p-6">
            <div className="flex items-baseline justify-between border-b border-[#E4DACB] pb-3">
              <h2 className="font-display text-xl font-bold text-[#2A2522]">
                Sección {selectedSection}
              </h2>
              <span className="text-xs text-[#6E645C]">Próximamente</span>
            </div>

            {sectionPreviewArticles.length > 0 ? (
              <div className="mt-4 space-y-4">
                {sectionPreviewArticles.map((art) => (
                  <div key={art.id} className="rounded-xl border border-[#E4DACB] bg-[#F5EFE6] p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E645C]">
                      {art.category} · En preparación
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-[#2A2522]">
                      {art.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5D534B]">{art.subtitle}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#5D534B]">
                Estamos preparando nuevos reportajes explicativos para esta sección.
              </p>
            )}

            <button
              type="button"
              onClick={() => onSelectSection('Economía')}
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E5A63] underline-offset-4 hover:underline"
            >
              <span>Explorar artículos disponibles en Economía</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
