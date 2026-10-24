import { ShoppingList, ShoppingItem, ProductPrice } from '../domain/product/product.entity';
import { WeeklyMenu } from '../domain/meal-plan/meal-plan.entity';
import { Recipe } from '../domain/recipe/recipe.entity';
import { Product } from '../domain/product/product.entity';

/**
 * Caso de uso: Generar lista de compras a partir de un menú semanal.
 * Agrupa por producto y busca el supermercado más barato.
 */
export interface GenerateShoppingListUseCase {
  execute(data: {
    menu: WeeklyMenu;
    recipes: Map<string, Recipe>;
    products: Product[];
    prices: ProductPrice[][];
  }): Promise<ShoppingList>;
}

export class GenerateShoppingList implements GenerateShoppingListUseCase {
  async execute(data: {
    menu: WeeklyMenu;
    recipes: Map<string, Recipe>;
    products: Product[];
    prices: ProductPrice[][];
  }): Promise<ShoppingList> {
    const { menu, recipes, products, prices } = data;

    // Extraer ingredientes únicos de las recetas del menú
    const ingredientNames = new Set<string>();
    for (const meal of menu.meals) {
      const recipe = recipes.get(meal.recipeId);
      if (recipe) {
        for (const ingredient of recipe.ingredients) {
          ingredientNames.add(ingredient.trim().toLowerCase());
        }
      }
    }

    // Para cada ingrediente, buscar el supermercado más barato
    const items: ShoppingItem[] = [];
    let totalEstimatedCost = 0;

    for (const name of ingredientNames) {
      const product = products.find((p) => p.name.toLowerCase() === name);
      if (!product) continue;

      // Recopilar precios de todos los supermercados para este producto
      const productPrices: ProductPrice[] = [];
      for (const priceList of prices) {
        const found = priceList.find((p) => p.productId === product.id);
        if (found) productPrices.push(found);
      }

      if (productPrices.length === 0) continue;

      // Encontrar el más barato
      const best = productPrices.reduce((prev, current) =>
        current.price < prev.price ? current : prev
      );

      const item: ShoppingItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1, // cantidad por defecto, se puede ajustar
        unit: product.unit,
        bestSupermarket: best.supermarket,
        bestPrice: best.price,
        allPrices: productPrices,
      };

      items.push(item);
      totalEstimatedCost += best.price;
    }

    const shoppingList: ShoppingList = {
      id: `list-${menu.userId}-${menu.weekStartDate.getTime()}`,
      userId: menu.userId,
      weekStartDate: menu.weekStartDate,
      items,
      totalEstimatedCost,
      createdAt: new Date(),
    };

    return shoppingList;
  }
}