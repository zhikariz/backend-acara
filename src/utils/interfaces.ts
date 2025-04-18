import { Types } from "mongoose"
import { User } from "../models/user.model"
import { Request } from "express"

export interface IReqUser extends Request {
  user?: IUserToken
}

export interface IUserToken extends Omit<User,
  | "password"
  | "activationCode"
  | "email"
  | "fullName"
  | "profilePicture"
  | "username"> {
  id?: Types.ObjectId
  role: string
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}
