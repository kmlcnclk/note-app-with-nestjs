import { Types } from 'mongoose';

export type JwtPayload = {
  _id: Types.ObjectId;
  userName: string;
};
