import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import type {
  LoginReturnType,
  LogoutReturnType,
  RefreshReturnType,
  RegisterReturnType,
} from './types/authReturn.type';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto): Promise<RegisterReturnType> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<LoginReturnType> {
    return this.authService.login(loginDto);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  refresh(@Req() req: Request): Promise<RefreshReturnType> {
    // @ts-ignore
    const { user } = req;
    return this.authService.refresh(user);
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(): LogoutReturnType {
    return this.authService.logout();
  }
}
