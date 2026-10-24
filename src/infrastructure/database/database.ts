import path from 'path';
import fs from 'fs';
import { INITIAL_PRODUCTS } from '../../seeds/initial-products';
import { INITIAL_SUPERMARKETS } from '../../seeds/initial-supermarkets';

// Importación compatible con diferentes versiones de sql.js
const sqlJsModule: any = require('sql.js');
const initSqlJs: any = sqlJsModule.default || sqlJsModule.initSqlJs || sqlJsModule;

type SqlDatabase = any;

/**
 * Conexión a la base de datos SQLite usando sql.js.
 * sql.js es una implementación de SQLite en JavaScript puro,
 * no necesita compilar código nativo ni instalar Python.
 * Ideal para Windows y para usuarios que no son programadores.
 */
export class DatabaseConnection {
  private db: SqlDatabase | null = null;
  private static instance: DatabaseConnection;
  private readonly dbPath: string;

  private constructor(dbPath: string = './database/alimentacion.db') {
    this.dbPath = dbPath;

    // Asegurar que el directorio existe
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: (file: string) => {
        return path.join(__dirname, '..', '..', 'node_modules', 'sql.js', file);
      },
    });

    let existingData: Uint8Array | null = null;
    if (fs.existsSync(this.dbPath)) {
      existingData = fs.readFileSync(this.dbPath);
    }

    this.db = new SQL.Database(existingData);
    this.initializeTables();
    this.loadInitialData();

    this.saveToDisk();
  }

  static async getInstance(
    dbPath: string = './database/alimentacion.db'
  ): Promise<DatabaseConnection> {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(dbPath);
      await DatabaseConnection.instance.initializeDatabasePromise();
    }
    return DatabaseConnection.instance;
  }

  private initializeDatabasePromise(): Promise<void> {
    return Promise.resolve();
  }

  private initializeTables(): void {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone_number TEXT UNIQUE NOT NULL,
        name TEXT,
        has_high_cholesterol INTEGER DEFAULT 1,
        fat_reduction_level INTEGER DEFAULT 1,
        preferences TEXT DEFAULT '[]',
        allergies TEXT DEFAULT '[]',
        dislikes TEXT DEFAULT '[]',
        mood TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        steps TEXT NOT NULL,
        preparation_time_minutes INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        is_cholesterol_friendly INTEGER DEFAULT 1,
        saturated_fat_level TEXT DEFAULT 'low',
        fiber_level TEXT DEFAULT 'medium',
        source TEXT DEFAULT 'internal',
        external_url TEXT,
        created_by_user_id TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS weekly_menus (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        week_start_date TEXT NOT NULL,
        meals TEXT NOT NULL,
        fat_reduction_level INTEGER NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS shopping_lists (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        week_start_date TEXT NOT NULL,
        items TEXT NOT NULL,
        total_estimated_cost REAL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS external_recipes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        source TEXT NOT NULL,
        external_url TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        steps TEXT NOT NULL,
        preparation_time_minutes INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        is_cholesterol_friendly INTEGER,
        adaptations TEXT,
        is_approved_by_user INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        unit TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS supermarkets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        supports_price_check INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS product_prices (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        supermarket TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'EUR',
        date_checked TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS product_metadata (
        product_id TEXT PRIMARY KEY,
        ingredients TEXT NOT NULL DEFAULT '[]',
        is_ultra_processed INTEGER DEFAULT 0,
        notes TEXT DEFAULT '',
        updated_at TEXT NOT NULL
      );
    `);
  }

  /**
   * Carga los datos iniciales (productos y supermercados) si las tablas están vacías.
   */
  private loadInitialData(): void {
    if (!this.db) return;

    // Cargar productos si no existen
    const productCount = this.db
      .prepare('SELECT COUNT(*) as count FROM products')
      .get() as any;

    if (productCount.count === 0) {
      for (const product of INITIAL_PRODUCTS) {
        const id = `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        this.db.run(
          `INSERT INTO products (id, name, category, unit) VALUES (?, ?, ?, ?)`,
          [id, product.name, product.category, product.unit]
        );
      }
    }

    // Cargar supermercados si no existen
    const supermarketCount = this.db
      .prepare('SELECT COUNT(*) as count FROM supermarkets')
      .get() as any;

    if (supermarketCount.count === 0) {
      for (const supermarket of INITIAL_SUPERMARKETS) {
        const id = `supermarket-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        this.db.run(
          `INSERT INTO supermarkets (id, name, is_active, supports_price_check) VALUES (?, ?, ?, ?)`,
          [id, supermarket.name, supermarket.isActive ? 1 : 0, supermarket.supportsPriceCheck ? 1 : 0]
        );
      }
    }
  }

  private saveToDisk(): void {
    if (!this.db) return;
    const data = this.db.export();
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.dbPath, Buffer.from(data));
  }

  getDb(): SqlDatabase {
    if (!this.db) {
      throw new Error('Base de datos no inicializada');
    }
    return this.db;
  }

  persist(): void {
    this.saveToDisk();
  }

  close(): void {
    if (this.db) {
      this.saveToDisk();
      this.db.close();
      this.db = null;
    }
  }
}