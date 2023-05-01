import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import { AccessTokenStrategy } from '../strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../mongoose/schemas/user.schema';
import { AppModule } from '../app.module';
import { LoginDto } from './dtos/login.dto';
import { Types } from 'mongoose';
import { JwtPayloadWithRt } from './types';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: process.env.SECRET_KEY,
          signOptions: { expiresIn: process.env.AT_EXPIRE_DATE },
        }),
      ],
      controllers: [AuthController],
      providers: [
        { provide: 'AUTH_SERVICE', useClass: AuthService },
        {
          provide: 'USER_SERVICE',
          useClass: UserService,
        },
        AccessTokenStrategy,
        RefreshTokenStrategy,
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('Register', () => {
    it.skip('should return object which includes accessToken and refreshToken', async () => {
      const registerDto: RegisterDto = {
        email: 'admin1@gmail.com',
        userName: 'admin2',
        firstName: 'asd',
        lastName: 'dsa',
        password: '123456',
      };
      const result = await authController.register(registerDto);
      expect(result).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
  });

  describe('Login', () => {
    it.skip('should return object which includes accessToken and refreshToken', async () => {
      const loginDto: LoginDto = {
        userName: 'admin2',
        password: '123456',
      };

      const result = await authController.login(loginDto);

      expect(result).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
  });
  describe('Logout', () => {
    it.skip('should return string message', async () => {
      const result = await authController.logout();

      expect(result).toStrictEqual({ message: 'Logout is successful' });
    });
  });

  describe('Refresh', () => {
    it.skip('should return object which includes accessToken', async () => {
      const userId = new Types.ObjectId('6442ad40d5a5ef0886334793');
      const mockUser: JwtPayloadWithRt = {
        _id: userId._id,
        userName: 't',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDQyYWQ0MGQ1YTVlZjA4ODYzMzQ3OTMiLCJ1c2VyTmFtZSI6InQiLCJpYXQiOjE2ODIyNTExNzAsImV4cCI6MTY4MjI1NDc3MH0.tZxjWQYVxtVYEBJ7OwQEyhLAshniuokxLQa64dEFuA8',
      };

      const mockRequest: Request = {
        headers: {},
        url: '/auth/refresh',
        method: 'GET',
        user: mockUser,
      } as unknown as Request;

      const result = await authController.refresh(mockRequest);

      expect(result).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
        }),
      );
    });
  });
});
