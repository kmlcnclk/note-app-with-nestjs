import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../src/mongoose/schemas/user.schema';
import { UserService } from '../src/user/user.service';
import { LoginDto } from '../src/auth/dtos/login.dto';
import { AccessTokenGuard } from '../src/guards/accessToken.guard';
import { NoteController } from '../src/note/note.controller';
import { NoteService } from '../src/note/note.service';
import { Note, NoteSchema } from '../src/mongoose/schemas/note.schema';
import { CreateDto } from '../src/note/dtos/create.dto';
import { UpdateDto } from '../src/note/dtos/update.dto';
import { Types } from 'mongoose';

describe('NoteController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

  it.skip('/create (POST)', () => {
    const mockCreateDto: CreateDto = {
      title: 'Mock Note Title',
      content: 'Mock Note Content',
    };

    return request(app.getHttpServer())
      .post('/note/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockCreateDto)

      .expect(201)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: 'Note successfully created',
        });
      });
  });

  it.skip('/:id (PUT)', () => {
    const mockUpdateDto: UpdateDto = {
      title: 'Mock Note Title 1',
      content: 'Mock Note Content 1',
    };

    const params = {
      id: new Types.ObjectId('64441060c1e11c61989cbea4')._id,
    };

    return request(app.getHttpServer())
      .put(`/note/${params.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockUpdateDto)
      .expect(200)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: 'Note successfully updated',
        });
      });
  });

  it.skip('/:id (GET)', () => {
    const params = {
      id: new Types.ObjectId('64441060c1e11c61989cbea4')._id,
    };

    return request(app.getHttpServer())
      .get(`/note/${params.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBeDefined();
        expect(response.body.title).toBeDefined();
        expect(response.body.content).toBeDefined();
        expect(response.body.owner).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.__v).toBeDefined();
      });
  });

  it.skip('/all (GET)', () => {
    return request(app.getHttpServer())
      .get('/note/all')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        if (!response.body[0]) {
          expect(response.body).toEqual(expect.arrayContaining([]));
        } else {
          for (let i = 0; i < response.body.length; i++) {
            expect(response.body[i]._id).toBeDefined();
            expect(response.body[i].title).toBeDefined();
            expect(response.body[i].content).toBeDefined();
            expect(response.body[i].owner).toBeDefined();
            expect(response.body[i].updatedAt).toBeDefined();
            expect(response.body[i].createdAt).toBeDefined();
            expect(response.body[i].__v).toBeDefined();
          }
        }
      });
  });

  it.skip('/:id (DELETE)', () => {
    const params = {
      id: new Types.ObjectId('64441060c1e11c61989cbea4')._id,
    };

    return request(app.getHttpServer())
      .delete(`/note/${params.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: 'Note successfully deleted',
        });
      });
  });

  it('should ensure the AccessTokenGuard is applied to the NoteController', () => {
    const createGuards = Reflect.getMetadata(
      '__guards__',
      NoteController.prototype.create,
    );
    const createGuard = new createGuards[0]();

    const getAllNotesGuards = Reflect.getMetadata(
      '__guards__',
      NoteController.prototype.getAllNotes,
    );
    const getAllNotesGuard = new getAllNotesGuards[0]();

    const getNoteByIdGuards = Reflect.getMetadata(
      '__guards__',
      NoteController.prototype.getNoteById,
    );

    const getNoteByIdGuard = new getNoteByIdGuards[0]();

    const deleteGuards = Reflect.getMetadata(
      '__guards__',
      NoteController.prototype.delete,
    );
    const deleteGuard = new deleteGuards[0]();

    const updateGuards = Reflect.getMetadata(
      '__guards__',
      NoteController.prototype.update,
    );
    const updateGuard = new updateGuards[0]();

    expect(createGuard).toBeInstanceOf(AccessTokenGuard);
    expect(getAllNotesGuard).toBeInstanceOf(AccessTokenGuard);
    expect(getNoteByIdGuard).toBeInstanceOf(AccessTokenGuard);
    expect(deleteGuard).toBeInstanceOf(AccessTokenGuard);
    expect(updateGuard).toBeInstanceOf(AccessTokenGuard);
  });
});
