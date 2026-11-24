import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { isolateAndMonitor, assertNotWhiteScreen } from './helpers';

test('Capa 7 — Estrés de Volumen y Memoria (400 enlaces personalizados + filtros rápidos)', async ({
  page,
}) => {
  const errors = await isolateAndMonitor(page);

  // Pre-poblar localStorage con 400 apps personalizadas válidas (esquema real de Hub Operativo)
  const customApps = Array.from({ length: 400 }, (_, i) => ({
    id: `stress-app-${i + 1}`,
    name: `Sistema Stress #${i + 1}`,
    url: `http://127.0.0.1:${5000 + (i % 1000)}`,
    domainLabel: `127.0.0.1:${5000 + (i % 1000)}`,
    description: `Registro sintético de prueba de estrés de volumen y memoria número ${i + 1}.`,
    category: i % 3 === 0 ? 'work' : i % 3 === 1 ? 'cloud' : 'desktop',
    suite: i % 3 === 1 ? 'facil' : 'legacy',
    badge: i % 3 === 0 ? 'Apps Laborales' : 'Stress',
    tagLabel: `Lote ${Math.floor(i / 50) + 1}`,
    icon: i % 3 === 0 ? 'factory' : 'link',
    highlight: i % 3 === 0 ? 'amber' : 'emerald',
    isCustom: true,
  }));
  const pinnedIds = customApps.slice(0, 60).map((a) => a.id);

  await page.addInitScript(
    ({ appsJson, pinsJson }) => {
      localStorage.setItem('hub_operativo_custom_apps_v2', appsJson);
      localStorage.setItem('hub_operativo_pinned_v2', pinsJson);
    },
    { appsJson: JSON.stringify(customApps), pinsJson: JSON.stringify(pinnedIds) }
  );

  const t0 = Date.now();
  await page.goto('./', { waitUntil: 'networkidle' });
  await assertNotWhiteScreen(page);
  const initialLoadMs = Date.now() - t0;

  const tFilter = Date.now();
  await page.getByRole('button', { name: /Apps Laborales/i }).click();
  await expect(page.getByRole('heading', { name: 'KaizenPareto' })).toBeVisible();
  const filterRenderMs = Date.now() - tFilter;

  const metrics = await page.evaluate(() => {
    const domNodes = document.querySelectorAll('*').length;
    let lsBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '';
      const v = localStorage.getItem(k) || '';
      lsBytes += (k.length + v.length) * 2;
    }
    const perfAny = performance as unknown as { memory?: { usedJSHeapSize: number } };
    const jsHeapMB = perfAny.memory
      ? Number((perfAny.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2))
      : null;
    return {
      domNodes,
      localStorageKB: Number((lsBytes / 1024).toFixed(1)),
      jsHeapMB,
    };
  });

  const outDir = path.resolve(process.cwd(), 'qa-torture/artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'stress-metrics.json'),
    JSON.stringify(
      {
        dataset: { customApps: customApps.length, pinnedIds: pinnedIds.length },
        initialLoadMs,
        filterRenderMs,
        maxDomNodes: metrics.domNodes,
        localStorageKB: metrics.localStorageKB,
        jsHeapMB: metrics.jsHeapMB,
      },
      null,
      2
    ),
    'utf-8'
  );

  expect(initialLoadMs).toBeLessThan(10_000);
  expect(filterRenderMs).toBeLessThan(6_000);
  expect(metrics.domNodes).toBeLessThan(15_000);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.badResponses).toEqual([]);
});
