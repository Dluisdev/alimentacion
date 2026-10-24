import { User, CreateUserData } from '../../../domain/user/user.entity';

/**
 * Repositorio de usuarios.
 * Guarda y recupera información de usuarios desde la base de datos SQLite.
 */
export class UserRepository {
  constructor(private readonly db: any) {}

  /**
   * Crea un nuevo usuario.
   */
  create(data: CreateUserData): User {
    const id = `user-${Date.now()}`;
    const now = new Date().toISOString();

    const user: User = {
      id,
      phoneNumber: data.phoneNumber,
      name: data.name || undefined,
      hasHighCholesterol: data.hasHighCholesterol ?? true,
      fatReductionLevel: 1, // siempre empieza en nivel 1 (progresivo)
      preferences: data.preferences || [],
      allergies: data.allergies || [],
      dislikes: data.dislikes || [],
      mood: undefined,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    this.db.run(
      `INSERT INTO users (id, phone_number, name, has_high_cholesterol, fat_reduction_level, preferences, allergies, dislikes, mood, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.phoneNumber,
        user.name || null,
        user.hasHighCholesterol ? 1 : 0,
        user.fatReductionLevel,
        JSON.stringify(user.preferences),
        JSON.stringify(user.allergies),
        JSON.stringify(user.dislikes),
        user.mood || null,
        user.createdAt.toISOString(),
        user.updatedAt.toISOString(),
      ]
    );

    return user;
  }

  /**
   * Busca un usuario por su número de teléfono.
   */
  findByPhone(phoneNumber: string): User | null {
    const row = this.db
      .prepare('SELECT * FROM users WHERE phone_number = ?')
      .get(phoneNumber) as any;

    if (!row) return null;

    return this.mapRowToUser(row);
  }

  /**
   * Busca un usuario por su ID.
   */
  findById(id: string): User | null {
    const row = this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as any;

    if (!row) return null;

    return this.mapRowToUser(row);
  }

  /**
   * Actualiza los datos de un usuario.
   */
  update(id: string, data: Partial<User>): User | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated: User = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.db.run(
      `UPDATE users SET
        name = ?, has_high_cholesterol = ?, fat_reduction_level = ?,
        preferences = ?, allergies = ?, dislikes = ?, mood = ?, updated_at = ?
       WHERE id = ?`,
      [
        updated.name || null,
        updated.hasHighCholesterol ? 1 : 0,
        updated.fatReductionLevel,
        JSON.stringify(updated.preferences),
        JSON.stringify(updated.allergies),
        JSON.stringify(updated.dislikes),
        updated.mood || null,
        updated.updatedAt.toISOString(),
        id,
      ]
    );

    return updated;
  }

  /**
   * Actualiza el estado de ánimo del usuario (para monitorear depresión/desánimo).
   */
  updateMood(id: string, mood: 'bien' | 'regular' | 'mal'): User | null {
    return this.update(id, { mood });
  }

  /**
   * Actualiza el nivel de reducción de grasas del usuario.
   */
  updateFatReductionLevel(
    id: string,
    level: number
  ): User | null {
    return this.update(id, { fatReductionLevel: level as any });
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      phoneNumber: row.phone_number,
      name: row.name || undefined,
      hasHighCholesterol: row.has_high_cholesterol === 1,
      fatReductionLevel: row.fat_reduction_level,
      preferences: JSON.parse(row.preferences || '[]'),
      allergies: JSON.parse(row.allergies || '[]'),
      dislikes: JSON.parse(row.dislikes || '[]'),
      mood: row.mood as 'bien' | 'regular' | 'mal' | undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}