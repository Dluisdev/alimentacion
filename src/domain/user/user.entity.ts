export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  hasHighCholesterol: boolean;
  fatReductionLevel: number; // 1 = inicio (poco cambio), 5 = avanzado (mucho cambio)
  preferences: string[]; // comidas que le gustan
  allergies: string[]; // alergias
  dislikes: string[]; // comidas que no le gustan
  mood?: 'bien' => 'bien' | 'regular' | 'mal'; // estado de ánimo para monitorear depresión
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  phoneNumber: string;
  name?: string;
  hasHighCholesterol?: boolean;
  preferences?: string[];
  allergies?: string[];
  dislikes?: string[];
}