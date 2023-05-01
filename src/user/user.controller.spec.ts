import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../mongoose/schemas/user.schema';
import { AppModule } from '../app.module';
import { UserController } from './user.controller';
import { Request } from '@nestjs/common';
import { JwtPayload } from '../auth/types';
import { Types } from 'mongoose';
import { UpdateDto } from './dtos/update.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    userController = app.get<UserController>(UserController);
  });

  describe('Profile', () => {
    it.skip('should return user object', async () => {
      const userId = new Types.ObjectId('6443c7f98ccc4ead4ec32115');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 'admin2',
      };

      const mockRequest: Request = {
        headers: {},
        url: '/user/profile',
        method: 'GET',
        user: mockUser,
      } as unknown as Request;

      const result = await userController.profile(mockRequest);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.any(Types.ObjectId),
          userName: expect.any(String),
          email: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
          __v: expect.any(Number),
        }),
      );
    });
  });

  describe('Update', () => {
    it.skip('should return string message', async () => {
      const userId = new Types.ObjectId('6443c7f98ccc4ead4ec32115');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 'admin99',
      };

      const newUser: UpdateDto = {
        firstName: 'admin',
        userName: 'admin3',
        lastName: '3',
        email: 'admin3@gmail.com',
      };

      const mockRequest: Request = {
        headers: {},
        url: '/user/update',
        method: 'PUT',
        user: mockUser,
      } as unknown as Request;

      const result = await userController.update(mockRequest, newUser);

      expect(result).toStrictEqual({ message: 'User successfully updated' });
    });
  });

  describe('Change Password', () => {
    it.skip('should return string message', async () => {
      const userId = new Types.ObjectId('6443c7f98ccc4ead4ec32115');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 'admin3',
      };

      const mockChangePasswordDto: ChangePasswordDto = {
        newPassword: '123456',
        oldPassword: '123456',
      };

      const mockRequest: Request = {
        headers: {},
        url: '/user/changePassword',
        method: 'PUT',
        user: mockUser,
      } as unknown as Request;

      const result = await userController.changePassword(
        mockRequest,
        mockChangePasswordDto,
      );

      expect(result).toStrictEqual({
        message: 'Password successfully changed',
      });
    });
  });

  describe('Delete', () => {
    it.skip('should return string message', async () => {
      const userId = new Types.ObjectId('64426584ce0b42d93ba41a9e');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 'asd',
      };

      const mockRequest: Request = {
        headers: {},
        url: '/user/delete',
        method: 'DELETE',
        user: mockUser,
      } as unknown as Request;

      const result = await userController.delete(mockRequest);

      expect(result).toStrictEqual({ message: 'User successfully deleted' });
    });
  });
});
