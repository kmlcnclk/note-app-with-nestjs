import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { CreateDto } from './dtos/create.dto';
import {
  CreateReturnType,
  DeleteReturnType,
  UpdateReturnType,
} from './types/noteReturn.type';
import mongoose from 'mongoose';
import { NoteDocument } from '../mongoose/schemas/note.schema';
import { UpdateDto } from './dtos/update.dto';

// test yaz bütün uygulamaya

@Controller('note')
export class NoteController {
  constructor(@Inject('NOTE_SERVICE') readonly noteService: NoteService) {}

  @Post('create')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request,
    @Body() createDto: CreateDto,
  ): Promise<CreateReturnType> {
    // @ts-ignore
    const { user } = req;
    return this.noteService.create(user, createDto);
  }

  @Get('all')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  getAllNotes(@Req() req: Request): Promise<NoteDocument[]> {
    // @ts-ignore
    const { user } = req;
    return this.noteService.getAllNotes(user);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  getNoteById(
    @Req() req: Request,
    @Param() params: { id: mongoose.Types.ObjectId },
  ): Promise<NoteDocument> {
    // @ts-ignore
    const { user } = req;
    return this.noteService.getNoteById(user, params.id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Req() req: Request,
    @Param() params: { id: mongoose.Types.ObjectId },
    @Body() updateDto: UpdateDto,
  ): Promise<UpdateReturnType> {
    // @ts-ignore
    const { user } = req;
    return this.noteService.update(user, params.id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  delete(
    @Req() req: Request,
    @Param() params: { id: mongoose.Types.ObjectId },
  ): Promise<DeleteReturnType> {
    // @ts-ignore
    const { user } = req;
    return this.noteService.delete(user, params.id);
  }
}
