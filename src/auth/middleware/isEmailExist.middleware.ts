import {
  BadRequestException,
  NestMiddleware,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class IsEmailExistMiddleware implements NestMiddleware {
  constructor(@Inject('USER_SERVICE') readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const isEmailExist = await this.userService.isEmailExist(email);

    if (isEmailExist)
      throw new BadRequestException('This email is already available');
    next();
  }
}
