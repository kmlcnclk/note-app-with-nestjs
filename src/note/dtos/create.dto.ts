import { MaxLength } from 'class-validator';

export class CreateDto {
  title?: string;

  @MaxLength(500)
  content?: string;
}
