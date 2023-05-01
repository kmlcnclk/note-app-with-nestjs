import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop({ default: '' })
  title: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: string;

  // @Prop({ default: now() })
  // createdAt: Date;

  // @Prop({ default: now() })
  // updatedAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// export const NoteModel: any = model('Note', NoteSchema);
