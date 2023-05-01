import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../mongoose/schemas/user.schema';
import { UserController } from './user.controller';
import { IsEmailExistMiddleware } from '../auth/middleware/isEmailExist.middleware';
import { IsUsernameExistMiddleware } from '../auth/middleware/isUsernameExist.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [{ provide: 'USER_SERVICE', useClass: UserService }],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsEmailExistMiddleware, IsUsernameExistMiddleware)
      .forRoutes({ path: '/user/update', method: RequestMethod.PUT });
  }
}
