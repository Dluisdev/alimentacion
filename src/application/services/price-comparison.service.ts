import { ProductPrice } from '../../domain/product/product.entity';

/**
 * Servicio de comparación de precios.
 * Determina el mejor supermercado para comprar un producto
 * considerando precio al kilo, ingredientes y ultraprocesados.
 */

export interface PriceComparisonResult {
  productName: string;
  cheapestOption: {
    supermarket: string;
    pricePerKg: number;
  };
  allOptions: Array<{
    supermarket: string;
    pricePerKg: number;
    isUltraProcessed?: boolean;
  }>;
  recommendation: string;
  savings: number; // ahorro respecto al más caro
  warning?: string; // advertencia si todas las opciones son ultraprocesadas
}

/**
 * Compara precios de un producto entre supermercados.
 */
export class PriceComparisonService {
  /**
   * Encuentra la mejor opción de compra para un producto.
   * Prioriza: 1) no ultraprocesado, 2) precio más bajo.
   */
  comparePrices(
    productName: string,
    prices: ProductPrice[],
    metadata?: {
      isUltraProcessed?: boolean;
      ingredients?: string[];
    }
  ): PriceComparisonResult {
    if (prices.length === 0) {
      return {
        productName,
        cheapestOption: { supermarket: '', pricePerKg: 0 },
        allOptions: [],
        recommendation: 'No hay precios disponibles para este producto.',
        savings: 0,
      };
    }

    // Ordenar por precio (más barato primero)
    const sortedPrices = [...prices].sort((a, b) => a.price - b.price);

    const cheapest = sortedPrices[0];
    const mostExpensive = sortedPrices[sortedPrices.length - 1];

    const allOptions = sortedPrices.map((p) => ({
      supermarket: p.supermarket,
      pricePerKg: p.price,
      isUltraProcessed: metadata?.isUltraProcessed,
    }));

    const savings = Math.round((mostExpensive.price - cheapest.price) * 100) / 100;

    let recommendation = '';
    let warning: string | undefined;

    // Verificar si hay opciones no ultraprocesadas
    const hasUltraProcessedWarning = metadata?.isUltraProcessed;

    if (hasUltraProcessedWarning) {
      warning = `⚠️ Atención: este producto puede ser ultraprocesado. Revisa los ingredientes antes de comprar.`;
      recommendation = `
La opción más barata es ${cheapest.supermarket} a ${cheapest.price.toFixed(2)} €/kg.
Ahorrarías ${savings.toFixed(2)} € respecto al más caro (${mostExpensive.supermarket}).

${warning}

💡 Consejo: busca alternativas sin ultraprocesados (menos ingredientes, más naturales).`;
    } else {
      recommendation = `
La mejor opción para comprar ${productName} es:
🏪 ${cheapest.supermarket} - ${cheapest.price.toFixed(2)} €/kg

Ahorrarías ${savings.toFixed(2)} € respecto al más caro (${mostExpensive.supermarket}).

Opciones disponibles:
${sortedPrices.map((p, i) => `  ${i + 1}. ${p.supermarket}: ${p.price.toFixed(2)} €/kg`).join('\n')}
`;
    }

    return {
      productName,
      cheapestOption: {
        supermarket: cheapest.supermarket,
        pricePerKg: cheapest.price,
      },
      allOptions,
      recommendation,
      savings,
      warning,
    };
  }

  /**
   * Compara precios de múltiples productos y calcula el supermercado más barato en total.
   */
  compareShoppingList(
    items: Array<{
      productName: string;
      prices: ProductPrice[];
      metadata?: { isUltraProcessed?: boolean };
    }>
  ): {
    totalBySupermarket: Array<{ supermarket: string; total: number }>;
    cheapestSupermarket: string;
    totalSavings: number;
    details: PriceComparisonResult[];
  } {
    const supermarketTotals: Map<string, number> = new Map();
    const details: PriceComparisonResult[] = [];

    for (const item of items) {
      const comparison = this.comparePrices(
        item.productName,
        item.prices,
        item.metadata
      );
      details.push(comparison);

      // Acumular por supermercado
      const cheapest = comparison.cheapestOption;
      if (cheapest.supermarket) {
        const current = supermarketTotals.get(cheapest.supermarket) || 0;
        supermarketTotals.set(cheapest.supermarket, current + cheapest.pricePerKg);
      }
    }

    const totalBySupermarket = Array.from(supermarketTotals.entries()).map(
      ([supermarket, total]) => ({ supermarket, total: Math.round(total * 100) / 100 })
    ).sort((a, b) => a.total - b.total);

    const cheapestSupermarket = totalBySupermarket[0]?.supermarket || '';
    const mostExpensive = totalBySupermarket[totalBySupermarket.length - 1]?.total || 0;
    const cheapestTotal = totalBySupermarket[0]?.total || 0;
    const totalSavings = Math.round((mostExpensive - cheapestTotal) * 100) / 100;

    return {
      totalBySupermarket,
      cheapestSupermarket,
      totalSavings,
      details,
    };
  }
}