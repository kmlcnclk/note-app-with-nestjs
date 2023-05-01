import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { JwtPayload } from '../auth/types';
import { Note, NoteDocument } from '../mongoose/schemas/note.schema';
import { CreateDto } from './dtos/create.dto';
import { UserService } from '../user/user.service';
import {
  CreateReturnType,
  DeleteReturnType,
  UpdateReturnType,
} from './types/noteReturn.type';
import { UpdateDto } from './dtos/update.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @Inject('USER_SERVICE') readonly userService: UserService,
  ) {}

  async create(
    user: JwtPayload,
    createDto: CreateDto,
  ): Promise<CreateReturnType> {
    await this.userService.findUserById(user._id);

    const note = new this.noteModel({ ...createDto, owner: user._id });
    await note.save();

    return {
      message: 'Note successfully created',
    };
  }

  async findNoteByIdWithUserId(
    id: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument> {
    const note = await this.noteModel.findOne({ _id: id, owner: userId });

    if (!note) throw new NotFoundException('There is no note with this id');

    return note;
  }

  async findAllNotesWithUserId(
    userId: mongoose.Types.ObjectId,
  ): Promise<NoteDocument[]> {
    const notes = await this.noteModel.find({ owner: userId });

    return notes;
  }

  async getNoteById(
    user: JwtPayload,
    id: mongoose.Types.ObjectId,
  ): Promise<NoteDocument> {
    await this.userService.findUserById(user._id);

    const note = await this.findNoteByIdWithUserId(id, user._id);

    return note;
  }

  async getAllNotes(user: JwtPayload): Promise<NoteDocument[]> {
    await this.userService.findUserById(user._id);

    const notes = await this.findAllNotesWithUserId(user._id);

    return notes;
  }

  async update(
    user: JwtPayload,
    id: mongoose.Types.ObjectId,
    updateDto: UpdateDto,
  ): Promise<UpdateReturnType> {
    await this.userService.findUserById(user._id);
    const note = await this.findNoteByIdWithUserId(id, user._id);

    await note.updateOne({ ...updateDto });

    return { message: 'Note successfully updated' };
  }

  async delete(
    user: JwtPayload,
    id: mongoose.Types.ObjectId,
  ): Promise<DeleteReturnType> {
    await this.userService.findUserById(user._id);
    const note = await this.findNoteByIdWithUserId(id, user._id);

    await note.remove();

    return {
      message: 'Note successfully deleted',
    };
  }
}
