import { Supermarket } from '../../../domain/supermarket/supermarket.entity';

/**
 * Repositorio de supermercados.
 * Guarda y recupera información de supermercados para comparar precios.
 */
export class SupermarketRepository {
  constructor(private readonly db: any) {}

  /**
   * Crea un nuevo supermercado.
   */
  create(data: { name: string; isActive?: boolean; supportsPriceCheck?: boolean }): Supermarket {
    const id = `supermarket-${Date.now()}`;
    const now = new Date().toISOString();

    const supermarket: Supermarket = {
      id,
      name: data.name,
      isActive: data.isActive ?? true,
      supportsPriceCheck: data.supportsPriceCheck ?? false,
    };

    this.db.run(
      `INSERT INTO supermarkets (id, name, is_active, supports_price_check) VALUES (?, ?, ?, ?)`,
      [supermarket.id, supermarket.name, supermarket.isActive ? 1 : 0, supermarket.supportsPriceCheck ? 1 : 0]
    );

    return supermarket;
  }

  /**
   * Lista todos los supermercados activos.
   */
  findActive(): Supermarket[] {
    const rows = this.db
      .prepare("SELECT * FROM supermarkets WHERE is_active = 1")
      .all() as any[];

    return rows.map((row) => this.mapRowToSupermarket(row));
  }

  /**
   * Lista todos los supermercados.
   */
  findAll(): Supermarket[] {
    const rows = this.db.prepare('SELECT * FROM supermarkets').all() as any[];
    return rows.map((row) => this.mapRowToSupermarket(row));
  }

  private mapRowToSupermarket(row: any): Supermarket {
    return {
      id: row.id,
      name: row.name,
      isActive: row.is_active === 1,
      supportsPriceCheck: row.supports_price_check === 1,
    };
  }
}