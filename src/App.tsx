import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, BookOpen, Check } from 'lucide-react';
import { ARTICLES } from './data/articles';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { RelatedSidebar } from './components/RelatedSidebar';
import { EditorialIllustration, WatercolorCornerAccents } from './components/EditorialIllustrations';
import { InteractiveIPCExplainer } from './components/InteractiveIPCExplainer';
import { InteractiveUFExplainer } from './components/InteractiveUFExplainer';

type ActiveArticleId = 'ipc' | 'uf';

const getInitialRoute = (): { view: 'home' | 'article'; articleId: ActiveArticleId } => {
  if (typeof window === 'undefined') {
    return { view: 'home', articleId: 'ipc' };
  }
  if (window.location.hash === '#articulo-uf') {
    return { view: 'article', articleId: 'uf' };
  }
  if (window.location.hash === '#articulo-ipc') {
    return { view: 'article', articleId: 'ipc' };
  }
  return { view: 'home', articleId: 'ipc' };
};

export default function App() {
  const initialRoute = getInitialRoute();
  const [currentView, setCurrentView] = useState<'home' | 'article'>(initialRoute.view);
  const [activeArticleId, setActiveArticleId] = useState<ActiveArticleId>(initialRoute.articleId);
  const [homeSection, setHomeSection] = useState<string>('Portada');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const ipcArticle = ARTICLES.find((a) => a.id === 'ipc') ?? ARTICLES[0];
  const currentArticle = ARTICLES.find((a) => a.id === activeArticleId) ?? ipcArticle;
  const relatedArticles = ARTICLES.filter((a) => a.id !== currentArticle.id);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#articulo-uf') {
        setActiveArticleId('uf');
        setCurrentView('article');
      } else if (window.location.hash === '#articulo-ipc') {
        setActiveArticleId('ipc');
        setCurrentView('article');
      } else if (window.location.hash === '' || window.location.hash === '#inicio') {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (currentView !== 'article') {
      setScrollProgress(0);
      return;
    }
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView, activeArticleId]);

  const navigateToHome = (section: string = 'Portada') => {
    setHomeSection(section);
    setCurrentView('home');
    if (window.location.hash === '#articulo-ipc' || window.location.hash === '#articulo-uf') {
      window.history.pushState(null, '', '#inicio');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (articleId: string = 'ipc') => {
    const targetId: ActiveArticleId = articleId === 'uf' ? 'uf' : 'ipc';
    setActiveArticleId(targetId);
    setCurrentView('article');
    window.history.pushState(null, '', `#articulo-${targetId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="inicio" className="relative min-h-screen bg-[#F5EFE6] text-[#2A2522]">
      {/* Organic watercolor & botanical background washes */}
      <WatercolorCornerAccents />

      {/* Thin horizontal reading progress indicator on article view */}
      {currentView === 'article' && (
        <div
          className="fixed left-0 top-0 z-50 h-[3px] transition-[width] duration-150"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: currentArticle.accentHex,
          }}
          aria-hidden="true"
        />
      )}

      <Header
        currentView={currentView}
        onGoHome={() => navigateToHome('Portada')}
        onGoArticle={(id) => navigateToArticle(id)}
        onSelectHomeSection={(sec) => navigateToHome(sec)}
      />

      <main className="relative z-10 mx-auto max-w-[1320px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {currentView === 'home' ? (
          <HomeView
            articles={ARTICLES}
            selectedSection={homeSection}
            onSelectSection={setHomeSection}
            onOpenArticle={(id) => navigateToArticle(id)}
          />
        ) : (
          /* Two-column article layout: Left = Artículos relacionados, Right = Artículo principal */
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            {/* Left Sidebar (Desktop left, Mobile below main article) */}
            <div className="order-2 lg:order-1 lg:col-span-3">
              <RelatedSidebar
                relatedArticles={relatedArticles}
                onSelectArticle={(id) => navigateToArticle(id)}
              />
            </div>

            {/* Right Main Content Column: Active feature in warm archival editorial aesthetic */}
            <article className="order-1 lg:order-2 lg:col-span-9">
              {/* Editorial Kicker + Mobile jump */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2 font-semibold uppercase tracking-widest text-[#9E5A63]">
                  <button
                    type="button"
                    onClick={() => navigateToHome('Portada')}
                    className="inline-flex items-center gap-1 normal-case tracking-normal text-[#6E645C] hover:text-[#9E5A63]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Inicio</span>
                  </button>
                  <span aria-hidden="true" className="text-[#C7BAAB]">/</span>
                  <span>{currentArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#6E645C]">{currentArticle.date}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#6E645C]">{currentArticle.readTime}</span>
                </div>

                <a
                  href="#relacionados"
                  className="inline-flex items-center gap-1 font-medium text-[#9E5A63] underline-offset-4 hover:underline lg:hidden"
                >
                  <span>Ver artículos relacionados</span>
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* Hero Composition: Headline, full-width illustration, and editorial lead */}
              <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-[#2A2522] sm:text-5xl lg:leading-[1.08]">
                {currentArticle.title}
              </h1>

              <div className="mt-5">
                <EditorialIllustration articleId={currentArticle.id} />
              </div>

              <div className="mt-6 max-w-3xl">
                <p className="font-display text-lg leading-relaxed text-[#3E3732] sm:text-[1.2rem]">
                  {currentArticle.lead}
                </p>
                {/* Signature thin dusty editorial divider line */}
                <div
                  className="mt-5 h-[1.5px] w-16"
                  style={{ backgroundColor: currentArticle.accentHex }}
                  aria-hidden="true"
                />
              </div>

              {/* Subtle Section Anchor Index */}
              <nav
                aria-label="Índice del artículo"
                className="mt-8 rounded-xl border border-[#D9CEBF] bg-[#FAF5EC]/85 p-4"
              >
                <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6E645C]">
                  <BookOpen className="h-3.5 w-3.5 text-[#9E5A63]" aria-hidden="true" />
                  <span>Explora este tema hacia abajo</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentArticle.sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="group inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[#D9CEBF] bg-[#F5EFE6] px-3 py-1.5 text-xs font-medium text-[#3E3732] transition-colors hover:border-[#9E5A63] hover:bg-[#9E5A63] hover:text-[#FAF6F0]"
                    >
                      <span className="font-mono font-bold text-[#9E5A63] group-hover:text-[#FAF6F0]">
                        {sec.number}
                      </span>
                      <span>{sec.heading}</span>
                    </a>
                  ))}
                </div>
              </nav>

              {/* Interactive Article Body */}
              {activeArticleId === 'uf' ? (
                <InteractiveUFExplainer />
              ) : (
                <InteractiveIPCExplainer onOpenUfArticle={() => navigateToArticle('uf')} />
              )}

              {/* Key Takeaways Summary Box */}
              <section
                aria-labelledby="heading-resumen"
                className="mt-12 rounded-xl border border-[#D9CEBF] bg-[#FAF5EC] p-6"
              >
                <h2 id="heading-resumen" className="font-display text-xl font-bold text-[#2A2522]">
                  En resumen: 3 ideas clave para recordar
                </h2>
                <ul className="mt-4 space-y-3">
                  {currentArticle.keyTakeaways.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-[#3E3732]">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#FAF6F0]"
                        style={{ backgroundColor: currentArticle.accentHex }}
                        aria-hidden="true"
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </article>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-[#DED4C6] bg-[#EFE7DA] py-8">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-4 px-4 text-xs text-[#6E645C] sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <button
              type="button"
              onClick={() => navigateToHome('Portada')}
              className="font-display text-base font-bold text-[#9E5A63] hover:underline"
            >
              Descifra.cl
            </button>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Toda la actualidad a un click</span>
          </div>
          <div>
            <span>Periodismo explicativo · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
