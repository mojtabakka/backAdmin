import { IsString, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  property: string;
}
