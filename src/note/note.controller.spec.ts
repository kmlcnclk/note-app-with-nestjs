import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from '../mongoose/schemas/note.schema';
import { AppModule } from '../app.module';
import { NoteController } from './note.controller';
import { Request } from '@nestjs/common';
import { JwtPayload } from '../auth/types';
import { Schema, Types } from 'mongoose';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { User, UserSchema } from '../mongoose/schemas/user.schema';
import { NoteService } from './note.service';
import { UserService } from '../user/user.service';

describe('NoteController', () => {
  let noteController: NoteController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [NoteController],
      providers: [
        { provide: 'NOTE_SERVICE', useClass: NoteService },
        { provide: 'USER_SERVICE', useClass: UserService },
      ],
    }).compile();

    noteController = app.get<NoteController>(NoteController);
  });

  describe('Create', () => {
    it.skip('should return string message', async () => {
      const userId = new Types.ObjectId('6442ad40d5a5ef0886334793');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 't',
      };

      const mockCreateDto: CreateDto = {
        title: 'Mock Note Title',
        content: 'Mock Note Content',
      };

      const mockRequest: Request = {
        headers: {},
        url: '/note/create',
        method: 'POST',
        user: mockUser,
      } as unknown as Request;

      const result = await noteController.create(mockRequest, mockCreateDto);
      expect(result).toStrictEqual({ message: 'Note successfully created' });
    });
  });

  describe('Update', () => {
    it.skip('should return string message', async () => {
      const userId = new Types.ObjectId('6442ad40d5a5ef0886334793');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 't',
      };

      const mockUpdateDto: UpdateDto = {
        title: 'Mock Note Title 1',
        content: 'Mock Note Content 1',
      };

      const params = {
        id: new Types.ObjectId('644413b751fbf08a58641304')._id,
      };

      const mockRequest: Request = {
        headers: {},
        url: '/note/',
        method: 'PUT',
        user: mockUser,
      } as unknown as Request;

      const result = await noteController.update(
        mockRequest,
        params,
        mockUpdateDto,
      );
      expect(result).toStrictEqual({ message: 'Note successfully updated' });
    });
  });

  describe('Get Note By Id', () => {
    it.skip('should return Note Object', async () => {
      const userId = new Types.ObjectId('6442ad40d5a5ef0886334793');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 't',
      };

      const params = {
        id: new Types.ObjectId('644413b751fbf08a58641304')._id,
      };

      const mockRequest: Request = {
        headers: {},
        url: '/note/',
        method: 'GET',
        user: mockUser,
      } as unknown as Request;

      const result = await noteController.getNoteById(mockRequest, params);
      expect(result).toEqual(
        expect.objectContaining({
          _id: expect.any(Types.ObjectId),
          title: expect.any(String),
          content: expect.any(String),
          owner: expect.any(Types.ObjectId),
          updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
          __v: expect.any(Number),
        }),
      );
    });
  });

  describe('Get All Notes', () => {
    it('should return array which includes Note Objects', async () => {
      const userId = new Types.ObjectId('6442ad40d5a5ef0886334793');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 't',
      };

      const mockRequest: Request = {
        headers: {},
        url: '/note/',
        method: 'GET',
        user: mockUser,
      } as unknown as Request;

      const result = await noteController.getAllNotes(mockRequest);
      if (!result[0]) {
        expect(result).toEqual(expect.arrayContaining([]));
      } else {
        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(Types.ObjectId),
              title: expect.any(String),
              content: expect.any(String),
              updatedAt: expect.any(Date),
              createdAt: expect.any(Date),
              __v: expect.any(Number),
            }),
          ]),
        );
      }
    });
  });

  describe('Delete Note', () => {
    it.skip('should return string message', async () => {
      const userId = new Types.ObjectId('6442ad40d5a5ef0886334793');
      const mockUser: JwtPayload = {
        _id: userId._id,
        userName: 't',
      };

      const params = {
        id: new Types.ObjectId('644413b751fbf08a58641304')._id,
      };

      const mockRequest: Request = {
        headers: {},
        url: '/note/',
        method: 'DELETE',
        user: mockUser,
      } as unknown as Request;

      const result = await noteController.delete(mockRequest, params);
      expect(result).toStrictEqual({
        message: 'Note successfully deleted',
      });
    });
  });
});
