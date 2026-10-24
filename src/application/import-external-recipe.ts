import { ExternalRecipe } from '../domain/recipe/external-recipe.entity';
import { Recipe } from '../domain/recipe/recipe.entity';

/**
 * Caso de uso: Importar una receta externa de Instagram o YouTube.
 * Valida que sea apta para colesterol alto antes de guardarla.
 */
export interface ImportExternalRecipeUseCase {
  execute(data: {
    userId: string;
    source: 'instagram' | 'youtube';
    externalUrl: string;
    extractedData: {
      title: string;
      ingredients: string[];
      steps: string[];
      preparationTimeMinutes: number;
      servings: number;
    };
  }): Promise<ExternalRecipe>;
}

export class ImportExternalRecipe implements ImportExternalRecipeUseCase {
  async execute(data: {
    userId: string;
    source: 'instagram' | 'youtube';
    externalUrl: string;
    extractedData: {
      title: string;
      ingredients: string[];
      steps: string[];
      preparationTimeMinutes: number;
      servings: number;
    };
  }): Promise<ExternalRecipe> {
    const {
      userId,
      source,
      externalUrl,
      extractedData,
    } = data;

    // Validación simple de colesterol: buscar ingredientes problemáticos
    const highFatIngredients = [
      'mantequilla', 'nata', 'crema de leche', 'embutido', 'chorizo',
      'salchicha', 'tocino', 'lard', 'grasa', 'frito', 'fritura',
      'huevo yema', 'queso graso', 'margarina',
    ];

    const allText = [
      extractedData.title,
      ...extractedData.ingredients,
      ...extractedData.steps,
    ].join(' ').toLowerCase();

    const hasProblematicIngredients = highFatIngredients.some((ingredient) =>
      allText.includes(ingredient.toLowerCase())
    );

    const isCholesterolFriendly = !hasProblematicIngredients;

    const adaptations: string[] = [];
    if (!isCholesterolFriendly) {
      adaptations.push(
        'Sustituir la mantequilla por aceite de oliva virgen extra',
        'Usar carnes magras en lugar de embutidos',
        'Evitar freír; prefiere horno, plancha o vapor',
        'Reducir o elimina los quesos grasos'
      );
    }

    const externalRecipe: ExternalRecipe = {
      id: `ext-${Date.now()}`,
      userId,
      title: extractedData.title,
      source,
      externalUrl,
      ingredients: extractedData.ingredients,
      steps: extractedData.steps,
      preparationTimeMinutes: extractedData.preparationTimeMinutes,
      servings: extractedData.servings,
      isCholesterolFriendly,
      adaptations: isCholesterolFriendly ? [] : adaptations,
      isApprovedByUser: false, // el usuario debe aprobar explícitamente
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return externalRecipe;
  }
}

export interface ConvertExternalRecipeToInternalUseCase {
  execute(data: {
    externalRecipe: ExternalRecipe;
  }): Recipe;
}

export class ConvertExternalRecipeToInternal implements ConvertExternalRecipeToInternalUseCase {
  execute(data: {
    externalRecipe: ExternalRecipe;
  }): Recipe {
    const { externalRecipe } = data;

    return {
      id: `recipe-${externalRecipe.id}`,
      title: externalRecipe.title,
      ingredients: externalRecipe.ingredients,
      steps: externalRecipe.steps,
      preparationTimeMinutes: externalRecipe.preparationTimeMinutes,
      servings: externalRecipe.servings,
      isCholesterolFriendly: externalRecipe.isCholesterolFriendly,
      saturatedFatLevel: externalRecipe.isCholesterolFriendly ? 'low' : 'medium',
      fiberLevel: 'medium', // valor por defecto, se puede refinar
      source: externalRecipe.source,
      externalUrl: externalRecipe.externalUrl,
      createdByUserId: externalRecipe.userId,
      createdAt: new Date(),
    };
  }
}