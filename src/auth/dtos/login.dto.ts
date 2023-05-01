import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
