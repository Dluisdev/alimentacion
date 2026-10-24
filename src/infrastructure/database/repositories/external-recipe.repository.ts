import { ExternalRecipe, ImportExternalRecipeData } from '../../../domain/recipe/external-recipe.entity';

/**
 * Repositorio de recetas externas (Instagram y YouTube).
 * Guarda las recetas que el usuario importa de redes sociales.
 */
export class ExternalRecipeRepository {
  constructor(private readonly db: any) {}

  /**
   * Guarda una receta externa importada.
   */
  create(data: ImportExternalRecipeData & {
    title: string;
    ingredients: string[];
    steps: string[];
    preparationTimeMinutes: number;
    servings: number;
    isCholesterolFriendly: boolean | null;
    adaptations?: string[];
  }): ExternalRecipe {
    const id = `ext-${Date.now()}`;
    const now = new Date().toISOString();

    const recipe: ExternalRecipe = {
      id,
      userId: data.userId,
      title: data.title,
      source: data.source,
      externalUrl: '', // se rellena después si es necesario
      ingredients: data.ingredients,
      steps: data.steps,
      preparationTimeMinutes: data.preparationTimeMinutes,
      servings: data.servings,
      isCholesterolFriendly: data.isCholesterolFriendly,
      adaptations: data.adaptations || [],
      isApprovedByUser: false,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    this.db.run(
      `INSERT INTO external_recipes (id, user_id, title, source, external_url, ingredients, steps, preparation_time_minutes, servings, is_cholesterol_friendly, adaptations, is_approved_by_user, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.id,
        recipe.userId,
        recipe.title,
        recipe.source,
        recipe.externalUrl,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.steps),
        recipe.preparationTimeMinutes,
        recipe.servings,
        recipe.isCholesterolFriendly ? 1 : recipe.isCholesterolFriendly === false ? 0 : null,
        JSON.stringify(recipe.adaptations),
        recipe.isApprovedByUser ? 1 : 0,
        recipe.createdAt.toISOString(),
        recipe.updatedAt.toISOString(),
      ]
    );

    return recipe;
  }

  /**
   * Busca una receta externa por su ID.
   */
  findById(id: string): ExternalRecipe | null {
    const row = this.db
      .prepare('SELECT * FROM external_recipes WHERE id = ?')
      .get(id) as any;

    if (!row) return null;

    return this.mapRowToExternalRecipe(row);
  }

  /**
   * Lista recetas externas de un usuario.
   */
  findByUser(userId: string): ExternalRecipe[] {
    const rows = this.db
      .prepare('SELECT * FROM external_recipes WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as any[];

    return rows.map((row) => this.mapRowToExternalRecipe(row));
  }

  /**
   * Lista recetas externas aprobadas por el usuario.
   */
  findApprovedByUser(userId: string): ExternalRecipe[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM external_recipes WHERE user_id = ? AND is_approved_by_user = 1'
      )
      .all(userId) as any[];

    return rows.map((row) => this.mapRowToExternalRecipe(row));
  }

  /**
   * Aprueba una receta externa (el usuario da su consentimiento explícito).
   */
  approve(id: string): ExternalRecipe | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated: ExternalRecipe = {
      ...existing,
      isApprovedByUser: true,
      updatedAt: new Date(),
    };

    this.db.run(
      `UPDATE external_recipes SET is_approved_by_user = 1, updated_at = ? WHERE id = ?`,
      [updated.updatedAt.toISOString(), id]
    );

    return updated;
  }

  private mapRowToExternalRecipe(row: any): ExternalRecipe {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      source: row.source as 'instagram' | 'youtube',
      externalUrl: row.external_url,
      ingredients: JSON.parse(row.ingredients || '[]'),
      steps: JSON.parse(row.steps || '[]'),
      preparationTimeMinutes: row.preparation_time_minutes,
      servings: row.servings,
      isCholesterolFriendly: row.is_cholesterol_friendly === 1 ? true : row.is_cholesterol_friendly === 0 ? false : null,
      adaptations: JSON.parse(row.adaptations || '[]'),
      isApprovedByUser: row.is_approved_by_user === 1,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}