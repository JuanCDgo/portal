import type { AppEntry } from '../types';

export const PORTAL_URL = 'https://juancdgo.github.io/portal/';

export const INITIAL_APPS: AppEntry[] = [
  // --- SISTEMA FÁCIL (ESTÁNDAR FIREBASE OFICIAL · BANDERA KIOSCOFÁCIL) ---
  {
    id: 'kiosco-facil',
    name: 'KioscoFácil',
    url: 'https://kiosco-facil-ar.web.app',
    domainLabel: 'kiosco-facil-ar.web.app',
    description:
      'App bandera y estándar oficial del sistema Fácil: POS rápido offline, stock, escáner, caja y roles.',
    category: 'cloud',
    suite: 'facil',
    badge: 'Sistema Fácil',
    tagLabel: 'Bandera · Estándar',
    icon: 'store',
    highlight: 'emerald',
  },
  {
    id: 'maldito-flanders',
    name: 'Maldito Flanders',
    url: 'https://maldito-flanders-ar.web.app',
    domainLabel: 'maldito-flanders-ar.web.app',
    description:
      'Catálogo completo de bebidas, promos, pedidos rápidos y gestión de repartos en tiempo real.',
    category: 'cloud',
    suite: 'facil',
    badge: 'Sistema Fácil',
    tagLabel: 'Bebidas y Repartos',
    icon: 'beer',
    highlight: 'emerald',
    secondaryAction: {
      label: 'Versión Clásica',
      url: 'https://juancdgo.github.io/bebidas/',
    },
  },
  {
    id: 'bebidas-facil',
    name: 'BebidasFácil',
    url: 'https://bebidas-facil-ar.web.app',
    domainLabel: 'bebidas-facil-ar.web.app',
    description:
      'Mostrador express de bebidas con buscador instantáneo, combos, escala por cantidad y cierre diario.',
    category: 'cloud',
    suite: 'facil',
    badge: 'Sistema Fácil',
    tagLabel: 'Mostrador Express',
    icon: 'basket',
    highlight: 'emerald',
  },
  {
    id: 'lavadero-facil',
    name: 'LavaderoFácil',
    url: 'https://lavadero-facil-ar.web.app',
    domainLabel: 'lavadero-facil-ar.web.app',
    description:
      'Boxes de lavado, agenda por horarios, fichas con sellos, avisos WhatsApp y caja diaria offline.',
    category: 'cloud',
    suite: 'facil',
    badge: 'Sistema Fácil',
    tagLabel: 'Boxes y Turnos',
    icon: 'car',
    highlight: 'emerald',
    secondaryAction: {
      label: 'Versión Clásica',
      url: 'https://juancdgo.github.io/lavadero/',
    },
  },
  {
    id: 'catalogo-facil',
    name: 'CatálogoFácil',
    url: 'https://catalogo-facil-ar.web.app',
    domainLabel: 'catalogo-facil-ar.web.app',
    description:
      'Vitrina web Vice Sunset (Día/Noche) con Placa Story IG/TikTok 9:16 + QR, variantes y pedidos WhatsApp.',
    category: 'cloud',
    suite: 'facil',
    badge: 'Sistema Fácil',
    tagLabel: 'Vitrina & Story IG',
    icon: 'sparkles',
    highlight: 'emerald',
  },
  {
    id: 'superpos-pyme',
    name: 'SuperPOS PyME',
    url: 'https://superpos-pyme-ar.web.app',
    domainLabel: 'superpos-pyme-ar.web.app',
    description:
      'POS + ERP + CRM PyME Argentina (Modo Día/Noche) con nube Firebase, QR Alias/Mercado Pago, fiado, stock y WhatsApp.',
    category: 'cloud',
    suite: 'facil',
    badge: 'Sistema Fácil',
    tagLabel: 'POS + ERP + CRM',
    icon: 'store',
    highlight: 'emerald',
  },
  {
    id: 'placa-facil',
    name: 'PlacaFácil',
    url: 'https://juancdgo.github.io/placa-facil/',
    domainLabel: 'juancdgo.github.io/placa-facil',
    description:
      'Cartelería comercial y placas 9:16, 4:5 y Góndola A4 PDF (Oferta, Lista de Precios, QR Alias, Horarios) 100% offline y sin marca de agua.',
    category: 'miniapps',
    suite: 'facil',
    badge: 'Sistema Fácil',
    tagLabel: 'Placas & A4 PDF',
    icon: 'sparkles',
    highlight: 'emerald',
    manualUserUrl: 'https://github.com/JuanCDgo/placa-facil/blob/main/MANUAL_USUARIO.md',
    manualTechUrl: 'https://github.com/JuanCDgo/placa-facil/blob/main/MANUAL_TECNICO.md',
  },

  // --- NETLIFY ---
  {
    id: 'stock-negocios',
    name: 'Stock para Negocios',
    url: 'https://stockparanegocios.netlify.app',
    domainLabel: 'stockparanegocios.netlify.app',
    description:
      'Control integral de inventario, movimientos de mercadería, depósitos y alertas de reposición.',
    category: 'netlify',
    badge: 'Netlify',
    tagLabel: 'Inventario',
    icon: 'package',
    highlight: 'sky',
  },
  {
    id: 'peluqueria-2026',
    name: 'Peluquería 2026',
    url: 'https://peluqueria-2026.netlify.app',
    domainLabel: 'peluqueria-2026.netlify.app',
    description:
      'Gestión de salón en la nube, agenda diaria, servicios por profesional y balance de caja.',
    category: 'netlify',
    badge: 'Netlify',
    tagLabel: 'Salón Cloud',
    icon: 'scissors',
    highlight: 'sky',
  },
  {
    id: 'rotiseria-v1',
    name: 'Rotisería v1',
    url: 'https://roticeria-v1.netlify.app',
    domainLabel: 'roticeria-v1.netlify.app',
    description:
      'Comandera digital para pedidos de rotisería, retiro en local y seguimiento rápido en cocina.',
    category: 'netlify',
    badge: 'Netlify',
    tagLabel: 'Comandas Cloud',
    icon: 'utensils',
    highlight: 'sky',
  },

  // --- SISTEMAS SGU & ESCRITORIO / LAN ---
  {
    id: 'sistema-sgu',
    name: 'Sistema SGU (.NET 10)',
    url: 'https://juancdgo.github.io/sistema-gestion-unificado/',
    domainLabel: 'github.com/JuanCDgo/sgu-clean-architecture',
    description:
      'Sistema de Gestión Unificada Clean Architecture con SQLite WAL, servidor LAN y módulo web.',
    category: 'desktop',
    badge: '.NET 10 / LAN',
    tagLabel: 'Gestión Unificada',
    icon: 'server',
    highlight: 'amber',
    secondaryAction: {
      label: 'Local :5000',
      url: 'http://localhost:5000',
    },
    extraAction: {
      label: 'Repo .NET',
      url: 'https://github.com/JuanCDgo/sgu-clean-architecture',
    },
  },
  {
    id: 'control-calidad-fabrica',
    name: 'Control Calidad Fábrica',
    url: 'https://juancdgo.github.io/calidad/',
    domainLabel: 'juancdgo.github.io/calidad',
    description:
      'Auditoría de planta offline-first con registro fotográfico, análisis Pareto y modo red local.',
    category: 'desktop',
    badge: 'Planta / PWA',
    tagLabel: 'Calidad Industrial',
    icon: 'factory',
    highlight: 'amber',
    secondaryAction: {
      label: 'Repo Fábrica',
      url: 'https://github.com/JuanCDgo/control-calidad-fabrica',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/calidad/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/calidad/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'pizzas-martina',
    name: 'Pizzas Martina',
    url: 'https://github.com/JuanCDgo/pizzas-martina',
    domainLabel: 'github.com/JuanCDgo/pizzas-martina',
    description:
      'Sistema y repositorio de gestión para pizzería: carta, armado de pedidos y operación diaria.',
    category: 'desktop',
    badge: 'Repositorio',
    tagLabel: 'Gastronomía',
    icon: 'pizza',
    highlight: 'amber',
  },

  // --- MINI APPS WEB (GITHUB PAGES) ---
  {
    id: 'maldito-flanders-clasica',
    name: 'Maldito Flanders (Clásica)',
    url: 'https://juancdgo.github.io/bebidas/',
    domainLabel: 'juancdgo.github.io/bebidas',
    description:
      'Edición clásica de 336 productos con promociones, vista de motos repartidoras y panel dueño.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Edición v1',
    icon: 'beer',
    secondaryAction: {
      label: 'Dueño',
      url: 'https://juancdgo.github.io/bebidas/?admin=1',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/bebidas/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/bebidas/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'lavadero',
    name: 'Lavadero · Autos & Motos',
    url: 'https://juancdgo.github.io/lavadero/',
    domainLabel: 'juancdgo.github.io/lavadero',
    description:
      'Turnero por boxes, avisos por WhatsApp, historial por patente y pases de fidelización.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Turnos Boxes',
    icon: 'car',
    secondaryAction: {
      label: 'Turnero',
      url: 'https://juancdgo.github.io/lavadero/?reservar=1',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/lavadero/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/lavadero/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'peluqueria',
    name: 'Peluquería & Color',
    url: 'https://juancdgo.github.io/peluqueria/',
    domainLabel: 'juancdgo.github.io/peluqueria',
    description:
      'Agenda de estilistas, fórmulas de coloración, reservas web y liquidación diaria del salón.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Agenda Salón',
    icon: 'scissors',
    secondaryAction: {
      label: 'Turnero',
      url: 'https://juancdgo.github.io/peluqueria/?booking=true',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/peluqueria/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/peluqueria/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'barberia',
    name: 'Barbería & Barbershop',
    url: 'https://juancdgo.github.io/barberia/',
    domainLabel: 'juancdgo.github.io/barberia',
    description:
      'Turnos para barberos, corte y barba, control de sillas y envío rápido de confirmaciones.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Turnos Barbero',
    icon: 'scissors',
    secondaryAction: {
      label: 'Turnero',
      url: 'https://juancdgo.github.io/barberia/?booking=true',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/barberia/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/barberia/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'dentista',
    name: 'Consultorio Odontológico',
    url: 'https://juancdgo.github.io/dentista/',
    domainLabel: 'juancdgo.github.io/dentista',
    description:
      'Turnero odontológico, ortodoncia, seguimiento de pacientes y recordatorios programados.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Salud & Turnos',
    icon: 'stethoscope',
    secondaryAction: {
      label: 'Turnero',
      url: 'https://juancdgo.github.io/dentista/?booking=true',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/dentista/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/dentista/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'manucura',
    name: 'Manicura & Lash Spa',
    url: 'https://juancdgo.github.io/manucura/',
    domainLabel: 'juancdgo.github.io/manucura',
    description:
      'Estética, uñas, cejas y lifting con reserva de horario y registro de servicios.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Estética',
    icon: 'sparkles',
    secondaryAction: {
      label: 'Turnero',
      url: 'https://juancdgo.github.io/manucura/?booking=true',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/manucura/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/manucura/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'peluqueria-canina',
    name: 'Peluquería Canina & Spa',
    url: 'https://juancdgo.github.io/peluqueria-canina/',
    domainLabel: 'juancdgo.github.io/peluqueria-canina',
    description:
      'Gestión de baño y corte por raza, ficha de mascotas y avisos automáticos al dueño.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Mascotas',
    icon: 'paw',
    secondaryAction: {
      label: 'Turnero',
      url: 'https://juancdgo.github.io/peluqueria-canina/?booking=true',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/peluqueria-canina/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/peluqueria-canina/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'rotiseria-mini',
    name: 'Rotisería & Minutas',
    url: 'https://juancdgo.github.io/rotiseria/',
    domainLabel: 'juancdgo.github.io/rotiseria',
    description:
      'Carta web takeaway y delivery, armador rápido de empanadas por docena y fidelización.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Delivery Web',
    icon: 'utensils',
    secondaryAction: {
      label: 'Empanadas',
      url: 'https://juancdgo.github.io/rotiseria/?view=empanadas',
    },
    manualUserUrl:
      'https://github.com/JuanCDgo/rotiseria/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/rotiseria/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'costos-comida',
    name: 'Costos · Cocina & Comida',
    url: 'https://juancdgo.github.io/costos-comida/',
    domainLabel: 'juancdgo.github.io/costos-comida',
    description:
      'Calculadora de recetas, insumos, merma, packaging y cálculo de margen neto en ARS.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Escandallos',
    icon: 'utensils',
    manualUserUrl:
      'https://github.com/JuanCDgo/costos-comida/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/costos-comida/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'gomeria',
    name: 'Gomería · Motos & Bicis',
    url: 'https://juancdgo.github.io/gomeria/',
    domainLabel: 'juancdgo.github.io/gomeria',
    description:
      'Taller express, lista de tarifas, control de cuentas corrientes y aviso de retiro por WhatsApp.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Taller Express',
    icon: 'wrench',
    manualUserUrl:
      'https://github.com/JuanCDgo/gomeria/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/gomeria/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'fidelizacion',
    name: 'Club Fidelidad & Sellos',
    url: 'https://juancdgo.github.io/fidelizacion/',
    domainLabel: 'juancdgo.github.io/fidelizacion',
    description:
      'Pase digital de clientes frecuentes, acumulación de sellos, vencimientos y validación QR.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Fidelización',
    icon: 'award',
    manualUserUrl:
      'https://github.com/JuanCDgo/fidelizacion/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/fidelizacion/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'compartir-abonos',
    name: 'Compartir Abonos',
    url: 'https://juancdgo.github.io/compartir-abonos/',
    domainLabel: 'juancdgo.github.io/compartir-abonos',
    description:
      'Gestor de suscripciones y grupos familiares con prorrateo en pesos y recordatorio de cobro.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Suscripciones',
    icon: 'tv',
    manualUserUrl:
      'https://github.com/JuanCDgo/compartir-abonos/blob/main/MANUAL_USUARIO.md',
    manualTechUrl:
      'https://github.com/JuanCDgo/compartir-abonos/blob/main/MANUAL_TECNICO.md',
  },
  {
    id: 'mini-crm-preventa',
    name: 'Mini CRM Preventa',
    url: 'https://juancdgo.github.io/mini-crm-preventa/',
    domainLabel: 'juancdgo.github.io/mini-crm-preventa',
    description:
      'Seguimiento comercial de prospectos, visitas de preventa y estado de cotizaciones.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Preventa CRM',
    icon: 'trending',
  },
  {
    id: 'paretos-editables',
    name: 'Paretos Editables',
    url: 'https://juancdgo.github.io/paretos-editables/',
    domainLabel: 'juancdgo.github.io/paretos-editables',
    description:
      'Tablero interactivo 80/20 para cargar categorías de fallas o ventas y visualizar Pareto al instante.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Análisis 80/20',
    icon: 'chart',
  },
  {
    id: 'juan-marcelo',
    name: 'Sitio Juan Marcelo',
    url: 'https://juancdgo.github.io/juan-marcelo/',
    domainLabel: 'juancdgo.github.io/juan-marcelo',
    description:
      'Página personal y presentación web publicada directamente en GitHub Pages.',
    category: 'miniapps',
    badge: 'GitHub Pages',
    tagLabel: 'Web Personal',
    icon: 'link',
  },

  // --- RECURSOS Y REPOSITORIOS ---
  {
    id: 'drive-mini-apps',
    name: 'Carpeta Drive · Mini Apps',
    url: 'https://drive.google.com/drive/folders/1a3Md1lIrHjRvoO7RINSGyJ3KxfJUsFeF',
    domainLabel: 'drive.google.com',
    description:
      'Carpeta compartida en Google Drive con respaldos, recursos gráficos e instaladores.',
    category: 'resources',
    badge: 'Google Drive',
    tagLabel: 'Archivos Cloud',
    icon: 'folder',
  },
  {
    id: 'github-juancdgo',
    name: 'GitHub · JuanCDgo',
    url: 'https://github.com/JuanCDgo',
    domainLabel: 'github.com/JuanCDgo',
    description:
      'Cuenta central de repositorios, código fuente, historial de cambios y manuales.',
    category: 'resources',
    badge: 'GitHub',
    tagLabel: 'Código Fuente',
    icon: 'github',
  },
];
