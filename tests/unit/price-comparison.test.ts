import { PriceComparisonService } from '../src/application/services/price-comparison.service';

describe('PriceComparisonService', () => {
  const service = new PriceComparisonService();

  test('debe encontrar el supermercado más barato', () => {
    const prices = [
      { id: '1', productId: 'p1', supermarket: 'Mercadona', price: 6.50, currency: 'EUR', dateChecked: new Date() },
      { id: '2', productId: 'p1', supermarket: 'Lidl', price: 4.90, currency: 'EUR', dateChecked: new Date() },
      { id: '3', productId: 'p1', supermarket: 'Aldi', price: 5.20, currency: 'EUR', dateChecked: new Date() },
    ];

    const result = service.comparePrices('Mantequilla', prices);

    expect(result.cheapestOption.supermarket).toBe('Lidl');
    expect(result.cheapestOption.pricePerKg).toBe(4.90);
    expect(result.savings).toBeGreaterThan(0);
  });

  test('debe manejar lista vacía de precios', () => {
    const result = service.comparePrices('Producto inexistente', []);
    expect(result.recommendation).toContain('No hay precios disponibles');
  });
});