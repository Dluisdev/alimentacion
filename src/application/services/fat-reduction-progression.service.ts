import { FatReductionLevel } from '../../domain/rule/cholesterol-rule.entity';

/**
 * Servicio de progresividad de grasas.
 * Controla cómo se reduce el contenido graso semana a semana
 * para evitar afectar el ánimo del usuario.
 */

export interface ProgressionState {
  currentLevel: FatReductionLevel;
  weekNumber: number;
  userMood: 'bien' | 'regular' | 'mal';
  canAdvance: boolean;
  message: string;
}

/**
 * Niveles de reducción de grasas:
 * 1 = Inicio (cambios mínimos, menús similares a lo que el usuario ya come)
 * 2 = Bajo (pequeños ajustes saludables)
 * 3 = Medio (reducción notable de grasas saturadas)
 * 4 = Alto (grasa mínima, solo grasas saludables)
 * 5 = Avanzado (máxima reducción, dieta muy baja en grasas saturadas)
 */
export const PROGRESSION_LEVELS: Record<
  FatReductionLevel,
  {
    name: string;
    description: string;
    maxSaturatedFatPercentage: number;
    changes: string[];
  }
> = {
  1: {
    name: 'Inicio',
    description:
      'Menús similares a lo que ya comes, con pequeños ajustes saludables.',
    maxSaturatedFatPercentage: 25,
    changes: [
      'Sustituir mantequilla por aceite de oliva en algunas recetas',
      'Añadir más verduras a los platos principales',
      'Reducir ligeramente porciones de embutidos',
    ],
  },
  2: {
    name: 'Bajo',
    description:
      'Reducción gradual de grasas saturadas. Más fibra y legumbres.',
    maxSaturatedFatPercentage: 20,
    changes: [
      'Eliminar nata y crema de leche',
      'Sustituir embutidos por carne blanca o pescado',
      'Introducir legumbres 2-3 veces por semana',
    ],
  },
  3: {
    name: 'Medio',
    description:
      'Reducción significativa. Pescado azul, frutos secos controlados.',
    maxSaturatedFatPercentage: 15,
    changes: [
      'Eliminar carnes grasas (cerdo, cordero)',
      'Pescado azul 2 veces por semana',
      'Frutos secos en cantidad controlada (puñado al día)',
    ],
  },
  4: {
    name: 'Alto',
    description:
      'Grasa mínima. Solo grasas insaturadas saludables.',
    maxSaturatedFatPercentage: 10,
    changes: [
      'Sin fritos ni rebozados',
      'Quesos bajos en grasa únicamente',
      'Máximo 3-4 yemas de huevo por semana',
    ],
  },
  5: {
    name: 'Avanzado',
    description:
      'Máxima reducción de grasas saturadas. Dieta cardioprotectora.',
    maxSaturatedFatPercentage: 5,
    changes: [
      'Solo grasas saludables (aceite de oliva, aguacate, frutos secos)',
      'Menús completamente adaptados a colesterol alto',
      'Seguimiento semanal de progreso',
    ],
  },
};

/**
 * Calcula el siguiente nivel de progresividad según el estado de ánimo del usuario.
 * Si el usuario se siente mal o desanimado, no se avanza de nivel.
 */
export function calculateNextLevel(
  currentLevel: FatReductionLevel,
  weekNumber: number,
  userMood: 'bien' | 'regular' | 'mal'
): ProgressionState {
  const levelInfo = PROGRESSION_LEVELS[currentLevel];

  // Si el usuario se siente mal, no avanzar
  if (userMood === 'mal') {
    return {
      currentLevel,
      weekNumber,
      userMood,
      canAdvance: false,
      message:
        'Has reportado que te sientes desanimado/a. Mantenemos el nivel actual para no afectar tu ánimo. Tu bienestar es lo primero.',
    };
  }

  // Si el usuario se siente regular, avanzar lentamente (cada 2 semanas)
  if (userMood === 'regular') {
    if (weekNumber % 2 === 0 && currentLevel < 5) {
      const nextLevel = currentLevel + 1 as FatReductionLevel;
      return {
        currentLevel: nextLevel,
        weekNumber,
        userMood,
        canAdvance: true,
        message: `Has avanzado al nivel ${nextLevel}: ${PROGRESSION_LEVELS[nextLevel].name}. ${PROGRESSION_LEVELS[nextLevel].description}`,
      };
    }
    return {
      currentLevel,
      weekNumber,
      userMood,
      canAdvance: false,
      message: `Manteniendo nivel ${currentLevel}: ${levelInfo.name}.`,
    };
  }

  // Si el usuario se siente bien, avanzar normalmente (cada semana)
  if (currentLevel < 5) {
    const nextLevel = currentLevel + 1 as FatReductionLevel;
    return {
      currentLevel: nextLevel,
      weekNumber,
      userMood,
      canAdvance: true,
      message: `¡Bien! Has avanzado al nivel ${nextLevel}: ${PROGRESSION_LEVELS[nextLevel].name}. ${PROGRESSION_LEVELS[nextLevel].description}`,
    };
  }

  return {
    currentLevel,
    weekNumber,
    userMood,
    canAdvance: false,
    message: `Has alcanzado el nivel máximo (5): ${levelInfo.name}. ¡Tu dieta está muy bien adaptada a tu colesterol!`,
  };
}