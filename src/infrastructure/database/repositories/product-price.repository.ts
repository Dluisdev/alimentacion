import { Database } from 'sql.js';
import { ProductPrice } from '../../../domain/product/product.entity';

/**
 * Repositorio de precios de productos por supermercado.
 * Permite guardar, actualizar y consultar precios que el usuario
 * introduce manualmente (no usamos scraping automático).
 */
export class ProductPriceRepository {
  constructor(private readonly db: any) {}

  /**
   * Guarda o actualiza el precio de un producto en un supermercado.
   * Si ya existe un precio para ese producto y supermercado, lo actualiza.
   */
  savePrice(data: {
    productId: string;
    productName: string;
    supermarket: string;
    pricePerKg: number;
    currency?: string;
    ingredients?: string[];
    isUltraProcessed?: boolean;
    notes?: string;
  }): ProductPrice {
    const id = `price-${Date.now()}`;
    const now = new Date().toISOString();

    const price: ProductPrice = {
      id,
      productId: data.productId,
      supermarket: data.supermarket,
      price: data.pricePerKg,
      currency: data.currency || 'EUR',
      dateChecked: new Date(now),
    };

    this.db.run(
      `INSERT OR REPLACE INTO product_prices (id, product_id, supermarket, price, currency, date_checked)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        price.id,
        price.productId,
        price.supermarket,
        price.price,
        price.currency,
        price.dateChecked.toISOString(),
      ]
    );

    // Guardar metadatos adicionales (ingredientes, ultraprocesado, notas)
    // en una tabla auxiliar o en notas del producto
    if (data.ingredients || data.isUltraProcessed !== undefined || data.notes) {
      this.saveProductMetadata(data.productId, {
        ingredients: data.ingredients || [],
        isUltraProcessed: data.isUltraProcessed || false,
        notes: data.notes || '',
      });
    }

    return price;
  }

  /**
   * Obtiene todos los precios de un producto en diferentes supermercados.
   * Ordenados de más barato a más caro.
   */
  getPricesForProduct(productId: string): ProductPrice[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM product_prices WHERE product_id = ? ORDER BY price ASC'
      )
      .all(productId) as any[];

    return rows.map((row) => this.mapRowToPrice(row));
  }

  /**
   * Obtiene todos los precios de todos los productos.
   */
  getAllPrices(): ProductPrice[] {
    const rows = this.db
      .prepare('SELECT * FROM product_prices ORDER BY product_id, price ASC')
      .all() as any[];

    return rows.map((row) => this.mapRowToPrice(row));
  }

  /**
   * Obtiene el supermercado más barato para un producto.
   */
  getCheapestSupermarketForProduct(
    productId: string
  ): { supermarket: string; price: number; allPrices: ProductPrice[] } | null {
    const prices = this.getPricesForProduct(productId);

    if (prices.length === 0) return null;

    const cheapest = prices[0]; // ya están ordenados de menor a mayor

    return {
      supermarket: cheapest.supermarket,
      price: cheapest.price,
      allPrices: prices,
    };
  }

  /**
   * Elimina un precio.
   */
  deletePrice(priceId: string): boolean {
    const result = this.db.run(
      'DELETE FROM product_prices WHERE id = ?',
      [priceId]
    );
    return (result.changes || 0) > 0;
  }

  /**
   * Guarda metadatos del producto (ingredientes, ultraprocesado, etc.)
   */
  private saveProductMetadata(
    productId: string,
    data: {
      ingredients: string[];
      isUltraProcessed: boolean;
      notes: string;
    }
  ): void {
    // Crear tabla de metadatos si no existe
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS product_metadata (
        product_id TEXT PRIMARY KEY,
        ingredients TEXT NOT NULL DEFAULT '[]',
        is_ultra_processed INTEGER DEFAULT 0,
        notes TEXT DEFAULT '',
        updated_at TEXT NOT NULL
      )
    `);

    const now = new Date().toISOString();

    this.db.run(
      `INSERT OR REPLACE INTO product_metadata (product_id, ingredients, is_ultra_processed, notes, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        productId,
        JSON.stringify(data.ingredients),
        data.isUltraProcessed ? 1 : 0,
        data.notes,
        now,
      ]
    );
  }

  /**
   * Obtiene metadatos de un producto.
   */
  getProductMetadata(productId: string): {
    ingredients: string[];
    isUltraProcessed: boolean;
    notes: string;
  } | null {
    const row = this.db
      .prepare('SELECT * FROM product_metadata WHERE product_id = ?')
      .get(productId) as any;

    if (!row) return null;

    return {
      ingredients: JSON.parse(row.ingredients || '[]'),
      isUltraProcessed: row.is_ultra_processed === 1,
      notes: row.notes || '',
    };
  }

  private mapRowToPrice(row: any): ProductPrice {
    return {
      id: row.id,
      productId: row.product_id,
      supermarket: row.supermarket,
      price: row.price,
      currency: row.currency,
      dateChecked: new Date(row.date_checked),
    };
  }
}