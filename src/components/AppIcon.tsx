import {
  Award,
  BarChart3,
  Beer,
  Car,
  Factory,
  FolderOpen,
  Github,
  Link2,
  Package,
  PawPrint,
  Pizza,
  Scissors,
  Server,
  ShoppingBasket,
  Sparkles,
  Stethoscope,
  Store,
  TrendingUp,
  Tv,
  Utensils,
  Wrench,
} from 'lucide-react';
import type { IconKey } from '../types';

const ICON_MAP: Record<IconKey, typeof Link2> = {
  beer: Beer,
  store: Store,
  basket: ShoppingBasket,
  server: Server,
  package: Package,
  scissors: Scissors,
  utensils: Utensils,
  car: Car,
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  paw: PawPrint,
  wrench: Wrench,
  award: Award,
  tv: Tv,
  trending: TrendingUp,
  chart: BarChart3,
  factory: Factory,
  pizza: Pizza,
  folder: FolderOpen,
  github: Github,
  link: Link2,
};

interface AppIconProps {
  icon: IconKey;
  className?: string;
}

export function AppIcon({ icon, className = 'w-5 h-5' }: AppIconProps) {
  const Icon = ICON_MAP[icon] ?? Link2;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
