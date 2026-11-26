import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  CheckCircle2,
  Download,
  FileJson,
  LayoutGrid,
  MonitorSmartphone,
  Pin,
  Plus,
  QrCode,
  Search,
  Upload,
} from 'lucide-react';
import { INITIAL_APPS, PORTAL_URL } from './data/apps';
import type { AppEntry, PlatformCategory, PortalBackupData } from './types';
import { AppCard } from './components/AppCard';
import { QrDialog } from './components/QrDialog';
import { InstallDialog } from './components/InstallDialog';
import { AddLinkDialog } from './components/AddLinkDialog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type CategoryFilter = 'all' | 'pinned' | PlatformCategory;

const STORAGE_PINNED_KEY = 'hub_operativo_pinned_v2';
const STORAGE_CUSTOM_KEY = 'hub_operativo_custom_apps_v2';

export function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PINNED_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['kiosco-facil', 'maldito-flanders', 'bebidas-facil'];
    } catch {
      return ['kiosco-facil', 'maldito-flanders', 'bebidas-facil'];
    }
  });
  const [customApps, setCustomApps] = useState<AppEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      return saved ? (JSON.parse(saved) as AppEntry[]) : [];
    } catch {
      return [];
    }
  });

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const [qrTarget, setQrTarget] = useState<{
    name: string;
    url: string;
    subtitle?: string;
  } | null>(null);
  const [installOpen, setInstallOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 2600);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PINNED_KEY, JSON.stringify(pinnedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [pinnedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customApps));
    } catch {
      // Ignore storage quota errors
    }
  }, [customApps]);

  useEffect(() => {
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(checkStandalone);

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      showToast('Hub Operativo instalado correctamente en este dispositivo.');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [showToast]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const allApps = useMemo(
    () => [...customApps, ...INITIAL_APPS],
    [customApps],
  );

  const counts = useMemo(() => {
    return {
      all: allApps.length,
      pinned: allApps.filter((a) => pinnedIds.includes(a.id)).length,
      cloud: allApps.filter((a) => a.suite === 'facil' || a.category === 'cloud').length,
      work: allApps.filter((a) => a.category === 'work').length,
      social: allApps.filter((a) => a.category === 'social').length,
      netlify: allApps.filter((a) => a.category === 'netlify').length,
      desktop: allApps.filter((a) => a.category === 'desktop').length,
      miniapps: allApps.filter((a) => a.category === 'miniapps').length,
      resources: allApps.filter((a) => a.category === 'resources').length,
    };
  }, [allApps, pinnedIds]);

  const sortWithPinned = useCallback(
    (items: AppEntry[]) =>
      [...items].sort((a, b) => {
        const aPin = pinnedIds.includes(a.id) ? 0 : 1;
        const bPin = pinnedIds.includes(b.id) ? 0 : 1;
        return aPin - bPin;
      }),
    [pinnedIds],
  );

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = allApps.filter((app) => {
      if (category === 'pinned' && !pinnedIds.includes(app.id)) return false;
      if (category === 'cloud' && app.suite !== 'facil' && app.category !== 'cloud') {
        return false;
      }
      if (
        category !== 'all' &&
        category !== 'pinned' &&
        category !== 'cloud' &&
        app.category !== category
      ) {
        return false;
      }
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.domainLabel.toLowerCase().includes(q) ||
        app.tagLabel.toLowerCase().includes(q) ||
        app.badge.toLowerCase().includes(q)
      );
    });

    return category === 'all' ? sortWithPinned(list) : list;
  }, [allApps, category, pinnedIds, search, sortWithPinned]);

  const facilApps = useMemo(
    () => sortWithPinned(filteredApps.filter((a) => a.suite === 'facil' || a.category === 'cloud')),
    [filteredApps, sortWithPinned],
  );

  const workApps = useMemo(
    () => sortWithPinned(filteredApps.filter((a) => a.category === 'work')),
    [filteredApps, sortWithPinned],
  );

  const socialApps = useMemo(
    () => sortWithPinned(filteredApps.filter((a) => a.category === 'social')),
    [filteredApps, sortWithPinned],
  );

  const legacyApps = useMemo(
    () =>
      sortWithPinned(
        filteredApps.filter(
          (a) =>
            a.suite !== 'facil' &&
            a.category !== 'cloud' &&
            a.category !== 'work' &&
            a.category !== 'social',
        ),
      ),
    [filteredApps, sortWithPinned],
  );

  const useSplitSections = category === 'all' || category === 'pinned';

  const renderAppCard = (app: AppEntry) => (
    <AppCard
      key={app.id}
      app={app}
      isPinned={pinnedIds.includes(app.id)}
      isCopied={copiedId === app.id}
      onTogglePin={togglePin}
      onOpenQr={(item) =>
        setQrTarget({
          name: item.name,
          url: item.url,
          subtitle: `${item.badge} · ${item.tagLabel}`,
        })
      }
      onCopy={handleCopy}
      onDeleteCustom={app.isCustom ? handleDeleteCustomApp : undefined}
    />
  );

  const handleTriggerNativeInstall = async () => {
    if (!deferredPrompt) {
      setInstallOpen(true);
      return;
    }
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
      setInstallOpen(false);
    }
  };

  const handleCopy = (url: string, name: string, id = 'modal') => {
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setCopiedId(id);
        showToast(`Enlace copiado: ${name}`);
        window.setTimeout(() => {
          setCopiedId((prev) => (prev === id ? null : prev));
        }, 1600);
      })
      .catch(() => {
        showToast('No se pudo copiar automáticamente.');
      });
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev],
    );
  };

  const handleAddCustomApp = (entry: AppEntry) => {
    setCustomApps((prev) => [entry, ...prev]);
    setPinnedIds((prev) => [entry.id, ...prev]);
    showToast(`Enlace agregado: ${entry.name}`);
  };

  const handleDeleteCustomApp = (id: string) => {
    setCustomApps((prev) => prev.filter((item) => item.id !== id));
    setPinnedIds((prev) => prev.filter((item) => item !== id));
    showToast('Enlace personalizado eliminado.');
  };

  const handleExportBackup = () => {
    const payload: PortalBackupData = {
      version: 2,
      exportedAt: new Date().toISOString(),
      pinnedIds,
      customApps,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const stamp = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });
    link.download = `hub-operativo-respaldo-${stamp}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Respaldo JSON exportado.');
  };

  const handleImportBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<PortalBackupData>;
        if (Array.isArray(parsed.pinnedIds)) {
          setPinnedIds(parsed.pinnedIds.filter((x) => typeof x === 'string'));
        }
        if (Array.isArray(parsed.customApps)) {
          const validCustom = parsed.customApps.filter(
            (x): x is AppEntry =>
              Boolean(x && typeof x.id === 'string' && typeof x.name === 'string' && typeof x.url === 'string'),
          );
          setCustomApps(validCustom);
        }
        showToast('Respaldo JSON restaurado correctamente.');
      } catch {
        showToast('El archivo JSON no tiene un formato válido.');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const filterTabs: { id: CategoryFilter; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: counts.all },
    { id: 'pinned', label: 'Fijados', count: counts.pinned },
    { id: 'cloud', label: 'Sistema Fácil', count: counts.cloud },
    { id: 'work', label: 'Apps Laborales', count: counts.work },
    { id: 'social', label: 'Social & Lab', count: counts.social },
    { id: 'netlify', label: 'Netlify', count: counts.netlify },
    { id: 'desktop', label: 'SGU & Local', count: counts.desktop },
    { id: 'miniapps', label: 'Mini Apps v1', count: counts.miniapps },
    { id: 'resources', label: 'Recursos', count: counts.resources },
  ];

  return (
    <div className="min-h-dvh bg-[#0C0F14] pb-24 text-[#F3F4F6] sm:pb-12">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#1E2430] bg-[#0C0F14]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/35 bg-[#141820] text-emerald-400">
              <LayoutGrid className="h-5 w-5" strokeWidth={1.85} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
                  Hub Operativo
                </h1>
                <span className="hidden rounded-md border border-[#262E3D] bg-[#141820] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#9CA3AF] sm:inline-block">
                  v2.3
                </span>
              </div>
              <p className="truncate text-xs text-[#9CA3AF]">
                Suite de Sistemas y Mini Apps · JuanCDgo
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setQrTarget({
                  name: 'Hub Operativo · Portal',
                  url: PORTAL_URL,
                  subtitle: 'Escaneá este QR para abrir el portal en otro teléfono',
                })
              }
              className="hidden items-center gap-1.5 rounded-xl border border-[#262E3D] bg-[#141820] px-3 py-2 text-xs font-medium text-[#E5E7EB] transition-colors hover:border-[#3A4659] hover:bg-[#1B202C] md:inline-flex"
            >
              <QrCode className="h-3.5 w-3.5 text-[#9CA3AF]" />
              <span>QR Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="hidden items-center gap-1.5 rounded-xl border border-[#262E3D] bg-[#141820] px-3 py-2 text-xs font-medium text-[#E5E7EB] transition-colors hover:border-[#3A4659] hover:bg-[#1B202C] sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5 text-[#9CA3AF]" />
              <span>Agregar Enlace</span>
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="hidden items-center gap-1.5 rounded-xl border border-[#262E3D] bg-[#141820] px-3 py-2 text-xs font-medium text-[#E5E7EB] transition-colors hover:border-[#3A4659] hover:bg-[#1B202C] lg:inline-flex"
              title="Exportar respaldo JSON de enlaces y fijados"
            >
              <FileJson className="h-3.5 w-3.5 text-[#9CA3AF]" />
              <span>Respaldo JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (deferredPrompt) {
                  void handleTriggerNativeInstall();
                } else {
                  setInstallOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-2 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399]"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2.2} />
              <span className="hidden sm:inline">
                {isStandalone ? 'Portal Instalado' : 'Instalar en PC / Celular'}
              </span>
              <span className="sm:hidden">Instalar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 pt-5 sm:px-6">
        {/* Install Strip */}
        <div
          className="flex flex-col gap-3 rounded-2xl border border-[#232A36] bg-[#141820] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3 sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2A3342] bg-[#1B202C] text-emerald-400">
              <MonitorSmartphone className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#F3F4F6]">
                  {isStandalone
                    ? 'Aplicación instalada en modo independiente'
                    : 'Acceso directo sin navegador — Instalá el Portal en Celular o PC'}
                </p>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
                  PWA Offline
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">
                Compatible con Android (Chrome), iPhone/iPad (Safari) y Windows/Mac como acceso independiente en escritorio.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {deferredPrompt && (
              <button
                type="button"
                onClick={() => {
                  void handleTriggerNativeInstall();
                }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-2 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399] sm:flex-initial"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Instalar ahora</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setInstallOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#2E3848] bg-[#1B202C] px-3.5 py-2 text-xs font-semibold text-[#E5E7EB] transition-colors hover:border-[#3F4D63] hover:bg-[#222938] sm:flex-initial"
            >
              <span>Descargar / Guía</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar sistema, rubro o dominio..."
                aria-label="Buscar sistema, rubro o dominio"
                className="w-full rounded-xl border border-[#232A36] bg-[#141820] py-2.5 pr-16 pl-10 text-sm text-[#F3F4F6] placeholder-[#6B7280] focus:border-emerald-500/70 focus:outline-none"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-[#283142] bg-[#0C0F14] px-1.5 py-0.5 font-mono text-[10px] text-[#8B95A7] sm:inline-block">
                Ctrl + K
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => {
                const active = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                        : 'border-[#232A36] bg-[#141820] text-[#9CA3AF] hover:border-[#343F52] hover:text-[#E5E7EB]'
                    }`}
                  >
                    {tab.id === 'pinned' && (
                      <Pin className="h-3 w-3" aria-hidden="true" />
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={`font-mono text-[10px] ${
                        active ? 'text-emerald-300' : 'text-[#9CA3AF]'
                      }`}
                    >
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bento App Sections */}
        {filteredApps.length > 0 ? (
          useSplitSections ? (
            <div className="space-y-8">
              {facilApps.length > 0 && (
                <section
                  className="space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-950/10 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold tracking-tight text-white sm:text-base">
                          Sistema Fácil · Suite Oficial
                        </h2>
                        <span className="rounded-md border border-emerald-500/35 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                          Estándar KioscoFácil ({facilApps.length})
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#9CA3AF]">
                        Apps móviles en la nube (Firebase + Offline + Caja diaria + Roles Dueño/Vendedor).
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {facilApps.map(renderAppCard)}
                  </div>
                </section>
              )}

              {workApps.length > 0 && (
                <section
                  className="space-y-3 rounded-2xl border border-amber-500/25 bg-amber-950/10 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold tracking-tight text-white sm:text-base">
                          Apps Laborales · Fábrica y Calidad
                        </h2>
                        <span className="rounded-md border border-amber-500/35 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                          Mejora Continua ({workApps.length})
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#9CA3AF]">
                        Herramientas operativas de planta: Pareto 80/20, Ishikawa 6M, Caminata Gemba, Auditoría WiFi y Control Patria.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workApps.map(renderAppCard)}
                  </div>
                </section>
              )}

              {socialApps.length > 0 && (
                <section
                  className="space-y-3 rounded-2xl border border-sky-500/25 bg-sky-950/10 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-500/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold tracking-tight text-white sm:text-base">
                          Social &amp; Laboratorio · Tiempo Real
                        </h2>
                        <span className="rounded-md border border-sky-500/35 bg-sky-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-300">
                          Apps Libres ({socialApps.length})
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#9CA3AF]">
                        Apps sociales, eventos grupales y experimentos fuera del rubro comercial (WebSockets, juegos, simuladores y herramientas creativas).
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {socialApps.map(renderAppCard)}
                  </div>
                </section>
              )}

              {legacyApps.length > 0 && (
                <section
                  className="space-y-3 pt-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2430] pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-[#E5E7EB] sm:text-base">
                          Otras Apps y Proyectos Anteriores
                        </h2>
                        <span className="rounded-md border border-[#262E3D] bg-[#141820] px-2 py-0.5 font-mono text-[10px] font-medium text-[#9CA3AF]">
                          {legacyApps.length}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#8B95A7]">
                        Sistemas SGU (.NET/LAN), Netlify, Mini Apps estáticas v1 y repositorios históricos.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {legacyApps.map(renderAppCard)}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <section className="space-y-3">
              <h2 className="sr-only">Catálogo de sistemas filtrados</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredApps.map(renderAppCard)}
              </div>
            </section>
          )
        ) : (
          <div className="rounded-2xl border border-[#232A36] bg-[#141820] px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#E5E7EB]">
              No hay sistemas que coincidan con "{search}".
            </p>
            <p className="mt-1 text-xs text-[#9CA3AF]">
              Probá limpiar el filtro o agregá un enlace nuevo manualmente.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="rounded-xl border border-[#2A3342] bg-[#1B202C] px-4 py-2 text-xs font-medium text-[#E5E7EB] hover:bg-[#232A39]"
              >
                Ver todos
              </button>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="rounded-xl bg-[#10B981] px-4 py-2 text-xs font-semibold text-[#06130E] hover:bg-[#34D399]"
              >
                Agregar enlace
              </button>
            </div>
          </div>
        )}

        {/* Footer & JSON Backup Controls */}
        <footer className="flex flex-col items-start justify-between gap-3 border-t border-[#1E2430] pt-5 text-xs text-[#8B95A7] sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Portal operativo · {allApps.length} accesos disponibles</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#232A36] bg-[#141820] px-2.5 py-1.5 text-xs font-medium text-[#D1D5DB] hover:border-[#374256] hover:text-white"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Importar JSON</span>
            </button>
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#232A36] bg-[#141820] px-2.5 py-1.5 text-xs font-medium text-[#D1D5DB] hover:border-[#374256] hover:text-white"
            >
              <FileJson className="h-3.5 w-3.5" />
              <span>Exportar JSON</span>
            </button>
            <a
              href="https://github.com/JuanCDgo/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#232A36] bg-[#141820] px-2.5 py-1.5 text-xs font-medium text-[#9CA3AF] hover:border-[#374256] hover:text-white"
            >
              Manuales y Código
            </a>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Action Bar */}
      <nav
        aria-label="Acciones rápidas móviles"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[#1E2430] bg-[#0C0F14]/95 px-2 py-2 backdrop-blur-sm sm:hidden"
      >
        <button
          type="button"
          onClick={() => setInstallOpen(true)}
          className="flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-emerald-400"
        >
          <Download className="h-4 w-4" />
          <span>Instalar</span>
        </button>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-[#D1D5DB]"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar</span>
        </button>
        <button
          type="button"
          onClick={handleExportBackup}
          className="flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-[#D1D5DB]"
        >
          <FileJson className="h-4 w-4" />
          <span>Respaldo</span>
        </button>
        <button
          type="button"
          onClick={() =>
            setQrTarget({
              name: 'Hub Operativo · Portal',
              url: PORTAL_URL,
              subtitle: 'Escaneá este QR para compartir el portal',
            })
          }
          className="flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-[#D1D5DB]"
        >
          <QrCode className="h-4 w-4" />
          <span>QR Portal</span>
        </button>
      </nav>

      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-20 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#141820] px-4 py-2.5 text-xs font-medium text-[#F3F4F6] shadow-xl sm:bottom-5"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Native Accessible Modals */}
      <QrDialog
        target={qrTarget}
        onClose={() => setQrTarget(null)}
        onCopy={(url, name) => handleCopy(url, name, 'modal')}
      />

      <InstallDialog
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        canPromptNative={Boolean(deferredPrompt)}
        isStandalone={isStandalone}
        onTriggerInstall={handleTriggerNativeInstall}
        onOpenPortalQr={() =>
          setQrTarget({
            name: 'Hub Operativo · Portal',
            url: PORTAL_URL,
            subtitle: 'Escaneá con tu celular para abrir e instalar el portal',
          })
        }
      />

      <AddLinkDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddCustomApp}
      />
    </div>
  );
}

export default App;
