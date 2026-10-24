/**
 * Reglas de colesterol alto.
 * Define qué ingredientes y nutrientes están permitidos o restringidos.
 */

export type FatReductionLevel = 1 | 2 | 3 | 4 | 5;

export interface CholesterolRule {
  id: string;
  name: string;
  description: string;
  isForbidden: boolean; // true = ingrediente prohibido, false = permitido con moderación
  maxAmountPerWeek?: number; // cantidad máxima por semana (en gramos o porciones)
  appliesFromLevel?: FatReductionLevel; // a partir de qué nivel se aplica esta regla
}

/**
 * Ingredientes prohibidos o restringidos para colesterol alto.
 * Estos se usan para validar recetas (internas y externas de IG/YT).
 */
export const CHOLESTEROL_FORBIDDEN_INGREDIENTS: CholesterolRule[] = [
  {
    id: 'rule-001',
    name: 'Mantequilla',
    description: 'Alta en grasas saturadas. Se elimina progresivamente.',
    isForbidden: true,
    appliesFromLevel: 3, // a partir del nivel 3 se prohíbe totalmente
  },
  {
    id: 'rule-002',
    name: 'Nata / Crema de leche',
    description: 'Muy alta en grasas saturadas.',
    isForbidden: true,
    appliesFromLevel: 2,
  },
  {
    id: 'rule-003',
    name: 'Embutidos (chorizo, salchichas, mortadela)',
    description: 'Altos en grasas saturadas y sal.',
    isForbidden: true,
    appliesFromLevel: 2,
  },
  {
    id: 'rule-004',
    name: 'Carnes grasas (cerdo, cordero, pato)',
    description: 'Contienen grasas saturadas elevadas.',
    isForbidden: true,
    appliesFromLevel: 3,
  },
  {
    id: 'rule-005',
    name: 'Fritos y rebozados',
    description: 'Absorben aceite y aumentan grasas trans.',
    isForbidden: true,
    appliesFromLevel: 2,
  },
  {
    id: 'rule-006',
    name: 'Quesos grasos (queso curado, manchego, ceb)',
    description: 'Altos en grasas saturadas.',
    isForbidden: true,
    appliesFromLevel: 3,
  },
  {
    id: 'rule-007',
    name: 'Yemas de huevo (exceso)',
    description: 'Ricas en colesterol dietético. Máximo 3-4 por semana.',
    isForbidden: false,
    maxAmountPerWeek: 4,
    appliesFromLevel: 1,
  },
  {
    id: 'rule-008',
    name: 'Margarina',
    description: 'Puede contener grasas trans.',
    isForbidden: true,
    appliesFromLevel: 1,
  },
];

/**
 * Ingredientes recomendados (favorables para colesterol).
 */
export const CHOLESTEROL_RECOMMENDED_INGREDIENTS: string[] = [
  'aceite de oliva virgen extra',
  'pescado azul (salmón, sardinas, caballa)',
  'legumbres (lentejas, garbanzos, frijoles)',
  'avena',
  'frutos secos (nueces, almendras)',
  'frutas y verduras',
  'cereales integrales',
  'semillas (chía, lino)',
  'carne blanca (pollo, pavo sin piel)',
];

/**
 * Verifica si un ingrediente está prohibido según el nivel de reducción de grasas.
 */
export function isIngredientForbidden(
  ingredient: string,
  fatReductionLevel: FatReductionLevel
): { forbidden: boolean; rule?: CholesterolRule } {
  const ingredientLower = ingredient.toLowerCase();

  for (const rule of CHOLESTEROL_FORBIDDEN_INGREDIENTS) {
    const ruleNameLower = rule.name.toLowerCase();
    if (
      ingredientLower.includes(ruleNameLower) ||
      ruleNameLower.includes(ingredientLower)
    ) {
      // Si la regla aplica desde un nivel superior al actual, no está prohibido aún
      if (rule.appliesFromLevel && fatReductionLevel < rule.appliesFromLevel) {
        return { forbidden: false, rule };
      }
      return { forbidden: true, rule };
    }
  }

  return { forbidden: false };
}