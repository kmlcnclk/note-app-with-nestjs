import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { User, UserDocument } from '../mongoose/schemas/user.schema';
import { encodePassword, comparePasswords } from '../utils/bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';
import { JwtPayload } from './types/jwtPayload.type';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadWithRt } from './types';
import { LoginDto } from './dtos/login.dto';
import type {
  LoginReturnType,
  LogoutReturnType,
  RefreshReturnType,
  RegisterReturnType,
} from './types/authReturn.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // refresh token işleri hallet
  // login ekle user db de refresh token hallet
  // logout ekle

  async register(registerDto: RegisterDto): Promise<RegisterReturnType> {
    const password = encodePassword(registerDto.password);

    const newUser = new this.userModel({ ...registerDto, password });
    await newUser.save();

    const tokens = await this.getTokens(newUser._id, newUser.userName);

    newUser.refreshToken = await tokens.refreshToken;
    await newUser.save();

    return tokens;
  }

  async getTokens(userId: Types.ObjectId, userName: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      _id: userId,
      userName,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: this.config.get<string>('AT_EXPIRE_DATE'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: this.config.get<string>('RT_EXPIRE_DATE'),
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  logout(): LogoutReturnType {
    return { message: 'Logout is successful' };
  }

  async login(loginDto: LoginDto): Promise<LoginReturnType> {
    const user = await this.userModel
      .findOne({
        userName: loginDto.userName,
      })
      .select('+password +refreshToken');

    if (!user)
      throw new NotFoundException('There is no user with that username');

    const isPasswordsSame = await comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordsSame)
      throw new UnauthorizedException('Your password is not correct');

    const tokens = await this.getTokens(user._id, user.userName);

    user.refreshToken = await tokens.refreshToken;
    await user.save();

    return tokens;
  }

  async refresh(user: JwtPayloadWithRt): Promise<RefreshReturnType> {
    const isRefreshTokenAvailable = await this.validateRefreshToken(
      user['refreshToken'],
    );
    if (!isRefreshTokenAvailable)
      throw new ForbiddenException('Refresh token expired');

    const accessToken: any = await this.createNewAccessToken(
      user['_id'],
      user['refreshToken'],
    );

    return {
      ...accessToken,
    };
  }

  async refreshTokens(userId: Types.ObjectId, rt: string): Promise<Tokens> {
    const user = await this.userModel.findById(userId).select('+refreshToken');

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user._id, user.userName);

    return tokens;
  }

  async createNewAccessToken(
    userId: Types.ObjectId,
    rt: string,
  ): Promise<Tokens> {
    const user = await this.userModel.findById(userId).select('+refreshToken');

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    if (user.refreshToken != rt) throw new ForbiddenException('Access Denied');

    const newAccessToken = await this.getAccessToken(user._id, user.userName);

    return newAccessToken;
  }

  validateAccessToken(accessToken: string): any {
    return this.jwtService.verify(accessToken, {
      secret: this.config.get<string>('AT_SECRET'),
    });
  }

  validateRefreshToken(refreshToken: string): any {
    return this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>('RT_SECRET'),
    });
  }

  async getAccessToken(userId: Types.ObjectId, userName: string): Promise<any> {
    const jwtPayload: JwtPayload = {
      _id: userId,
      userName,
    };

    const at = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('AT_SECRET'),
      expiresIn: this.config.get<string>('AT_EXPIRE_DATE'),
    });

    return {
      accessToken: at,
    };
  }
}
