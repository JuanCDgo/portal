import { test, expect } from '@playwright/test';
import path from 'path';
import { isolateAndMonitor, assertNotWhiteScreen } from './helpers';

test('Capa 6 — Modo Mono Caótico (gremlins.js, 250+ acciones deterministas)', async ({ page }) => {
  const errors = await isolateAndMonitor(page);

  await page.addInitScript(() => {
    window.alert = () => {};
    window.confirm = () => true;
    window.prompt = () => '';
    // Evitar que links externos target="_blank" abran ventanas reales en el mono
    window.open = () => null;
  });

  await page.goto('./', { waitUntil: 'networkidle' });
  await assertNotWhiteScreen(page);

  // Evitar navegación fuera de la página por <a> en el mono caótico
  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (e) => {
        const anchor = (e.target as HTMLElement | null)?.closest('a');
        if (anchor) e.preventDefault();
      },
      true
    );
  });

  const gremlinsPath = path.resolve(
    process.cwd(),
    'node_modules/gremlins.js/dist/gremlins.min.js'
  );
  await page.addScriptTag({ path: gremlinsPath });

  await page.evaluate(async () => {
    const g = (window as unknown as { gremlins: any }).gremlins;
    const horde = g.createHorde({
      randomizer: new g.Chance(20261124),
      species: [
        g.species.clicker({
          clickTypes: ['click'],
          canClick: (el: Element) => !el.closest('a'),
        }),
        g.species.formFiller(),
        g.species.typer(),
        g.species.scroller(),
      ],
      strategies: [g.strategies.distribution({ nb: 260, delay: 4 })],
    });
    await horde.unleash();
  });

  await assertNotWhiteScreen(page);
  expect(errors.pageErrors).toEqual([]);
  expect(errors.consoleErrors).toEqual([]);
  expect(errors.badResponses).toEqual([]);
});
