export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  preparationTimeMinutes: number;
  servings: number;
  isCholesterolFriendly: boolean;
  saturatedFatLevel: 'low' | 'medium' | 'high';
  fiberLevel: 'low' | 'medium' | 'high';
  source: 'internal' | 'instagram' | 'youtube';
  externalUrl?: string;
  createdByUserId?: string;
  createdAt: Date;
}

export interface CreateRecipeData {
  title: string;
  ingredients: string[];
  steps: string[];
  preparationTimeMinutes: number;
  servings: number;
  source: 'internal' | 'instagram' | 'youtube';
  externalUrl?: string;
  createdByUserId?: string;
}