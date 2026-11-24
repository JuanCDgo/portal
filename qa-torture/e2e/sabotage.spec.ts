import { test, expect } from '@playwright/test';
import { isolateAndMonitor, assertNotWhiteScreen } from './helpers';

test.describe('Capa 4 — Flujos Críticos, Sabotaje de Red y Responsive', () => {
  test('Flujos principales (Filtros, Apps Laborales, Buscador, QR, Agregar Enlace y Fijados)', async ({
    page,
  }) => {
    const errors = await isolateAndMonitor(page);
    await page.goto('./', { waitUntil: 'networkidle' });
    await assertNotWhiteScreen(page);

    // Verifica sección Apps Laborales visible en vista general
    await expect(page.getByRole('heading', { name: /Apps Laborales/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'KaizenPareto' })).toBeVisible();

    // Filtrar por Apps Laborales
    await page.getByRole('button', { name: /Apps Laborales/i }).click();
    await expect(page.getByRole('heading', { name: 'Caminata Gemba' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Control Planta Patria v1.2' })).toBeVisible();

    // Buscar con el input
    const searchInput = page.getByRole('searchbox', { name: /Buscar sistema/i });
    await searchInput.fill('KaizenPareto');
    await expect(page.getByRole('heading', { name: 'KaizenPareto' })).toBeVisible();
    await searchInput.fill('');

    // Abrir modal QR de una app y cerrar
    await page.getByRole('button', { name: /Ver código QR de KaizenPareto/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /Cerrar/i }).first().click();

    // Sabotaje 2: Doble/triple clic en Agregar Enlace y crear un enlace personalizado
    await page.getByRole('button', { name: /Agregar Enlace/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.locator('#custom-name').fill('Tablero QA Test');
    await page.locator('#custom-url').fill('http://127.0.0.1:9999');
    await page.locator('#custom-category').selectOption('work');
    await page.getByRole('button', { name: /Guardar en Portal/i }).click();
    await expect(page.getByRole('heading', { name: 'Tablero QA Test' })).toBeVisible();

    // Eliminar enlace personalizado
    await page.getByRole('button', { name: /Eliminar enlace personalizado Tablero QA Test/i }).click();

    expect(errors.pageErrors).toEqual([]);
    expect(errors.consoleErrors).toEqual([]);
    expect(errors.badResponses).toEqual([]);
  });

  test('Sabotaje 1 — Offline + Reconexión + F5 sin crash ni pérdida de estado', async ({
    page,
    context,
  }) => {
    const errors = await isolateAndMonitor(page);
    await page.goto('./', { waitUntil: 'networkidle' });
    await assertNotWhiteScreen(page);

    // Fijar KaizenPareto
    await page.getByRole('button', { name: /Fijar KaizenPareto arriba/i }).click();

    // Cortar red y navegar entre filtros offline
    await context.setOffline(true);
    await page.getByRole('button', { name: /^Fijados \(/ }).click();
    await expect(page.getByRole('heading', { name: 'KaizenPareto' })).toBeVisible();

    // Reconectar y recargar (F5)
    await context.setOffline(false);
    await page.reload({ waitUntil: 'networkidle' });
    await assertNotWhiteScreen(page);

    // Verificar persistencia del pin tras F5
    await page.getByRole('button', { name: /^Fijados \(/ }).click();
    await expect(page.getByRole('heading', { name: 'KaizenPareto' })).toBeVisible();

    expect(errors.pageErrors).toEqual([]);
    expect(errors.consoleErrors).toEqual([]);
    expect(errors.badResponses).toEqual([]);
  });

  test('Sabotaje 3 — Responsive Mobile 390x844 sin desborde horizontal (<= 16px)', async ({
    page,
  }) => {
    const errors = await isolateAndMonitor(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./', { waitUntil: 'networkidle' });
    await assertNotWhiteScreen(page);

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(16);

    expect(errors.pageErrors).toEqual([]);
    expect(errors.consoleErrors).toEqual([]);
    expect(errors.badResponses).toEqual([]);
  });
});
