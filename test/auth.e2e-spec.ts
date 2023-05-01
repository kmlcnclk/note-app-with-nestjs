import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../src/mongoose/schemas/user.schema';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { AccessTokenStrategy } from '../src/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../src/strategies/refreshToken.strategy';
import { RegisterDto } from '../src/auth/dtos/register.dto';
import { LoginDto } from '../src/auth/dtos/login.dto';
import { AccessTokenGuard } from '../src/guards/accessToken.guard';
import { RefreshTokenGuard } from '../src/guards/refreshToken.guard';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const loginDto: LoginDto = {
      userName: 't',
      password: '123456',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it.skip('/register (POST)', () => {
    const registerDto: RegisterDto = {
      email: 'admin7@gmail.com',
      userName: 'admin7',
      firstName: 'asd',
      lastName: 'dsa',
      password: '123456',
    };
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
      });
  });

  it.skip('/login (POST)', () => {
    const loginDto: LoginDto = {
      userName: 'admin7',
      password: '123456',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
      });
  });

  it.skip('/logout (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: 'Logout is successful',
        });
      });
  });

  it.skip('should return 401 if access token is missing', () => {
    return request(app.getHttpServer()).get('/auth/logout').expect(401);
  });

  it.skip('/refresh (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(201)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
      });
  });

  it('should ensure the AccessTokenGuard and RefreshTokenGuard is applied to the AuthController', () => {
    const logoutGuards = Reflect.getMetadata(
      '__guards__',
      AuthController.prototype.logout,
    );
    const logoutGuard = new logoutGuards[0]();

    const refreshGuards = Reflect.getMetadata(
      '__guards__',
      AuthController.prototype.refresh,
    );
    const refreshGuard = new refreshGuards[0]();

    expect(logoutGuard).toBeInstanceOf(AccessTokenGuard);
    expect(refreshGuard).toBeInstanceOf(RefreshTokenGuard);
  });
});
