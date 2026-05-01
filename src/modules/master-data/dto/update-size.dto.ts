import { IsOptional, IsString } from 'class-validator';

export class UpdateSizeDto {
  @IsOptional()
  @IsString()
  name?: string;
}
