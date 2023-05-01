import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// import { Note, NoteDocument, NoteModel, NoteSchema } from './note.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6, select: false })
  password: string;

  // @Prop({ default: now() })
  // createdAt: Date;

  // @Prop({ default: now() })
  // updatedAt: Date;

  // @Prop({})
  // access_token: string;

  @Prop({ select: false })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre('remove', async (next) => {
//   try {
//     // @ts-ignore
//     await NoteModel.deleteMany({ owner: this._id });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
