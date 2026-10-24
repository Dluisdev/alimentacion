import { ProductPrice } from '../domain/product/product.entity';
import { Supermarket } from '../domain/supermarket/supermarket.entity';

/**
 * Caso de uso: Comparar precios de un producto entre supermercados.
 * Devuelve el supermercado más barato.
 */
export interface ComparePricesUseCase {
  execute(data: {
    productId: string;
    prices: ProductPrice[];
  }): { bestSupermarket: string; bestPrice: number; allPrices: ProductPrice[] };
}

export class ComparePrices implements ComparePricesUseCase {
  execute(data: {
    productId: string;
    prices: ProductPrice[];
  }): { bestSupermarket: string; bestPrice: number; allPrices: ProductPrice[] } {
    const { prices } = data;

    if (prices.length === 0) {
      throw new Error(`No hay precios disponibles para el producto ${productId}`);
    }

    const best = prices.reduce((prev, current) =>
      current.price < prev.price ? current : prev
    );

    return {
      bestSupermarket: best.supermarket,
      bestPrice: best.price,
      allPrices: prices,
    };
  }
}

export interface GetCheapestSupermarketForListUseCase {
  execute(data: {
    items: { productId: string; prices: ProductPrice[] }[];
  }): { supermarket: string; total: number; savings: number }[];
}

export class GetCheapestSupermarketForList implements GetCheapestSupermarketForListUseCase {
  execute(data: {
    items: { productId: string; prices: ProductPrice[] }[];
  }): { supermarket: string; total: number; savings: number }[] {
    const supermarkets = new Map<string, { total: number; originalTotal: number }>();

    for (const item of data.items) {
      if (item.prices.length === 0) continue;

      const best = item.prices.reduce((prev, current) =>
        current.price < prev.price ? current : prev
      );

      const originalPrice = item.prices[0].price; // precio de referencia

      if (!supermarkets.has(best.supermarket)) {
        supermarkets.set(best.supermarket, { total: 0, originalTotal: 0 });
      }

      const data = supermarkets.get(best.supermarket)!;
      data.total += best.price;
      data.originalTotal += originalPrice;
    }

    const result = Array.from(supermarkets.entries()).map(
      ([supermarket, data]) => ({
        supermarket,
        total: Math.round(data.total * 100) / 100,
        savings: Math.round((data.originalTotal - data.total) * 100) / 100,
      })
    );

    return result.sort((a, b) => a.total - b.total);
  }
}