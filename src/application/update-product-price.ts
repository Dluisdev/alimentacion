import { ProductPrice } from '../domain/product/product.entity';

/**
 * Caso de uso: Actualizar o insertar el precio de un producto
 * en un supermercado específico.
 * Se usa cuando el usuario introduce precios manualmente.
 */
export interface UpdateProductPriceUseCase {
  execute(data: {
    productId: string;
    productName: string;
    supermarket: string;
    pricePerKg: number;
    currency?: string;
    ingredients?: string[];
    isUltraProcessed?: boolean;
    notes?: string;
  }): ProductPrice;
}

export class UpdateProductPrice implements UpdateProductPriceUseCase {
  constructor(
    private readonly priceRepository: any
  ) {}

  async execute(data: {
    productId: string;
    productName: string;
    supermarket: string;
    pricePerKg: number;
    currency?: string;
    ingredients?: string[];
    isUltraProcessed?: boolean;
    notes?: string;
  }): Promise<ProductPrice> {
    const price = this.priceRepository.savePrice(data);
    return price;
  }
}