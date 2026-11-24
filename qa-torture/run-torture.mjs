import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { runStaticAudit } from './checks/static-audit.mjs';
import { runElectronAudit } from './checks/electron-audit.mjs';

const ROOT = process.cwd();
const ARTIFACTS_DIR = path.join(ROOT, 'qa-torture/artifacts');
fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

function runCliLayer(layerName, cmd) {
  const start = Date.now();
  try {
    const out = execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, DISABLE_HMR: 'true', VITE_FIREBASE_API_KEY: '' },
    });
    return {
      layer: layerName,
      passed: true,
      durationMs: Date.now() - start,
      checks: [{ name: cmd, ok: true, details: out.trim().slice(-1500) || 'OK' }],
    };
  } catch (err) {
    const combined = `${err.stdout || ''}\n${err.stderr || ''}`.trim();
    return {
      layer: layerName,
      passed: false,
      durationMs: Date.now() - start,
      checks: [{ name: cmd, ok: false, details: combined.slice(-2000) || 'Falló la ejecución.' }],
    };
  }
}

console.log('=== Iniciando Protocolo Estándar de Tortura QA (7 Capas) — Hub Operativo ===\n');

const reportLayers = [];

console.log('-> Ejecutando Capa 1 (Salud Estática, Build y Seguridad)...');
reportLayers.push(runStaticAudit());

console.log('-> Ejecutando Capa 2 (Electron Audit)...');
reportLayers.push(runElectronAudit());

console.log('-> Ejecutando Capa 3 (Fuzzing Vitest + fast-check)...');
reportLayers.push(
  runCliLayer(
    'Capa 3 — Fuzzing / Property-Based Testing (Vitest + fast-check)',
    'npx vitest run qa-torture/fuzz/logic.fuzz.test.ts'
  )
);

console.log('-> Ejecutando Capa 4 (Sabotaje de Red, Concurrencia y Responsive)...');
reportLayers.push(
  runCliLayer(
    'Capa 4 — Flujos Críticos, Sabotaje de Red y Responsive (Playwright)',
    'npx playwright test -c qa-torture/playwright.config.ts qa-torture/e2e/sabotage.spec.ts'
  )
);

console.log('-> Ejecutando Capa 5 (Accesibilidad WCAG AA con axe-core)...');
reportLayers.push(
  runCliLayer(
    'Capa 5 — Accesibilidad Automática WCAG AA (@axe-core/playwright)',
    'npx playwright test -c qa-torture/playwright.config.ts qa-torture/e2e/a11y.spec.ts'
  )
);

console.log('-> Ejecutando Capa 6 (Modo Mono Caótico con gremlins.js)...');
reportLayers.push(
  runCliLayer(
    'Capa 6 — Modo Mono Caótico (Playwright + gremlins.js)',
    'npx playwright test -c qa-torture/playwright.config.ts qa-torture/e2e/monkey.spec.ts'
  )
);

console.log('-> Ejecutando Capa 7 (Estrés de Volumen y Memoria)...');
reportLayers.push(
  runCliLayer(
    'Capa 7 — Estrés de Volumen y Memoria (Playwright)',
    'npx playwright test -c qa-torture/playwright.config.ts qa-torture/e2e/stress-volume.spec.ts'
  )
);

let stressSummary = '';
const stressPath = path.join(ARTIFACTS_DIR, 'stress-metrics.json');
if (fs.existsSync(stressPath)) {
  try {
    const m = JSON.parse(fs.readFileSync(stressPath, 'utf-8'));
    stressSummary = `\n### Métricas de Estrés (Capa 7)\n- Dataset: **${m.dataset.customApps} enlaces personalizados + ${m.dataset.pinnedIds} fijados**\n- Carga inicial: **${m.initialLoadMs} ms** (límite < 10.000 ms)\n- Render filtro Apps Laborales: **${m.filterRenderMs} ms** (límite < 6.000 ms)\n- Nodos DOM máximos: **${m.maxDomNodes}** (límite < 15.000)\n- localStorage usado: **${m.localStorageKB} KB**\n- JS Heap: **${m.jsHeapMB !== null ? `${m.jsHeapMB} MB` : 'N/A'}**\n`;
  } catch {
    // ignore
  }
}

const passedCount = reportLayers.filter((l) => l.passed).length;
const allPassed = passedCount === reportLayers.length;

const md = [
  `# Reporte del Protocolo de Tortura QA (7 Capas) — Hub Operativo`,
  ``,
  `- **Fecha:** ${new Date().toISOString()}`,
  `- **Resultado Global:** ${allPassed ? '✅ APROBADO (7/7 capas en verde)' : `❌ FALLÓ (${passedCount}/${reportLayers.length} capas aprobadas)`}`,
  ``,
  `## Resumen por Capa`,
  `| Capa | Estado |`,
  `| :--- | :--- |`,
  ...reportLayers.map((l) => `| ${l.layer} | ${l.skipped ? '⏭️ Omitida (Web)' : l.passed ? '✅ PASS' : '❌ FAIL'} |`),
  stressSummary,
  `## Detalle Técnico`,
  ...reportLayers.flatMap((l) => [
    `### ${l.layer}`,
    ...l.checks.map(
      (c) =>
        `- **${c.name}**: ${c.ok ? '✅ OK' : '❌ FAIL'}\n\n\`\`\`text\n${c.details}\n\`\`\``
    ),
  ]),
].join('\n');

const reportPath = path.join(ROOT, 'qa-torture/TORTURE_REPORT.md');
fs.writeFileSync(reportPath, md, 'utf-8');

console.log(`\nReporte guardado en: ${reportPath}`);
console.log(`Resultado Global: ${passedCount}/${reportLayers.length} capas aprobadas.`);

if (!allPassed) {
  process.exit(1);
}
