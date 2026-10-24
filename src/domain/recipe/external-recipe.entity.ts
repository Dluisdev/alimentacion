export interface ExternalRecipe {
  id: string;
  userId: string;
  title: string;
  source: 'instagram' | 'youtube';
  externalUrl: string;
  ingredients: string[];
  steps: string[];
  preparationTimeMinutes: number;
  servings: number;
  isCholesterolFriendly: boolean | null; // null = pendiente de validar
  adaptations?: string[]; // sugerencias para hacerla más saludable
  isApprovedByUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImportExternalRecipeData {
  userId: string;
  source: 'instagram' | 'youtube';
  externalUrl: string;
}