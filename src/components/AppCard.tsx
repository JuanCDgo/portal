import {
  BookOpen,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Pin,
  QrCode,
  Trash2,
} from 'lucide-react';
import type { AppEntry } from '../types';
import { AppIcon } from './AppIcon';

interface AppCardProps {
  app: AppEntry;
  isPinned: boolean;
  isCopied: boolean;
  onTogglePin: (id: string) => void;
  onOpenQr: (app: AppEntry) => void;
  onCopy: (url: string, name: string, id: string) => void;
  onDeleteCustom?: (id: string) => void;
}

const BADGE_CLASSES: Record<NonNullable<AppEntry['highlight']>, string> = {
  emerald:
    'border-emerald-500/35 bg-emerald-500/10 text-emerald-300',
  amber:
    'border-amber-500/35 bg-amber-500/10 text-amber-300',
  sky:
    'border-sky-500/35 bg-sky-500/10 text-sky-300',
};

export function AppCard({
  app,
  isPinned,
  isCopied,
  onTogglePin,
  onOpenQr,
  onCopy,
  onDeleteCustom,
}: AppCardProps) {
  const badgeStyle = app.highlight
    ? BADGE_CLASSES[app.highlight]
    : 'border-[#2B3444] bg-[#1A202B] text-[#D1D5DB]';

  const cardBorder =
    app.highlight === 'amber'
      ? 'border-amber-500/25 hover:border-amber-500/50'
      : app.highlight === 'emerald'
        ? 'border-[#232A36] hover:border-emerald-500/45'
        : 'border-[#232A36] hover:border-[#374256]';

  return (
    <article
      className={`flex flex-col justify-between gap-4 rounded-2xl border bg-[#141820] p-4 transition-colors sm:p-5 ${cardBorder}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#283142] bg-[#1B202C] text-[#E5E7EB]">
              <AppIcon icon={app.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-[#F3F4F6]">
                {app.name}
              </h2>
              <p className="truncate font-mono text-[11px] text-[#8B95A7]">
                {app.domainLabel}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${badgeStyle}`}
            >
              {app.badge}
            </span>
            <button
              type="button"
              onClick={() => onTogglePin(app.id)}
              aria-label={
                isPinned
                  ? `Quitar ${app.name} de fijados`
                  : `Fijar ${app.name} arriba`
              }
              title={isPinned ? 'Fijado arriba' : 'Fijar arriba'}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                isPinned
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                  : 'border-[#262E3D] bg-[#181D27] text-[#6B7280] hover:border-[#374256] hover:text-[#D1D5DB]'
              }`}
            >
              <Pin className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>
            {app.isCustom && onDeleteCustom && (
              <button
                type="button"
                onClick={() => onDeleteCustom(app.id)}
                aria-label={`Eliminar enlace personalizado ${app.name}`}
                title="Eliminar enlace personalizado"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#262E3D] bg-[#181D27] text-[#6B7280] transition-colors hover:border-red-500/40 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
              </button>
            )}
          </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-[#9CA3AF]">
          {app.description}
        </p>
      </div>

      <div className="space-y-2 border-t border-[#1F2531] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-[108px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#10B981] px-3 py-2 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399]"
          >
            <span>Abrir App</span>
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.1} />
          </a>

          <button
            type="button"
            onClick={() => onOpenQr(app)}
            aria-label={`Ver código QR de ${app.name}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#283142] bg-[#1B202C] px-3 py-2 text-xs font-medium text-[#E5E7EB] transition-colors hover:border-[#3B475E] hover:bg-[#222938]"
          >
            <QrCode className="h-3.5 w-3.5" strokeWidth={1.9} />
            <span>QR</span>
          </button>

          <button
            type="button"
            onClick={() => onCopy(app.url, app.name, app.id)}
            aria-label={`Copiar enlace de ${app.name}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#283142] bg-[#1B202C] px-3 py-2 text-xs font-medium text-[#E5E7EB] transition-colors hover:border-[#3B475E] hover:bg-[#222938]"
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                <span className="text-emerald-300">Listo</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" strokeWidth={1.9} />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {(app.secondaryAction || app.extraAction || app.manualUserUrl || app.manualTechUrl) && (
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {app.secondaryAction && (
                <a
                  href={app.secondaryAction.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#262E3D] bg-[#0F131A] px-2.5 py-1 text-[11px] font-medium text-[#D1D5DB] transition-colors hover:border-[#3B475E] hover:text-white"
                >
                  <span>{app.secondaryAction.label}</span>
                  <ExternalLink className="h-3 w-3 text-[#6B7280]" />
                </a>
              )}
              {app.extraAction && (
                <a
                  href={app.extraAction.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#262E3D] bg-[#0F131A] px-2.5 py-1 text-[11px] font-medium text-[#D1D5DB] transition-colors hover:border-[#3B475E] hover:text-white"
                >
                  <span>{app.extraAction.label}</span>
                  <ExternalLink className="h-3 w-3 text-[#6B7280]" />
                </a>
              )}
              {app.manualUserUrl && (
                <a
                  href={app.manualUserUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#232A36] bg-[#0C0F14] px-2 py-1 text-[11px] font-medium text-[#9CA3AF] transition-colors hover:border-[#374256] hover:text-[#F3F4F6]"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Manual</span>
                </a>
              )}
              {app.manualTechUrl && (
                <a
                  href={app.manualTechUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#232A36] bg-[#0C0F14] px-2 py-1 text-[11px] font-medium text-[#9CA3AF] transition-colors hover:border-[#374256] hover:text-[#F3F4F6]"
                >
                  <Code2 className="h-3 w-3" />
                  <span>Técnico</span>
                </a>
              )}
            </div>

            <span className="rounded-md bg-[#181D27] px-2 py-0.5 text-[10px] font-medium text-[#8B95A7]">
              {app.tagLabel}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
