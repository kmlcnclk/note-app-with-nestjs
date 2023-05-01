import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../src/mongoose/schemas/user.schema';
import { UserService } from '../src/user/user.service';
import { LoginDto } from '../src/auth/dtos/login.dto';
import { AccessTokenGuard } from '../src/guards/accessToken.guard';
import { UserController } from '../src/user/user.controller';
import { UpdateDto } from '../src/user/dtos/update.dto';
import { ChangePasswordDto } from 'src/user/dtos/changePassword.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useClass: UserService,
        },
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
  });

  afterAll(async () => {
    await app.close();
  });

  it.skip('/profile (POST)', () => {
    return request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBeDefined();
        expect(response.body.userName).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.firstName).toBeDefined();
        expect(response.body.lastName).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.__v).toBeDefined();
      });
  });

  it.skip('/update (PUT)', () => {
    const newUser: UpdateDto = {
      firstName: 'admin88',
      userName: 'admin88',
      lastName: '3',
      email: 'admin88@gmail.com',
    };
    return request(app.getHttpServer())
      .put('/user/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newUser)
      .expect(200)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: 'User successfully updated',
        });
      });
  });

  it.skip('/changePassword (PATCH)', () => {
    const mockChangePasswordDto: ChangePasswordDto = {
      newPassword: '123456',
      oldPassword: '123456',
    };

    return request(app.getHttpServer())
      .patch('/user/changePassword')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockChangePasswordDto)
      .expect(200)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: 'Password successfully changed',
        });
      });
  });

  it.skip('/delete (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/user/delete')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: 'User successfully deleted',
        });
      });
  });

  it('should ensure the AccessTokenGuard is applied to the UserController', () => {
    const profileGuards = Reflect.getMetadata(
      '__guards__',
      UserController.prototype.profile,
    );
    const profileGuard = new profileGuards[0]();

    const changePasswordGuards = Reflect.getMetadata(
      '__guards__',
      UserController.prototype.changePassword,
    );
    const changePasswordGuard = new changePasswordGuards[0]();

    const deleteGuards = Reflect.getMetadata(
      '__guards__',
      UserController.prototype.delete,
    );
    const deleteGuard = new deleteGuards[0]();

    const updateGuards = Reflect.getMetadata(
      '__guards__',
      UserController.prototype.update,
    );
    const updateGuard = new updateGuards[0]();

    expect(profileGuard).toBeInstanceOf(AccessTokenGuard);
    expect(changePasswordGuard).toBeInstanceOf(AccessTokenGuard);
    expect(deleteGuard).toBeInstanceOf(AccessTokenGuard);
    expect(updateGuard).toBeInstanceOf(AccessTokenGuard);
  });
});
