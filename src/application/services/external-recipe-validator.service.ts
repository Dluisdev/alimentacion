import { ExternalRecipe } from '../../domain/recipe/external-recipe.entity';
import { CholesterolRulesService } from './cholesterol-rules.service';
import { FatReductionLevel } from '../../domain/rule/cholesterol-rule.entity';

/**
 * Validador de recetas externas de Instagram y YouTube.
 * Verifica que sean aptas para colesterol alto antes de incluirlas en menús.
 */
export class ExternalRecipeValidatorService {
  constructor(
    private readonly cholesterolService: CholesterolRulesService
  ) {}

  /**
   * Valida una receta extraída de Instagram o YouTube.
   * Determina si es apta para colesterol alto según el nivel del usuario.
   */
  validate(
    externalRecipe: Partial<ExternalRecipe> & {
      title: string;
      ingredients: string[];
      steps: string[];
    },
    fatReductionLevel: FatReductionLevel
  ): {
    isCholesterolFriendly: boolean;
    forbiddenIngredients: Array<{
      ingredient: string;
      rule: string;
      suggestion: string;
    }>;
    adaptations: string[];
    canBeApproved: boolean;
  } {
    const validation = this.cholesterolService.validateExternalRecipe(
      externalRecipe.title,
      externalRecipe.ingredients,
      externalRecipe.steps,
      fatReductionLevel
    );

    const forbiddenWithSuggestions = validation.forbiddenIngredients.map(
      (item) => ({
        ingredient: item.ingredient,
        rule: item.rule.name,
        suggestion: this.getSuggestionForIngredient(item.ingredient),
      })
    );

    return {
      isCholesterolFriendly: validation.isValid,
      forbiddenIngredients: forbiddenWithSuggestions,
      adaptations: validation.adaptations,
      canBeApproved: validation.isValid, // solo se aprueba si es apta
    };
  }

  /**
   * Devuelve una sugerencia de sustitución para un ingrediente prohibido.
   */
  private getSuggestionForIngredient(ingredient: string): string {
    const ingredientLower = ingredient.toLowerCase();

    const suggestions: Record<string, string> = {
      mantequilla: 'Aceite de oliva virgen extra',
      nata: 'Leche evaporada descremada o yogur griego',
      'crema de leche': 'Yogur natural sin azúcar',
      embutidos: 'Pavo o pollo sin piel',
      chorizo: 'Pimiento morrón o pimentón dulce para sabor',
      salchichas: 'Salchichas de pavo bajas en grasa',
      tocino: 'Aceitunas negras o aguacate para textura',
      'carnes grasas': 'Pechuga de pollo o pavo',
      quesos: 'Queso fresco o queso bajo en grasa',
      fritos: 'Horno, plancha o aire freidora sin aceite',
      margarina: 'Aceite de oliva virgen extra',
    };

    for (const [key, value] of Object.entries(suggestions)) {
      if (ingredientLower.includes(key)) {
        return value;
      }
    }

    return 'Buscar una alternativa baja en grasas saturadas';
  }

  /**
   * Prepara una receta externa para ser convertida en receta interna apta para menús.
   */
  prepareForMenu(
    externalRecipe: ExternalRecipe
  ): {
    title: string;
    ingredients: string[];
    steps: string[];
    warnings: string[];
  } {
    const warnings: string[] = [];

    if (!externalRecipe.isCholesterolFriendly) {
      warnings.push(
        'Esta receta contiene ingredientes no ideales para colesterol alto.'
      );
      warnings.push('Se han sugerido adaptaciones para hacerla más saludable.');
    }

    if (!externalRecipe.isApprovedByUser) {
      warnings.push(
        'El usuario debe aprobar explícitamente esta receta antes de incluirla en un menú.'
      );
    }

    return {
      title: externalRecipe.title,
      ingredients: externalRecipe.ingredients,
      steps: externalRecipe.steps,
      warnings,
    };
  }
}