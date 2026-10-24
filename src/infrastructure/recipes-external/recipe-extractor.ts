// Módulo para extraer información de recetas de Instagram y YouTube.
// En una versión real, se usaría scraping ético o APIs oficiales.
// Por ahora, esta es una plantilla que extrae los datos necesarios.

export interface ExtractedRecipeData {
  title: string;
  ingredients: string[];
  steps: string[];
  preparationTimeMinutes: number;
  servings: number;
}

export class RecipeExtractor {
  /**
   * Valida que la URL sea de Instagram o YouTube.
   */
  isValidUrl(url: string): boolean {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/.+/;
    const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return instagramRegex.test(url) || youtubeRegex.test(url);
  }

  /**
   * Extrae los datos de una receta desde una URL de Instagram o YouTube.
   * En producción, aquí se haría scraping o llamada a API.
   */
  async extract(url: string): Promise<ExtractedRecipeData> {
    if (!this.isValidUrl(url)) {
      throw new Error('La URL debe ser de Instagram o YouTube');
    }

    // En producción, aquí se extraería la información real de la página
    // Por ahora, devolvemos datos de ejemplo para demostrar la estructura
    return {
      title: 'Receta importada de ' + (url.includes('instagram') ? 'Instagram' : 'YouTube'),
      ingredients: [],
      steps: [],
      preparationTimeMinutes: 30,
      servings: 4,
    };
  }
}