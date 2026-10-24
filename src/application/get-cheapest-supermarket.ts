import { ProductPrice } from '../domain/product/product.entity';

/**
 * Caso de uso: Obtener el supermercado más barato para un producto.
 */
export interface GetCheapestSupermarketUseCase {
  execute(data: {
    productId: string;
  }): {
    supermarket: string;
    price: number;
    allPrices: ProductPrice[];
  } | null;
}

export class GetCheapestSupermarket implements GetCheapestSupermarketUseCase {
  constructor(
    private readonly priceRepository: any
  ) {}

  async execute(data: {
    productId: string;
  }): Promise<{
    supermarket: string;
    price: number;
    allPrices: ProductPrice[];
  } | null> {
    return this.priceRepository.getCheapestSupermarketForProduct(data.productId);
  }
}