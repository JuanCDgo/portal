export type PlatformCategory =
  | 'cloud'
  | 'netlify'
  | 'desktop'
  | 'miniapps'
  | 'resources';

export type IconKey =
  | 'beer'
  | 'store'
  | 'basket'
  | 'server'
  | 'package'
  | 'scissors'
  | 'utensils'
  | 'car'
  | 'stethoscope'
  | 'sparkles'
  | 'paw'
  | 'wrench'
  | 'award'
  | 'tv'
  | 'trending'
  | 'chart'
  | 'factory'
  | 'pizza'
  | 'folder'
  | 'github'
  | 'link';

export interface SecondaryAction {
  label: string;
  url: string;
}

export interface AppEntry {
  id: string;
  name: string;
  url: string;
  domainLabel: string;
  description: string;
  category: PlatformCategory;
  suite?: 'facil' | 'legacy';
  badge: string;
  tagLabel: string;
  icon: IconKey;
  highlight?: 'emerald' | 'amber' | 'sky';
  secondaryAction?: SecondaryAction;
  extraAction?: SecondaryAction;
  manualUserUrl?: string;
  manualTechUrl?: string;
  isCustom?: boolean;
}

export interface PortalBackupData {
  version: number;
  exportedAt: string;
  pinnedIds: string[];
  customApps: AppEntry[];
}
