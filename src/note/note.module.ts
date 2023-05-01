import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from '../mongoose/schemas/note.schema';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../mongoose/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [NoteController],
  providers: [
    { provide: 'NOTE_SERVICE', useClass: NoteService },
    { provide: 'USER_SERVICE', useClass: UserService },
  ],
})
export class NoteModule {}
