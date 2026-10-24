import { ImportExternalRecipe } from '../src/application/import-external-recipe';

describe('ImportExternalRecipe', () => {
  const useCase = new ImportExternalRecipe();

  test('debe detectar ingredientes problemáticos en receta externa', async () => {
    const result = await useCase.execute({
      userId: 'user-1',
      source: 'instagram',
      externalUrl: 'https://instagram.com/p/abc123',
      extractedData: {
        title: 'Croquetas de jamón fritas',
        ingredients: ['mantequilla', 'jamón', 'huevos', 'pan rallado'],
        steps: ['Freír todo'],
        preparationTimeMinutes: 30,
        servings: 4,
      },
    });

    expect(result.isCholesterolFriendly).toBe(false);
    expect(result.adaptations.length).toBeGreaterThan(0);
  });

  test('debe aceptar receta sana', async () => {
    const result = await useCase.execute({
      userId: 'user-1',
      source: 'youtube',
      externalUrl: 'https://youtu.be/xyz789',
      extractedData: {
        title: 'Ensalada de aguacate',
        ingredients: ['aguacate', 'tomate', 'aceite de oliva virgen extra', 'limón'],
        steps: ['Mezclar'],
        preparationTimeMinutes: 10,
        servings: 2,
      },
    });

    expect(result.isCholesterolFriendly).toBe(true);
  });
});