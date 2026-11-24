import type { Page } from '@playwright/test';

export interface ErrorCollectors {
  pageErrors: string[];
  consoleErrors: string[];
  badResponses: string[];
}

export async function isolateAndMonitor(page: Page): Promise<ErrorCollectors> {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const badResponses: string[] = [];

  page.on('pageerror', (err) => {
    pageErrors.push(err.message || String(err));
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('ERR_FAILED') && !text.includes('net::ERR_INTERNET_DISCONNECTED')) {
        consoleErrors.push(text);
      }
    }
  });

  page.on('response', (res) => {
    const url = res.url();
    if (
      (url.startsWith('http://127.0.0.1') || url.startsWith('http://localhost')) &&
      res.status() >= 400
    ) {
      badResponses.push(`${res.status()} ${url}`);
    }
  });

  // Regla de oro: abortar cualquier tráfico saliente fuera de localhost / 127.0.0.1 / data / blob
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (
      url.startsWith('http://127.0.0.1') ||
      url.startsWith('http://localhost') ||
      url.startsWith('data:') ||
      url.startsWith('blob:')
    ) {
      return route.continue();
    }
    return route.abort();
  });

  return { pageErrors, consoleErrors, badResponses };
}

export async function assertNotWhiteScreen(page: Page): Promise<void> {
  const rootText = await page.locator('#root').innerText();
  if (!rootText || rootText.trim().length < 20) {
    throw new Error('Pantalla blanca o #root vacío detectado.');
  }
}
