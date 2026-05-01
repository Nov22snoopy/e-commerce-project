import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateSkuDto } from './create-sku.dto';

export class CreateProductVariantDto {
  @IsUUID()
  @IsNotEmpty()
  colorId: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkuDto)
  skus: CreateSkuDto[];
}
