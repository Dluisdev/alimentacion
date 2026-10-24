export type MealType = 'desayuno' | 'comida' | 'cena' | 'merienda';

export interface Meal {
  type: MealType;
  recipeId: string;
  recipeTitle: string;
  isExternal: boolean; // true si viene de Instagram/YouTube
  externalUrl?: string;
}

export interface WeeklyMenu {
  id: string;
  userId: string;
  weekStartDate: Date;
  meals: Meal[]; // 7 días × 4 comidas = 28 comidas
  fatReductionLevel: number;
  notes?: string;
  createdAt: Date;
}

export interface CreateMenuData {
  userId: string;
  weekStartDate: Date;
  fatReductionLevel: number;
}