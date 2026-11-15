# Manual Técnico — Hub Operativo (Portal PWA)

## 1. Arquitectura y Stack

- **Framework:** React 19 + TypeScript + Vite 6 (`base: '/portal/'`).
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`), esquema oscuro nativo (`color-scheme: dark`), tokens de diseño industriales de bajo contraste con bordes de 1px (`#0C0F14` / `#141820` / `#232A36`) y acentos operativos en esmeralda (`#10B981`), ámbar y cielo. Cero emojis decorativos; iconografía vectorizada con `lucide-react`.
- **PWA e Instalabilidad:** `vite-plugin-pwa` con Workbox (`registerType: 'autoUpdate'`, precache de activos estáticos, `manifest.webmanifest` con iconos PNG `192x192`, `512x512` maskable y SVG escalable).
- **QR Offline:** librería `qrcode` generando data URLs locales en navegador (`QRCode.toDataURL`) sin llamadas a APIs externas.
- **Modales accesibles:** componente `PortalDialog` basado en elemento nativo `<dialog closedby="any">` con `showModal()`, contención de scroll (`overscroll-behavior: contain` en `:modal` y `::backdrop`) y fallback `pointerdown`/`pointerup` para navegadores sin `closedBy`.
- **Persistencia local y respaldo:** `localStorage` bajo claves `hub_operativo_pinned_v2` y `hub_operativo_custom_apps_v2`, con exportación e importación en formato JSON (`PortalBackupData`).

---

## 2. Estructura de Archivos

- `index.html` — Meta tags PWA, iOS `apple-mobile-web-app-*` y esquema de color oscuro.
- `vite.config.ts` — Configuración de Vite, Tailwind y `VitePWA`.
- `public/` — Iconos vectoriales (`icon.svg`) y bitmaps PWA (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).
- `src/data/apps.ts` — Catálogo tipado (`INITIAL_APPS`) de enlaces verificados (Firebase, Netlify, .NET/LAN, GitHub Pages y Recursos).
- `src/components/`:
  - `AppIcon.tsx` — Mapa de iconos `lucide-react`.
  - `AppCard.tsx` — Tarjeta operativa reutilizable con estado de pin, copiado, QR y acciones secundarias.
  - `PortalDialog.tsx` — Wrapper nativo de `<dialog>` modal.
  - `QrDialog.tsx` — Visor QR local, copia rápida y enlace a `api.whatsapp.com/send`.
  - `InstallDialog.tsx` — Guía Android/iOS/PC, disparador `beforeinstallprompt` y generador de archivo `.url` para Windows.
  - `AddLinkDialog.tsx` — Formulario de alta de enlaces personalizados con validación `URL`.
- `src/App.tsx` — Estado principal, filtros, buscador `Ctrl+K` y gestión de backup JSON.

---

## 3. Desarrollo y Despliegue

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Compilación de producción (TypeScript + Vite + PWA SW)
npm run build

# Despliegue a rama gh-pages en GitHub Pages
npm run deploy
```

La rama `main` aloja el código fuente limpio y la rama `gh-pages` publica el contenido compilado de `dist/` en `https://juancdgo.github.io/portal/`.
