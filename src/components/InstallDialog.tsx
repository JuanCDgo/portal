import { useId } from 'react';
import {
  CheckCircle2,
  Download,
  HardDriveDownload,
  Monitor,
  QrCode,
  Share,
  Smartphone,
} from 'lucide-react';
import { PORTAL_URL } from '../data/apps';
import { PortalDialog } from './PortalDialog';

interface InstallDialogProps {
  open: boolean;
  onClose: () => void;
  canPromptNative: boolean;
  isStandalone: boolean;
  onTriggerInstall: () => Promise<void>;
  onOpenPortalQr: () => void;
}

export function InstallDialog({
  open,
  onClose,
  canPromptNative,
  isStandalone,
  onTriggerInstall,
  onOpenPortalQr,
}: InstallDialogProps) {
  const titleId = useId();

  const handleDownloadShortcut = () => {
    const content = `[InternetShortcut]\r\nURL=${PORTAL_URL}\r\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Hub_Operativo_JuanCDgo.url';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <PortalDialog
      open={open}
      onClose={onClose}
      titleId={titleId}
      title="Descargar e Instalar Portal"
      subtitle="Usá Hub Operativo como aplicación nativa en celular y PC"
      maxWidthClass="max-w-lg"
    >
      <div className="space-y-4">
        {isStandalone ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold">Portal ya instalado en este dispositivo</p>
              <p className="mt-0.5 text-emerald-300/80">
                Estás ejecutando Hub Operativo en modo aplicación independiente.
              </p>
            </div>
          </div>
        ) : canPromptNative ? (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-white">
              Instalación directa disponible en tu navegador
            </p>
            <p className="mt-1 text-xs text-[#D1D5DB]">
              Se creará un ícono propio en tu escritorio o pantalla de inicio, sin barra de navegación y con soporte offline.
            </p>
            <button
              type="button"
              onClick={() => {
                void onTriggerInstall();
              }}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] px-4 py-2.5 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399]"
            >
              <Download className="h-4 w-4" />
              <span>Instalar Hub Operativo ahora</span>
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-[#2A3342] bg-[#0C0F14] p-3.5 text-xs text-[#9CA3AF]">
            Elegí tu dispositivo abajo para instalar la PWA como aplicación o descargar el acceso directo a tu PC.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#232A36] bg-[#0F131A] p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F4F6]">
              <Smartphone className="h-4 w-4 text-emerald-400" />
              <span>Android (Chrome / Edge)</span>
            </div>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs text-[#9CA3AF]">
              <li>Abrí el menú del navegador (tres puntos arriba a la derecha).</li>
              <li>Tocá <strong className="text-[#E5E7EB]">Instalar aplicación</strong> o <strong className="text-[#E5E7EB]">Agregar a la pantalla principal</strong>.</li>
              <li>Confirmá para tener el ícono en tu cajón de apps.</li>
            </ol>
          </div>

          <div className="rounded-xl border border-[#232A36] bg-[#0F131A] p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F4F6]">
              <Share className="h-4 w-4 text-sky-400" />
              <span>iPhone / iPad (Safari)</span>
            </div>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs text-[#9CA3AF]">
              <li>Tocá el botón <strong className="text-[#E5E7EB]">Compartir</strong> en la barra inferior de Safari.</li>
              <li>Deslizá hacia abajo y elegí <strong className="text-[#E5E7EB]">Agregar a inicio</strong>.</li>
              <li>Presioná <strong className="text-[#E5E7EB]">Agregar</strong> arriba a la derecha.</li>
            </ol>
          </div>
        </div>

        <div className="rounded-xl border border-[#232A36] bg-[#0F131A] p-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F4F6]">
                <Monitor className="h-4 w-4 text-amber-400" />
                <span>PC / Notebook (Windows, Mac, Linux)</span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                En Chrome o Edge hacé clic en el ícono <strong className="text-[#E5E7EB]">Instalar</strong> de la barra de direcciones, o descargá un acceso directo `.url` al escritorio.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadShortcut}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#2E3848] bg-[#1B202C] px-3 py-2 text-xs font-semibold text-[#F3F4F6] transition-colors hover:border-emerald-500/40 hover:bg-[#232A39]"
            >
              <HardDriveDownload className="h-4 w-4 text-emerald-400" />
              <span>Descargar Acceso PC (.url)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#232A36] bg-[#0C0F14] px-3.5 py-2.5">
          <span className="text-xs text-[#9CA3AF]">
            ¿Querés pasarlo rápido de la PC al celular?
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPortalQr();
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#2E3848] bg-[#1B202C] px-2.5 py-1.5 text-xs font-medium text-[#F3F4F6] hover:bg-[#232A39]"
          >
            <QrCode className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ver QR del Portal</span>
          </button>
        </div>
      </div>
    </PortalDialog>
  );
}
