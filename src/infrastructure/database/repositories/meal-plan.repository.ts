import { WeeklyMenu, CreateMenuData, Meal } from '../../../domain/meal-plan/meal-plan.entity';

/**
 * Repositorio de menús semanales.
 * Guarda y recupera los menús generados para cada usuario.
 */
export class MealPlanRepository {
  constructor(private readonly db: any) {}

  /**
   * Crea un nuevo menú semanal.
   */
  create(data: CreateMenuData, meals: Meal[]): WeeklyMenu {
    const id = `menu-${Date.now()}`;
    const now = new Date().toISOString();

    const menu: WeeklyMenu = {
      id,
      userId: data.userId,
      weekStartDate: data.weekStartDate,
      meals,
      fatReductionLevel: 1,
      notes: undefined,
      createdAt: new Date(now),
    };

    this.db.run(
      `INSERT INTO weekly_menus (id, user_id, week_start_date, meals, fat_reduction_level, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        menu.id,
        menu.userId,
        menu.weekStartDate.toISOString(),
        JSON.stringify(menu.meals),
        menu.fatReductionLevel,
        menu.notes || null,
        menu.createdAt.toISOString(),
      ]
    );

    return menu;
  }

  /**
   * Busca un menú por su ID.
   */
  findById(id: string): WeeklyMenu | null {
    const row = this.db
      .prepare('SELECT * FROM weekly_menus WHERE id = ?')
      .get(id) as any;

    if (!row) return null;

    return this.mapRowToMenu(row);
  }

  /**
   * Lista los menús de un usuario, opcionalmente por fecha.
   */
  findByUser(userId: string, limit: number = 10): WeeklyMenu[] {
    const rows = this.db
      .prepare('SELECT * FROM weekly_menus WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
      .all(userId, limit) as any[];

    return rows.map((row) => this.mapRowToMenu(row));
  }

  /**
   * Busca el menú de una semana específica para un usuario.
   */
  findByWeek(userId: string, weekStartDate: Date): WeeklyMenu | null {
    const startISO = weekStartDate.toISOString();
    const row = this.db
      .prepare(
        'SELECT * FROM weekly_menus WHERE user_id = ? AND week_start_date = ?'
      )
      .get(userId, startISO) as any;

    if (!row) return null;

    return this.mapRowToMenu(row);
  }

  private mapRowToMenu(row: any): WeeklyMenu {
    return {
      id: row.id,
      userId: row.user_id,
      weekStartDate: new Date(row.week_start_date),
      meals: JSON.parse(row.meals || '[]') as Meal[],
      fatReductionLevel: row.fat_reduction_level,
      notes: row.notes || undefined,
      createdAt: new Date(row.created_at),
    };
  }
}