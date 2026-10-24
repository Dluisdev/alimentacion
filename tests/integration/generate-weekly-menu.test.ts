import { GenerateWeeklyMenu } from '../src/application/generate-weekly-menu';
import { Recipe } from '../src/domain/recipe/recipe.entity';

describe('GenerateWeeklyMenu (integración)', () => {
  const generator = new GenerateWeeklyMenu();

  const recipes: Recipe[] = [
    {
      id: 'rec-1',
      title: 'Avena con frutas',
      ingredients: ['avena', 'leche vegetal', 'plátano'],
      steps: ['Mezclar'],
      preparationTimeMinutes: 10,
      servings: 1,
      isCholesterolFriendly: true,
      saturatedFatLevel: 'low',
      fiberLevel: 'high',
      source: 'internal',
      createdAt: new Date(),
    },
    {
      id: 'rec-2',
      title: 'Salmón al horno',
      ingredients: ['salmón', 'brócoli', 'aceite de oliva virgen extra'],
      steps: ['Hornear'],
      preparationTimeMinutes: 25,
      servings: 2,
      isCholesterolFriendly: true,
      saturatedFatLevel: 'low',
      fiberLevel: 'medium',
      source: 'internal',
      createdAt: new Date(),
    },
  ];

  test('debe generar un menú semanal con 28 comidas', async () => {
    const user = {
      id: 'user-1',
      phoneNumber: '+34600000000',
      name: 'Usuario prueba',
      hasHighCholesterol: true,
      fatReductionLevel: 1,
      preferences: [],
      allergies: [],
      dislikes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await generator.execute({
      user,
      weekStartDate: new Date(),
      availableRecipes: recipes,
    });

    expect(result.menu.meals.length).toBe(28); // 7 días × 4 comidas
    expect(result.evaluation.recipesKept).toBeGreaterThan(0);
  });
});