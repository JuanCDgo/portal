import { useEffect, useId, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, ExternalLink, Share2 } from 'lucide-react';
import { PortalDialog } from './PortalDialog';

interface QrDialogProps {
  target: { name: string; url: string; subtitle?: string } | null;
  onClose: () => void;
  onCopy: (url: string, label: string) => void;
}

export function QrDialog({ target, onClose, onCopy }: QrDialogProps) {
  const titleId = useId();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!target) {
      setQrDataUrl('');
      return;
    }
    QRCode.toDataURL(target.url, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0C0F14',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [target]);

  const handleCopy = () => {
    if (!target) return;
    onCopy(target.url, target.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const whatsappUrl = target
    ? `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Acceso directo a ${target.name}: ${target.url}`,
      )}`
    : '#';

  return (
    <PortalDialog
      open={Boolean(target)}
      onClose={onClose}
      titleId={titleId}
      title={target?.name ?? 'Código QR'}
      subtitle={target?.subtitle ?? 'Escaneá con la cámara de tu celular para abrir'}
      maxWidthClass="max-w-sm"
    >
      {target && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-xl border border-[#2A3342] bg-white p-3">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Código QR para ${target.name}`}
                  className="h-52 w-52 object-contain"
                />
              ) : (
                <div className="flex h-52 w-52 items-center justify-center text-xs text-zinc-500">
                  Generando QR...
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#232A36] bg-[#0C0F14] px-3 py-2">
            <span className="min-w-0 flex-1 select-all truncate font-mono text-xs text-[#9CA3AF]">
              {target.url}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#2E3848] bg-[#1B202C] px-2.5 py-1 text-xs font-medium text-[#F3F4F6] transition-colors hover:border-[#425066] hover:bg-[#232A39]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2A3342] bg-[#1B202C] px-3 py-2.5 text-xs font-semibold text-[#F3F4F6] transition-colors hover:border-emerald-500/40 hover:bg-[#202736]"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <a
              href={target.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#10B981] px-3 py-2.5 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Abrir enlace</span>
            </a>
          </div>
        </div>
      )}
    </PortalDialog>
  );
}
