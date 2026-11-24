import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';
import { isolateAndMonitor, assertNotWhiteScreen } from './helpers';

test('Capa 5 — Auditoría WCAG 2.0/2.1 AA con @axe-core/playwright', async ({ page }) => {
  await isolateAndMonitor(page);
  await page.goto('./', { waitUntil: 'networkidle' });
  await assertNotWhiteScreen(page);

  const mainResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  // También auditar vista filtrada de Apps Laborales
  await page.getByRole('button', { name: /Apps Laborales/i }).click();
  const workResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const outDir = path.resolve(process.cwd(), 'qa-torture/artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'a11y-report.json'),
    JSON.stringify({ main: mainResults.violations, work: workResults.violations }, null, 2),
    'utf-8'
  );

  const blocking = [...mainResults.violations, ...workResults.violations].filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );

  expect(
    blocking,
    `Se encontraron violaciones críticas/serias WCAG AA: ${JSON.stringify(
      blocking.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length })),
      null,
      2
    )}`
  ).toEqual([]);
});
