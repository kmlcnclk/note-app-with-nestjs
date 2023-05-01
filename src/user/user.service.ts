import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../mongoose/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../auth/types';
import {
  ChangePasswordReturnType,
  DeleteReturnType,
  UpdateReturnType,
} from './types/userReturn.type';
import { UpdateDto } from './dtos/update.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { comparePasswords, encodePassword } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (user) return true;
    return false;
  }

  async isUserNameExist(userName: string): Promise<boolean> {
    const user = await this.userModel.findOne({ userName });
    if (user) return true;
    return false;
  }

  async findUserById(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user)
      throw new NotFoundException('There is no user with this username');

    return user;
  }

  async findUserByIdWithPassword(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('+password');
    if (!user)
      throw new NotFoundException('There is no user with this username');

    return user;
  }

  async profile(user: JwtPayload): Promise<UserDocument> {
    const foundedUser = await this.findUserById(user._id);
    return foundedUser;
  }

  async delete(user: JwtPayload): Promise<DeleteReturnType> {
    const foundedUser = await this.findUserById(user._id);

    await foundedUser.remove();

    return { message: 'User successfully deleted' };
  }

  async update(
    user: JwtPayload,
    updateDto: UpdateDto,
  ): Promise<UpdateReturnType> {
    const foundedUser = await this.findUserById(user._id);

    await foundedUser.updateOne({ ...updateDto });

    return {
      message: 'User successfully updated',
    };
  }

  async changePassword(
    user: JwtPayload,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordReturnType> {
    const foundedUser = await this.findUserByIdWithPassword(user._id);

    const arePasswordsSame = await comparePasswords(
      changePasswordDto.oldPassword,
      foundedUser.password,
    );

    if (!arePasswordsSame)
      throw new UnauthorizedException('Your password is not correct');

    const password = await encodePassword(changePasswordDto.newPassword);

    await foundedUser.updateOne({ password });

    await foundedUser.save();

    return { message: 'Password successfully changed' };
  }
}
