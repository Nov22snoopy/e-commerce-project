import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProductStatus } from '../entites/products.entity';

export class FilterProductDto {
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
