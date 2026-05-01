import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
