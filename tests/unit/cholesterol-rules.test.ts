import { CholesterolRulesService } from '../src/application/services/cholesterol-rules.service';
import { Recipe } from '../src/domain/recipe/recipe.entity';

describe('CholesterolRulesService', () => {
  const service = new CholesterolRulesService();

  const recipeWithoutProblems: Recipe = {
    id: 'rec-1',
    title: 'Ensalada de garbanzos',
    ingredients: ['garbanzos', 'tomate', 'cebolla', 'aceite de oliva virgen extra'],
    steps: ['Mezclar todo'],
    preparationTimeMinutes: 15,
    servings: 4,
    isCholesterolFriendly: true,
    saturatedFatLevel: 'low',
    fiberLevel: 'high',
    source: 'internal',
    createdAt: new Date(),
  };

  const recipeWithProblems: Recipe = {
    id: 'rec-2',
    title: 'Croquetas fritas',
    ingredients: ['mantequilla', 'nata', 'jamón cocido', 'pan rallado'],
    steps: ['Freír en aceite'],
    preparationTimeMinutes: 30,
    servings: 4,
    isCholesterolFriendly: false,
    saturatedFatLevel: 'high',
    fiberLevel: 'low',
    source: 'internal',
    createdAt: new Date(),
  };

  test('debe validar una receta apta para colesterol alto', () => {
    const result = service.evaluateRecipe(recipeWithoutProblems, 1);
    expect(result.isCholesterolFriendly).toBe(true);
    expect(result.forbiddenIngredients.length).toBe(0);
  });

  test('debe rechazar una receta con ingredientes prohibidos', () => {
    const result = service.evaluateRecipe(recipeWithProblems, 1);
    expect(result.isCholesterolFriendly).toBe(false);
    expect(result.forbiddenIngredients.length).toBeGreaterThan(0);
  });
});