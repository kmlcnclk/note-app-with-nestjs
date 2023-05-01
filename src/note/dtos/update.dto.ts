import { IsOptional, MaxLength } from 'class-validator';

export class UpdateDto {
  title?: string;

  @IsOptional()
  @MaxLength(500)
  content?: string;
}
