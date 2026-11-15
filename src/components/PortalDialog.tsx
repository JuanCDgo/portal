import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface PortalDialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: ReactNode;
}

/**
 * Native modal <dialog> with closedby="any", scroll containment via CSS,
 * and pointer fallback for browsers lacking HTMLDialogElement.prototype.closedBy.
 */
export function PortalDialog({
  open,
  onClose,
  titleId,
  title,
  subtitle,
  maxWidthClass = 'max-w-md',
  children,
}: PortalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };
    dialog.addEventListener('close', handleClose);

    // Fallback for browsers without native closedby="any" support (e.g. Safari)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) {
          dialog.close();
        }
      };
      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);
      return () => {
        dialog.removeEventListener('close', handleClose);
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby={titleId}
      className={`w-[calc(100%-2rem)] ${maxWidthClass} rounded-2xl border border-[#232A36] bg-[#141820] p-0 text-[#F3F4F6] shadow-2xl`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#232A36] px-5 py-4">
        <div className="min-w-0">
          <h2 id={titleId} className="truncate text-base font-semibold text-[#F3F4F6]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[#9CA3AF]">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Cerrar ventana"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2A3342] bg-[#1B202C] text-[#9CA3AF] transition-colors hover:border-[#3A4659] hover:text-white"
        >
          <X className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
      <div className="max-h-[calc(90dvh-5rem)] overflow-y-auto px-5 py-4">
        {children}
      </div>
    </dialog>
  );
}
