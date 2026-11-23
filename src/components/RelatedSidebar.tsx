import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ArticleSummary } from '../data/articles';

interface RelatedSidebarProps {
  relatedArticles: ArticleSummary[];
  onSelectArticle: (articleId: string) => void;
}

const AVAILABLE_ARTICLE_IDS = new Set(['ipc', 'uf']);

export const RelatedSidebar: React.FC<RelatedSidebarProps> = ({
  relatedArticles,
  onSelectArticle,
}) => {
  return (
    <aside aria-label="Artículos relacionados" id="relacionados" className="w-full lg:sticky lg:top-20">
      <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-[#D9CEBF] pb-2">
        <h2 className="font-display text-lg font-bold tracking-tight text-[#2A2522]">
          Artículos relacionados
        </h2>
        <span className="text-xs text-[#6E645C]">{relatedArticles.length} lecturas</span>
      </div>

      {/* Stacked rows with warm archival hairlines */}
      <div className="divide-y divide-[#DDD2C4] overflow-hidden rounded-lg border border-[#D9CEBF] bg-[#FAF5EC]/80">
        {relatedArticles.map((article, index) => {
          const isInteractive = AVAILABLE_ARTICLE_IDS.has(article.id);
          const innerContent = (
            <>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#6E645C]">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: article.accentHex }}
                    aria-hidden="true"
                  />
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{`0${index + 1}`}</span>
                  {isInteractive && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#9E5A63]">Disponible</span>
                    </>
                  )}
                </div>
                <ArrowRight
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    isInteractive
                      ? 'text-[#9E5A63] group-hover:translate-x-0.5'
                      : 'text-[#8D8177]'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <h3
                className={`font-display text-sm font-bold leading-snug text-[#2A2522] ${
                  isInteractive ? 'group-hover:text-[#9E5A63]' : ''
                }`}
              >
                {article.title}
              </h3>

              <p className="line-clamp-2 text-xs leading-relaxed text-[#625A54]">
                {article.subtitle}
              </p>
            </>
          );

          if (isInteractive) {
            return (
              <button
                key={article.id}
                type="button"
                onClick={() => onSelectArticle(article.id)}
                className="group flex w-full flex-col justify-between gap-1.5 p-4 text-left transition-colors hover:bg-[#F1E8DA] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E5A63]"
              >
                {innerContent}
              </button>
            );
          }

          return (
            <div
              key={article.id}
              className="group flex w-full flex-col justify-between gap-1.5 p-4 text-left opacity-80"
            >
              {innerContent}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
