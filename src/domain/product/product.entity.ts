export interface Product {
  id: string;
  name: string;
  category: string;
  unit: 'kg' | 'unidad' | 'litro' | 'paquete';
}

export interface ProductPrice {
  id: string;
  productId: string;
  supermarket: string;
  price: number;
  currency: 'EUR';
  dateChecked: Date;
}

export interface ShoppingItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  bestSupermarket: string;
  bestPrice: number;
  allPrices: ProductPrice[];
}

export interface ShoppingList {
  id: string;
  userId: string;
  weekStartDate: Date;
  items: ShoppingItem[];
  totalEstimatedCost: number;
  createdAt: Date;
}