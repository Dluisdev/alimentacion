import { Product } from '../../../domain/product/product.entity';

/**
 * Repositorio de productos.
 * Guarda y recupera productos para la lista de compras.
 */
export class ProductRepository {
  constructor(private readonly db: any) {}

  /**
   * Crea un nuevo producto.
   */
  create(data: { name: string; category: string; unit: 'kg' | 'unidad' | 'litro' | 'paquete' }): Product {
    const id = `product-${Date.now()}`;
    const now = new Date().toISOString();

    const product: Product = {
      id,
      name: data.name,
      category: data.category,
      unit: data.unit,
    };

    this.db.run(
      `INSERT INTO products (id, name, category, unit) VALUES (?, ?, ?, ?)`,
      [product.id, product.name, product.category, product.unit]
    );

    return product;
  }

  /**
   * Busca un producto por su ID.
   */
  findById(id: string): Product | null {
    const row = this.db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(id) as any;

    if (!row) return null;

    return this.mapRowToProduct(row);
  }

  /**
   * Busca un producto por su nombre.
   */
  findByName(name: string): Product | null {
    const row = this.db
      .prepare("SELECT * FROM products WHERE LOWER(name) = LOWER(?)")
      .get(name) as any;

    if (!row) return null;

    return this.mapRowToProduct(row);
  }

  /**
   * Lista todos los productos.
   */
  findAll(): Product[] {
    const rows = this.db.prepare('SELECT * FROM products').all() as any[];
    return rows.map((row) => this.mapRowToProduct(row));
  }

  private mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      unit: row.unit as 'kg' | 'unidad' | 'litro' | 'paquete',
    };
  }
}