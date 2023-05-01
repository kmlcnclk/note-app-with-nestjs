import {
  BadRequestException,
  NestMiddleware,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class IsUsernameExistMiddleware implements NestMiddleware {
  constructor(@Inject('USER_SERVICE') readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userName } = req.body;
    const isUserNameExist = await this.userService.isUserNameExist(userName);

    if (isUserNameExist)
      throw new BadRequestException('This userName is already available');
    next();
  }
}
