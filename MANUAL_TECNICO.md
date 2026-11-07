# 🛠️ Manual Técnico · Portal Central de Mini Apps

Documentación técnica del lanzador central (`portal`) de la suite de Mini Apps.

---

## 🏗️ 1. Arquitectura y Diseño

- **Stack:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES6+).
- **Layout Responsive:**
  - Contenedor principal `max-w-6xl` centrado.
  - Grilla CSS (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch`) donde cada tarjeta (`[data-app-card]`) utiliza `flex flex-col justify-between` para garantizar alturas uniformes y alineación inferior perfecta de los botones.
- **Motor QR Dual:**
  - `qrcode.min.js` local con fallback automático a CDN (`cdnjs`) y segundo fallback de imagen vía `QuickChart.io` en `showAppQR(name, url, icon)`.
- **Buscador Reactivo Sin Acentos:**
  - `filterPortalApps(query)` normaliza el texto con `normalize('NFD').replace(/[\u0300-\u036f]/g, '')` y filtra instantáneamente las tarjetas `[data-app-card]`.

---

## 📚 2. Estructura de Enlaces a Manuales

Cada una de las 12 tarjetas incluye dos enlaces directos al repositorio correspondiente en GitHub (`JuanCDgo/<repo>`):
- `https://github.com/JuanCDgo/<repo>/blob/main/MANUAL_USUARIO.md`
- `https://github.com/JuanCDgo/<repo>/blob/main/MANUAL_TECNICO.md`

### Repositorios vinculados (12):
1. `peluqueria`
2. `barberia`
3. `dentista`
4. `manucura`
5. `peluqueria-canina`
6. `costos-comida`
7. `rotiseria`
8. `gomeria`
9. `fidelizacion`
10. `bebidas` (incluye acceso directo a tienda pública y `?admin=1`)
11. `calidad`
12. `compartir-abonos`
