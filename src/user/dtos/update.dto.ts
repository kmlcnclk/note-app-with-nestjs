import { IsEmail, IsOptional } from 'class-validator';

export class UpdateDto {
  userName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  firstName?: string;

  lastName?: string;
}
