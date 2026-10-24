import { Recipe, CreateRecipeData } from '../../../domain/recipe/recipe.entity';

/**
 * Repositorio de recetas.
 * Guarda y recupera recetas (internas y externas de Instagram/YouTube).
 */
export class RecipeRepository {
  constructor(private readonly db: any) {}

  /**
   * Crea una nueva receta.
   */
  create(data: CreateRecipeData): Recipe {
    const id = `recipe-${Date.now()}`;
    const now = new Date().toISOString();

    const recipe: Recipe = {
      id,
      title: data.title,
      ingredients: data.ingredients,
      steps: data.steps,
      preparationTimeMinutes: data.preparationTimeMinutes,
      servings: data.servings,
      isCholesterolFriendly: true,
      saturatedFatLevel: 'low',
      fiberLevel: 'medium',
      source: data.source,
      externalUrl: data.externalUrl || undefined,
      createdByUserId: data.createdByUserId || undefined,
      createdAt: new Date(now),
    };

    this.db.run(
      `INSERT INTO recipes (id, title, ingredients, steps, preparation_time_minutes, servings, is_cholesterol_friendly, saturated_fat_level, fiber_level, source, external_url, created_by_user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.id,
        recipe.title,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.steps),
        recipe.preparationTimeMinutes,
        recipe.servings,
        recipe.isCholesterolFriendly ? 1 : 0,
        recipe.saturatedFatLevel,
        recipe.fiberLevel,
        recipe.source,
        recipe.externalUrl || null,
        recipe.createdByUserId || null,
        recipe.createdAt.toISOString(),
      ]
    );

    return recipe;
  }

  /**
   * Busca una receta por su ID.
   */
  findById(id: string): Recipe | null {
    const row = this.db
      .prepare('SELECT * FROM recipes WHERE id = ?')
      .get(id) as any;

    if (!row) return null;

    return this.mapRowToRecipe(row);
  }

  /**
   * Lista todas las recetas, opcionalmente filtradas por fuente.
   */
  findAll(source?: 'internal' | 'instagram' | 'youtube'): Recipe[] {
    let rows: any[];

    if (source) {
      rows = this.db
        .prepare('SELECT * FROM recipes WHERE source = ?')
        .all(source) as any[];
    } else {
      rows = this.db.prepare('SELECT * FROM recipes').all() as any[];
    }

    return rows.map((row) => this.mapRowToRecipe(row));
  }

  /**
   * Busca recetas aptas para colesterol alto.
   */
  findCholesterolFriendly(): Recipe[] {
    const rows = this.db
      .prepare("SELECT * FROM recipes WHERE is_cholesterol_friendly = 1")
      .all() as any[];

    return rows.map((row) => this.mapRowToRecipe(row));
  }

  private mapRowToRecipe(row: any): Recipe {
    return {
      id: row.id,
      title: row.title,
      ingredients: JSON.parse(row.ingredients || '[]'),
      steps: JSON.parse(row.steps || '[]'),
      preparationTimeMinutes: row.preparation_time_minutes,
      servings: row.servings,
      isCholesterolFriendly: row.is_cholesterol_friendly === 1,
      saturatedFatLevel: row.saturated_fat_level,
      fiberLevel: row.fiber_level,
      source: row.source as 'internal' | 'instagram' | 'youtube',
      externalUrl: row.external_url || undefined,
      createdByUserId: row.created_by_user_id || undefined,
      createdAt: new Date(row.created_at),
    };
  }
}