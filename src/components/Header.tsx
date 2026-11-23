import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Download, Mail, Menu, Search, X } from 'lucide-react';

export const MENU_ITEMS = [
  { label: 'Portada', accent: '#9E5A63' },
  { label: 'Economía', accent: '#B87462' },
  { label: 'Hogares', accent: '#C29A63' },
  { label: 'Sociedad', accent: '#7A8B74' },
  { label: 'Tecnología', accent: '#64798A' },
];

interface HeaderProps {
  currentView: 'home' | 'article';
  onGoHome: () => void;
  onGoArticle: (articleId?: string) => void;
  onSelectHomeSection?: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onGoHome,
  onGoArticle,
  onSelectHomeSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsNewsletterOpen(false);
      }
    };
    if (isOpen || isNewsletterOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isNewsletterOpen]);

  const handleOpenNewsletter = () => {
    setIsOpen(false);
    setNewsletterSubmitted(false);
    setIsNewsletterOpen(true);
  };

  const handleSubmitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
  };

  const handleDownloadStandaloneHtml = async () => {
    if (downloadStatus === 'loading') return;
    setDownloadStatus('loading');
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}descifra-standalone.txt`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('No se pudo obtener el archivo HTML');
      }
      const htmlText = await response.text();
      if (!htmlText.includes('__DESCIFRA_ASSETS__')) {
        throw new Error('El archivo descargado no corresponde al paquete standalone');
      }
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'index.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadStatus('done');
      window.setTimeout(() => setDownloadStatus('idle'), 3000);
    } catch {
      setDownloadStatus('error');
      window.setTimeout(() => setDownloadStatus('idle'), 3500);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#DED4C6] bg-[#F5EFE6]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              aria-controls="left-slide-menu"
              aria-label="Abrir menú lateral"
              className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-md p-1.5 text-[#5D534B] transition-colors hover:bg-[#EAE1D4] hover:text-[#2A2522] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5A63]"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <span className="h-5 w-px bg-[#D2C6B7]" aria-hidden="true" />

            <button
              type="button"
              onClick={onGoHome}
              className="font-display text-2xl font-bold tracking-tight text-[#9E5A63] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5A63]"
            >
              Descifra.cl
            </button>
          </div>

          <div className="flex items-center gap-3">
            {currentView === 'article' ? (
              <button
                type="button"
                onClick={onGoHome}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full border border-[#D2C6B7] bg-[#FAF5EC] px-3.5 py-1.5 text-xs font-semibold text-[#3E3732] transition-colors hover:border-[#9E5A63] hover:text-[#9E5A63]"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Volver al inicio</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onGoArticle('ipc')}
                className="hidden sm:inline-flex items-center whitespace-nowrap shrink-0 text-xs font-semibold text-[#9E5A63] underline-offset-4 hover:underline"
              >
                Último artículo: IPC
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Abrir índice de secciones"
              className="rounded-full p-1.5 text-[#7B5257] transition-colors hover:bg-[#EAE1D4]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleOpenNewsletter}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full bg-[#9E5A63] px-4 py-1.5 text-xs font-semibold text-[#FAF6F0] transition-colors hover:bg-[#844850] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5A63]"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Unirse al newsletter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-[#2A2522]/35 backdrop-blur-[1px] transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Left Slide-out Drawer */}
      <aside
        id="left-slide-menu"
        aria-label="Menú de navegación lateral"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between border-r border-[#DED4C6] bg-[#F5EFE6] p-6 shadow-2xl transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#DED4C6] pb-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onGoHome();
              }}
              className="font-display text-2xl font-bold tracking-tight text-[#9E5A63]"
            >
              Descifra.cl
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú lateral"
              className="rounded-lg p-1.5 text-[#6E645C] transition-colors hover:bg-[#EAE1D4] hover:text-[#2A2522]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Secciones" className="mt-6 space-y-1">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onSelectHomeSection) {
                    onSelectHomeSection(item.label);
                  } else {
                    onGoHome();
                  }
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-display text-base font-medium text-[#2A2522] transition-colors hover:bg-[#ECE4D7]"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.accent }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-2.5 border-t border-[#DED4C6] pt-5">
          <button
            type="button"
            onClick={handleDownloadStandaloneHtml}
            disabled={downloadStatus === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#C9BCAE] bg-[#FAF5EC] px-5 py-2.5 text-xs font-semibold tracking-wide text-[#2A2522] transition-colors hover:border-[#9E5A63] hover:bg-[#EFE7DA] disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5 text-[#9E5A63]" aria-hidden="true" />
            <span>
              {downloadStatus === 'loading'
                ? 'Preparando index.html...'
                : downloadStatus === 'done'
                ? '¡index.html descargado!'
                : downloadStatus === 'error'
                ? 'Reintentar descarga'
                : 'Descargar index.html'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenNewsletter}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#9E5A63] px-5 py-2.5 text-xs font-semibold tracking-wide text-[#FAF6F0] transition-colors hover:bg-[#844850]"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Unirse al newsletter</span>
          </button>
          <p className="pt-1 text-center text-xs text-[#6E645C]">
            Toda la actualidad a un click
          </p>
        </div>
      </aside>

      {/* Newsletter Modal */}
      {isNewsletterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2522]/45 p-4 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-modal-title"
          onClick={() => setIsNewsletterOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#D9CEBF] bg-[#FAF5EC] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsNewsletterOpen(false)}
              aria-label="Cerrar ventana de suscripción"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#6E645C] transition-colors hover:bg-[#EAE1D4] hover:text-[#2A2522]"
            >
              <X className="h-5 w-5" />
            </button>

            {!newsletterSubmitted ? (
              <>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9E5A63]">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Descifra.cl · Newsletter semanal</span>
                </div>
                <h2
                  id="newsletter-modal-title"
                  className="mt-2 font-display text-2xl font-bold text-[#2A2522]"
                >
                  Únete al newsletter
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5D534B]">
                  Recibe cada semana la explicación visual de un tema contingente directo en tu correo.
                </p>

                <form onSubmit={handleSubmitNewsletter} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="newsletter-email" className="block text-xs font-semibold text-[#3E3732]">
                      Correo electrónico
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="tu@correo.cl"
                      className="mt-1.5 w-full rounded-lg border border-[#D2C6B7] bg-[#F5EFE6] px-3.5 py-2.5 text-sm text-[#2A2522] placeholder:text-[#8D8177] focus:border-[#9E5A63] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#9E5A63] px-5 py-2.5 text-xs font-semibold tracking-wide text-[#FAF6F0] transition-colors hover:bg-[#844850]"
                  >
                    Suscribirme gratis
                  </button>
                </form>
              </>
            ) : (
              <div className="py-4 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#5D7356]" aria-hidden="true" />
                <h3 className="mt-3 font-display text-xl font-bold text-[#2A2522]">
                  ¡Bienvenido al newsletter!
                </h3>
                <p className="mt-1.5 text-sm text-[#5D534B]">
                  Te enviaremos nuestra próxima edición a{' '}
                  <strong className="text-[#2A2522]">{newsletterEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsNewsletterOpen(false)}
                  className="mt-5 rounded-full bg-[#9E5A63] px-6 py-2 text-xs font-semibold text-[#FAF6F0] hover:bg-[#844850]"
                >
                  Seguir explorando
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
