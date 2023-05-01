import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { UserDocument } from '../mongoose/schemas/user.schema';
import {
  ChangePasswordReturnType,
  DeleteReturnType,
  UpdateReturnType,
} from './types/userReturn.type';
import { UpdateDto } from './dtos/update.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';

@Controller('user')
export class UserController {
  constructor(@Inject('USER_SERVICE') readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  profile(@Req() req: Request): Promise<UserDocument> {
    // @ts-ignore
    const { user } = req;
    return this.userService.profile(user);
  }

  @Put('update')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Req() req: Request,
    @Body() updateDto: UpdateDto,
  ): Promise<UpdateReturnType> {
    // @ts-ignore
    const { user } = req;
    return this.userService.update(user, updateDto);
  }

  @Patch('changePassword')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordReturnType> {
    // @ts-ignore
    const { user } = req;
    return this.userService.changePassword(user, changePasswordDto);
  }


  // user silidiğinde otomatik olarak bütün note ları da sil mongo db de oto bişe vardı galiba yada mongo da biryerde schemaya bişe ekleycez ya da burdan kod olarak yazacz yap bunu
  @Delete('delete')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Req() req: Request): Promise<DeleteReturnType> {
    // @ts-ignore
    const { user } = req;
    return this.userService.delete(user);
  }
}
