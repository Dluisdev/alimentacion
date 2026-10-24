export interface Supermarket {
  id: string;
  name: string;
  isActive: boolean;
  supportsPriceCheck: boolean;
}

export const DEFAULT_SUPERMARKETS: Supermarket[] = [
  { id: 'mercadona', name: 'Mercadona', isActive: true, supportsPriceCheck: true },
  { id: 'carrefour', name: 'Carrefour', isActive: true, supportsPriceCheck: true },
  { id: 'lidl', name: 'Lidl', isActive: true, supportsPriceCheck: true },
  { id: 'aldi', name: 'Aldi', isActive: true, supportsPriceCheck: true },
  { id: 'consum', name: 'Consum', isActive: true, supportsPriceCheck: true },
];