import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

export function runElectronAudit() {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  const hasElectronConfig = Boolean(
    pkg.main?.includes('electron') ||
    Object.keys(pkg.scripts || {}).some((k) => k.includes('electron')) ||
    fs.existsSync(path.join(ROOT, 'electron'))
  );

  if (!hasElectronConfig) {
    return {
      layer: 'Capa 2 — Auditoría de Empaquetado y Seguridad Electron',
      skipped: true,
      passed: true,
      checks: [{ name: 'Electron no detectado', ok: true, details: 'Proyecto web puro, capa omitida.' }],
    };
  }

  const checks = [];
  let passed = true;
  const addCheck = (name, ok, details, severity = 'error') => {
    checks.push({ name, ok, details, severity });
    if (!ok && severity === 'error') passed = false;
  };

  const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const hasElectronDep = Boolean(allDeps.electron);
  const hasBuilderDep = Boolean(allDeps['electron-builder']);
  addCheck(
    'Dependencias de Electron en package.json',
    hasElectronDep && hasBuilderDep,
    hasElectronDep && hasBuilderDep
      ? `electron (${allDeps.electron}) y electron-builder (${allDeps['electron-builder']}) declarados.`
      : `Faltan en devDependencies: ${[!hasElectronDep && 'electron', !hasBuilderDep && 'electron-builder'].filter(Boolean).join(', ')}.`
  );

  const mainFile = pkg.main ? path.join(ROOT, pkg.main) : path.join(ROOT, 'electron/main.js');
  const mainExists = fs.existsSync(mainFile);
  addCheck('Archivo main de Electron', mainExists, mainExists ? `Encontrado: ${path.relative(ROOT, mainFile)}` : `No existe: ${mainFile}`);

  if (mainExists) {
    const mainCode = fs.readFileSync(mainFile, 'utf-8');

    const disablesWebSecurity = /webSecurity\s*:\s*false/.test(mainCode);
    addCheck(
      'Seguridad: webSecurity habilitado',
      !disablesWebSecurity,
      disablesWebSecurity
        ? 'PELIGRO: webSecurity: false está activo en BrowserWindow.'
        : 'webSecurity no está desactivado.'
    );

    const hasContextIsolation = /contextIsolation\s*:\s*true/.test(mainCode);
    const disablesNodeIntegration = /nodeIntegration\s*:\s*false/.test(mainCode);
    addCheck(
      'Seguridad: contextIsolation: true & nodeIntegration: false',
      hasContextIsolation && disablesNodeIntegration,
      hasContextIsolation && disablesNodeIntegration
        ? 'Aislamiento de contexto configurado correctamente.'
        : 'Revisar contextIsolation y nodeIntegration en BrowserWindow.'
    );

    const iconMatch = mainCode.match(/['"](\.\.\/[^'"]+\.(?:ico|png|icns))['"]/);
    if (iconMatch) {
      const resolvedIcon = path.resolve(path.dirname(mainFile), iconMatch[1]);
      const iconExists = fs.existsSync(resolvedIcon);
      addCheck(
        'Ícono de ventana de escritorio',
        iconExists,
        iconExists
          ? `Ícono encontrado en ${path.relative(ROOT, resolvedIcon)}`
          : `Falta el ícono referenciado en main.js: ${iconMatch[1]}.`,
        'warning'
      );
    }

    const hasSyncFs = /fs\.(writeFileSync|readFileSync)/.test(mainCode);
    const hasTryCatch = /try\s*\{[\s\S]*?fs\.(writeFileSync|readFileSync)/.test(mainCode);
    if (hasSyncFs) {
      addCheck(
        'Resiliencia IPC: try/catch en lectura/escritura de archivos',
        hasTryCatch,
        hasTryCatch
          ? 'Operaciones de archivo en IPC protegidas con try/catch.'
          : 'fs.writeFileSync / fs.readFileSync en ipcMain.handle SIN try/catch.'
      );
    }

    const preloadMatch = mainCode.match(/preload\s*:\s*path\.join\(__dirname,\s*['"]([^'"]+)['"]\)/);
    const preloadFilename = preloadMatch ? preloadMatch[1] : 'preload.js';
    const preloadPath = path.join(path.dirname(mainFile), preloadFilename);
    if (fs.existsSync(preloadPath)) {
      const preloadCode = fs.readFileSync(preloadPath, 'utf-8');
      const usesEsmImport = /^\s*import\s+/m.test(preloadCode);
      const sandboxDisabled = /sandbox\s*:\s*false/.test(mainCode);
      const esmTrap = usesEsmImport && (!sandboxDisabled || !preloadFilename.endsWith('.mjs'));
      addCheck(
        `Compatibilidad Preload (${preloadFilename} vs Sandbox en Electron)`,
        !esmTrap,
        esmTrap
          ? `TRAMPA CRÍTICA DE ELECTRON: ${preloadFilename} usa import (ESM) con sandbox activo o sin extensión .mjs. Usar .cjs con require().`
          : `Preload (${preloadFilename}) compatible con el runtime de Electron.`
      );
    } else {
      addCheck('Archivo Preload referenciado en main.js', false, `No existe: ${preloadPath}`);
    }
  }

  const distIndex = path.join(ROOT, 'dist/index.html');
  addCheck(
    'Bundle web para Electron (dist/index.html)',
    fs.existsSync(distIndex),
    fs.existsSync(distIndex) ? 'dist/index.html listo para empaquetar.' : 'Falta dist/index.html (correr npm run build).'
  );

  return {
    layer: 'Capa 2 — Auditoría de Empaquetado y Seguridad Electron',
    passed,
    checks,
  };
}
