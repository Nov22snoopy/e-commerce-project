import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateColorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsHexColor()
  hexCode?: string;
}
