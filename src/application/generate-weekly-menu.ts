import { WeeklyMenu, Meal, MealType } from '../domain/meal-plan/meal-plan.entity';
import { Recipe } from '../domain/recipe/recipe.entity';
import { User } from '../domain/user/user.entity';
import { CholesterolRulesService } from './services/cholesterol-rules.service';
import { FatReductionLevel } from '../domain/rule/cholesterol-rule.entity';

/**
 * Caso de uso: Generar un menú semanal adaptado al colesterol del usuario.
 * Ahora incluye progresividad de grasas y filtrado por colesterol.
 */
export interface GenerateWeeklyMenuUseCase {
  execute(data: {
    user: User;
    weekStartDate: Date;
    availableRecipes: Recipe[];
    userRecipes?: Recipe[]; // recetas propias del usuario (incluidas de IG/YT)
    fatReductionLevel?: FatReductionLevel; // si se omite, se usa la del usuario
  }): Promise<{
    menu: WeeklyMenu;
    evaluation: {
      recipesFiltered: number;
      recipesKept: number;
      forbiddenIngredientsFound: string[];
      progressionMessage: string;
    };
  }>;
}

export class GenerateWeeklyMenu implements GenerateWeeklyMenuUseCase {
  private cholesterolService = new CholesterolRulesService();

  async execute(data: {
    user: User;
    weekStartDate: Date;
    availableRecipes: Recipe[];
    userRecipes?: Recipe[];
    fatReductionLevel?: FatReductionLevel;
  }): Promise<{
    menu: WeeklyMenu;
    evaluation: {
      recipesFiltered: number;
      recipesKept: number;
      forbiddenIngredientsFound: string[];
      progressionMessage: string;
    };
  }> {
    const { user, weekStartDate, availableRecipes, userRecipes = [] } = data;
    const fatReductionLevel =
      data.fatReductionLevel ?? user.fatReductionLevel;

    // Combinar recetas internas y propias del usuario
    const allRecipes = [...availableRecipes, ...userRecipes];

    // Filtrar recetas aptas para colesterol según el nivel del usuario
    const keptRecipes: Recipe[] = [];
    const forbiddenIngredientsFound: string[] = [];

    for (const recipe of allRecipes) {
      const evaluation = this.cholesterolService.evaluateRecipe(
        recipe,
        fatReductionLevel
      );

      if (evaluation.isCholesterolFriendly) {
        keptRecipes.push(recipe);
      } else {
        // Recoger ingredientes prohibidos para informar al usuario
        for (const item of evaluation.forbiddenIngredients) {
          forbiddenIngredientsFound.push(item.ingredient);
        }
      }
    }

    const recipesFiltered = allRecipes.length - keptRecipes.length;
    const recipesKept = keptRecipes.length;

    // Si no hay suficientes recetas aptas, usar las que hay con advertencia
    const recipesToUse =
      keptRecipes.length > 0 ? keptRecipes : allRecipes.slice(0, 7);

    // Generar 7 días × 4 comidas = 28 comidas
    const mealTypes: MealType[] = ['desayuno', 'comida', 'cena', 'merienda'];
    const days = 7;
    const meals: Meal[] = [];

    let recipeIndex = 0;
    for (let day = 0; day < days; day++) {
      for (const type of mealTypes) {
        const recipe = recipesToUse[recipeIndex % recipesToUse.length];
        meals.push({
          type,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          isExternal: recipe.source !== 'internal',
          externalUrl: recipe.externalUrl,
        });
        recipeIndex++;
      }
    }

    const menu: WeeklyMenu = {
      id: `menu-${user.id}-${weekStartDate.getTime()}`,
      userId: user.id,
      weekStartDate,
      meals,
      fatReductionLevel,
      notes: `Menú generado con nivel de reducción de grasas: ${fatReductionLevel}/5. Recetas filtradas por colesterol: ${recipesFiltered} eliminadas, ${recipesKept} mantenidas.`,
      createdAt: new Date(),
    };

    return {
      menu,
      evaluation: {
        recipesFiltered,
        recipesKept,
        forbiddenIngredientsFound: [...new Set(forbiddenIngredientsFound)],
        progressionMessage: `Nivel de reducción de grasas: ${fatReductionLevel}/5`,
      },
    };
  }
}