import type { Types } from "mongoose"
import jwt from "jsonwebtoken"
import { SECRET } from "./env"
import type { User } from "../models/user.model"

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

export const generateToken = (user: IUserToken) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h"
  })

  return token
}

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken
  return user
}
