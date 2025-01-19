import { IsString, IsOptional } from 'class-validator';

export class UpdatePropertyDto {
  title: string;
  properties: Array<{ id: string; property: string }>;
}
