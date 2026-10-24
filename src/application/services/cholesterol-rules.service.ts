import {
  CholesterolRule,
  CHOLESTEROL_FORBIDDEN_INGREDIENTS,
  CHOLESTEROL_RECOMMENDED_INGREDIENTS,
  isIngredientForbidden,
  FatReductionLevel,
} from '../../domain/rule/cholesterol-rule.entity';
import { Recipe } from '../../domain/recipe/recipe.entity';

/**
 * Servicio de validación de colesterol.
 * Evalúa si una receta es apta para una persona con colesterol alto
 * según su nivel actual de reducción de grasas.
 */
export class CholesterolRulesService {
  /**
   * Evalúa si una receta es apta para colesterol alto.
   * Devuelve un resultado detallado con los ingredientes problemáticos.
   */
  evaluateRecipe(
    recipe: Recipe,
    fatReductionLevel: FatReductionLevel
  ): {
    isCholesterolFriendly: boolean;
    forbiddenIngredients: Array<{ ingredient: string; rule: CholesterolRule }>;
    recommendedIngredientsFound: string[];
    suggestions: string[];
  } {
    const forbiddenIngredients: Array<{
      ingredient: string;
      rule: CholesterolRule;
    }> = [];
    const recommendedIngredientsFound: string[] = [];
    const suggestions: string[] = [];

    const allText = [
      recipe.title,
      ...recipe.ingredients,
      ...recipe.steps,
    ].join(' ').toLowerCase();

    // Verificar cada ingrediente de la receta
    for (const ingredient of recipe.ingredients) {
      const result = isIngredientForbidden(ingredient, fatReductionLevel);
      if (result.forbidden && result.rule) {
        forbiddenIngredients.push({ ingredient, rule: result.rule });
      }
    }

    // Verificar ingredientes recomendados presentes
    for (const recommended of CHOLESTEROL_RECOMMENDED_INGREDIENTS) {
      if (allText.includes(recommended.toLowerCase())) {
        recommendedIngredientsFound.push(recommended);
      }
    }

    // Generar sugerencias si hay ingredientes prohibidos
    if (forbiddenIngredients.length > 0) {
      suggestions.push(
        'Sustituir ingredientes prohibidos por opciones más saludables'
      );
      suggestions.push(
        'Usar aceite de oliva virgen extra en lugar de mantequilla o nata'
      );
      suggestions.push(
        'Preferir cocción al horno, plancha o vapor en lugar de fritos'
      );
    }

    return {
      isCholesterolFriendly: forbiddenIngredients.length === 0,
      forbiddenIngredients,
      recommendedIngredientsFound,
      suggestions,
    };
  }

  /**
   * Valida una receta externa (Instagram/YouTube) antes de incluirla en un menú.
   * Si no es apta, devuelve adaptaciones sugeridas.
   */
  validateExternalRecipe(
    title: string,
    ingredients: string[],
    steps: string[],
    fatReductionLevel: FatReductionLevel
  ): {
    isValid: boolean;
    forbiddenIngredients: Array<{ ingredient: string; rule: CholesterolRule }>;
    adaptations: string[];
  } {
    const tempRecipe: Recipe = {
      id: 'temp-external',
      title,
      ingredients,
      steps,
      preparationTimeMinutes: 0,
      servings: 1,
      isCholesterolFriendly: false,
      saturatedFatLevel: 'unknown',
      fiberLevel: 'unknown',
      source: 'instagram', // se sobrescribirá después
    };

    const evaluation = this.evaluateRecipe(tempRecipe, fatReductionLevel);

    const adaptations: string[] = [];
    if (evaluation.forbiddenIngredients.length > 0) {
      for (const item of evaluation.forbiddenIngredients) {
        adaptations.push(
          `Reemplazar ${item.ingredient} por una alternativa más saludable`
        );
      }
      adaptations.push('Usar aceite de oliva virgen extra en lugar de grasas saturadas');
      adaptations.push('Evitar fritos; prefiera horno, plancha o vapor');
    }

    return {
      isValid: evaluation.isCholesterolFriendly,
      forbiddenIngredients: evaluation.forbiddenIngredients,
      adaptations,
    };
  }
}