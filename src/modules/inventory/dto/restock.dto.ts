import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RestockDto {
  @IsString()
  @IsNotEmpty()
  skuCode: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
