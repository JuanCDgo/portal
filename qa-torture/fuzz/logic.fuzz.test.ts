import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { INITIAL_APPS, PORTAL_URL } from '../../src/data/apps';
import type { AppEntry, PlatformCategory, PortalBackupData } from '../../src/types';

const VALID_CATEGORIES = new Set<PlatformCategory>([
  'cloud',
  'work',
  'netlify',
  'desktop',
  'miniapps',
  'resources',
]);

function normalizeAndValidateUrl(raw: string): string | null {
  const clean = raw.trim();
  if (!clean) return null;
  try {
    const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function parsePortalBackup(rawJson: string): {
  pinnedIds: string[];
  customApps: AppEntry[];
} | null {
  try {
    const parsed = JSON.parse(rawJson) as Partial<PortalBackupData>;
    if (!parsed || typeof parsed !== 'object') return null;
    const pinnedIds = Array.isArray(parsed.pinnedIds)
      ? Array.from(new Set(parsed.pinnedIds.filter((x): x is string => typeof x === 'string')))
      : [];
    const customApps = Array.isArray(parsed.customApps)
      ? parsed.customApps.filter(
          (x): x is AppEntry =>
            Boolean(
              x &&
                typeof x === 'object' &&
                typeof x.id === 'string' &&
                typeof x.name === 'string' &&
                typeof x.url === 'string'
            )
        )
      : [];
    return { pinnedIds, customApps };
  } catch {
    return null;
  }
}

function sortWithPinned(items: AppEntry[], pinnedIds: string[]): AppEntry[] {
  return [...items].sort((a, b) => {
    const aPin = pinnedIds.includes(a.id) ? 0 : 1;
    const bPin = pinnedIds.includes(b.id) ? 0 : 1;
    return aPin - bPin;
  });
}

describe('Capa 3 — Fuzzing / Property-Based Testing (Hub Operativo)', () => {
  it('catálogo INITIAL_APPS tiene IDs únicos, categorías válidas y URLs bien formadas', () => {
    expect(() => new URL(PORTAL_URL)).not.toThrow();
    const ids = new Set<string>();
    for (const app of INITIAL_APPS) {
      expect(app.id.trim().length).toBeGreaterThan(0);
      expect(ids.has(app.id)).toBe(false);
      ids.add(app.id);
      expect(VALID_CATEGORIES.has(app.category)).toBe(true);
      expect(app.name.trim().length).toBeGreaterThan(0);
      expect(app.description.trim().length).toBeGreaterThan(0);
      expect(() => new URL(app.url)).not.toThrow();
      if (app.secondaryAction) {
        expect(() => new URL(app.secondaryAction!.url)).not.toThrow();
      }
      if (app.extraAction) {
        expect(() => new URL(app.extraAction!.url)).not.toThrow();
      }
      if (app.manualUserUrl) {
        expect(() => new URL(app.manualUserUrl!)).not.toThrow();
      }
      if (app.manualTechUrl) {
        expect(() => new URL(app.manualTechUrl!)).not.toThrow();
      }
    }
    const workApps = INITIAL_APPS.filter((a) => a.category === 'work');
    expect(workApps.length).toBeGreaterThanOrEqual(5);
  });

  it('normalizeAndValidateUrl nunca lanza excepciones ante strings arbitrarios o Unicode', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 500 }), (input) => {
        const res = normalizeAndValidateUrl(input);
        if (res !== null) {
          expect(res.startsWith('http://') || res.startsWith('https://')).toBe(true);
        }
      }),
      { numRuns: 300 }
    );
  });

  it('parsePortalBackup jamás crashea con JSON corrupto, tipos mixtos o IDs duplicados', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 500 }), (raw) => {
        const result = parsePortalBackup(raw);
        if (result !== null) {
          expect(Array.isArray(result.pinnedIds)).toBe(true);
          expect(Array.isArray(result.customApps)).toBe(true);
        }
      }),
      { numRuns: 250 }
    );

    fc.assert(
      fc.property(
        fc.array(fc.oneof(fc.string(), fc.integer(), fc.constant(null), fc.constant(undefined))),
        (mixedPins) => {
          const payload = JSON.stringify({ version: 2, pinnedIds: mixedPins, customApps: [] });
          const parsed = parsePortalBackup(payload);
          expect(parsed).not.toBeNull();
          const uniqueSet = new Set(parsed!.pinnedIds);
          expect(uniqueSet.size).toBe(parsed!.pinnedIds.length);
          expect(parsed!.pinnedIds.every((x) => typeof x === 'string')).toBe(true);
        }
      ),
      { numRuns: 150 }
    );
  });

  it('sortWithPinned nunca pierde ni duplica apps ante listas arbitrarias de pinnedIds', () => {
    fc.assert(
      fc.property(fc.array(fc.string({ maxLength: 40 }), { maxLength: 50 }), (pins) => {
        const sorted = sortWithPinned(INITIAL_APPS, pins);
        expect(sorted.length).toBe(INITIAL_APPS.length);
        const ids = new Set(sorted.map((a) => a.id));
        expect(ids.size).toBe(INITIAL_APPS.length);
        // Todas las fijadas deben aparecer antes que cualquier no fijada
        let seenUnpinned = false;
        for (const item of sorted) {
          const isPinned = pins.includes(item.id);
          if (!isPinned) seenUnpinned = true;
          if (seenUnpinned) expect(isPinned).toBe(false);
        }
      }),
      { numRuns: 150 }
    );
  });

  it('el buscador de texto nunca lanza excepciones ni devuelve duplicados ante queries arbitrarios', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 200 }), (query) => {
        const q = query.trim().toLowerCase();
        const filtered = INITIAL_APPS.filter(
          (app) =>
            !q ||
            app.name.toLowerCase().includes(q) ||
            app.description.toLowerCase().includes(q) ||
            app.domainLabel.toLowerCase().includes(q) ||
            app.tagLabel.toLowerCase().includes(q) ||
            app.badge.toLowerCase().includes(q)
        );
        expect(filtered.length).toBeLessThanOrEqual(INITIAL_APPS.length);
        expect(new Set(filtered.map((a) => a.id)).size).toBe(filtered.length);
      }),
      { numRuns: 200 }
    );
  });
});
