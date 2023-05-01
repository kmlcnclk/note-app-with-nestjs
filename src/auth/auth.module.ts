import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../mongoose/schemas/user.schema';
import { IsEmailExistMiddleware } from './middleware/isEmailExist.middleware';
import { JwtModule } from '@nestjs/jwt';
import { IsUsernameExistMiddleware } from './middleware/isUsernameExist.middleware';
import { UserService } from '../user/user.service';
import { RefreshTokenStrategy } from '../strategies/refreshToken.strategy';
import { AccessTokenStrategy } from '../strategies/accessToken.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.AT_EXPIRE_DATE },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    { provide: 'USER_SERVICE', useClass: UserService },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsEmailExistMiddleware, IsUsernameExistMiddleware)
      .forRoutes({ path: '/auth/register', method: RequestMethod.POST });
  }
}
