import { useId, useState, type FormEvent } from 'react';
import type { AppEntry, PlatformCategory } from '../types';
import { PortalDialog } from './PortalDialog';

interface AddLinkDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: AppEntry) => void;
}

export function AddLinkDialog({ open, onClose, onAdd }: AddLinkDialogProps) {
  const titleId = useId();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PlatformCategory>('cloud');
  const [tagLabel, setTagLabel] = useState('Personalizado');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanUrl = url.trim();
    if (!cleanName || !cleanUrl) {
      setError('Completá nombre y URL válida.');
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    } catch {
      setError('La URL ingresada no es válida.');
      return;
    }

    const badgeMap: Record<PlatformCategory, string> = {
      cloud: 'Cloud',
      netlify: 'Netlify',
      desktop: 'Local / LAN',
      miniapps: 'Web App',
      resources: 'Recurso',
    };

    onAdd({
      id: `custom-${Date.now()}`,
      name: cleanName,
      url: parsed.toString(),
      domainLabel: parsed.host + (parsed.pathname !== '/' ? parsed.pathname : ''),
      description:
        description.trim() || 'Acceso directo agregado manualmente al Hub Operativo.',
      category,
      suite: category === 'cloud' ? 'facil' : 'legacy',
      badge: category === 'cloud' ? 'Sistema Fácil' : badgeMap[category],
      tagLabel: tagLabel.trim() || 'Personalizado',
      icon: 'link',
      highlight: 'emerald',
      isCustom: true,
    });

    setName('');
    setUrl('');
    setDescription('');
    setTagLabel('Personalizado');
    setError('');
    onClose();
  };

  return (
    <PortalDialog
      open={open}
      onClose={onClose}
      titleId={titleId}
      title="Agregar Enlace Personalizado"
      subtitle="Sumá un acceso web, IP local de servidor o sistema propio al portal"
      maxWidthClass="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="custom-name" className="block text-xs font-medium text-[#D1D5DB]">
            Nombre del sistema o enlace
          </label>
          <input
            id="custom-name"
            type="text"
            required
            placeholder="Ej. Servidor SGU Depósito"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#262E3D] bg-[#0C0F14] px-3 py-2 text-sm text-[#F3F4F6] placeholder-[#6B7280] focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="custom-url" className="block text-xs font-medium text-[#D1D5DB]">
            URL de acceso (https:// o http://)
          </label>
          <input
            id="custom-url"
            type="text"
            required
            placeholder="https://mi-sistema.web.app o http://192.168.1.50:5000"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#262E3D] bg-[#0C0F14] px-3 py-2 font-mono text-xs text-[#F3F4F6] placeholder-[#6B7280] focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="custom-category" className="block text-xs font-medium text-[#D1D5DB]">
              Categoría
            </label>
            <select
              id="custom-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PlatformCategory)}
              className="mt-1.5 w-full rounded-xl border border-[#262E3D] bg-[#0C0F14] px-3 py-2 text-xs text-[#F3F4F6] focus:border-emerald-500 focus:outline-none"
            >
              <option value="cloud">Sistema Fácil (Firebase)</option>
              <option value="netlify">Netlify</option>
              <option value="desktop">SGU / Local LAN</option>
              <option value="miniapps">Mini Apps Web</option>
              <option value="resources">Recursos / Docs</option>
            </select>
          </div>
          <div>
            <label htmlFor="custom-tag" className="block text-xs font-medium text-[#D1D5DB]">
              Etiqueta corta
            </label>
            <input
              id="custom-tag"
              type="text"
              value={tagLabel}
              onChange={(e) => setTagLabel(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#262E3D] bg-[#0C0F14] px-3 py-2 text-xs text-[#F3F4F6] focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="custom-desc" className="block text-xs font-medium text-[#D1D5DB]">
            Descripción operativa (opcional)
          </label>
          <textarea
            id="custom-desc"
            rows={2}
            placeholder="Uso rápido, sucursal o notas clave..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#262E3D] bg-[#0C0F14] px-3 py-2 text-xs text-[#F3F4F6] placeholder-[#6B7280] focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#2A3342] bg-[#1B202C] px-4 py-2 text-xs font-semibold text-[#D1D5DB] hover:bg-[#232A39]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#10B981] px-4 py-2 text-xs font-semibold text-[#06130E] hover:bg-[#34D399]"
          >
            Guardar en Portal
          </button>
        </div>
      </form>
    </PortalDialog>
  );
}
