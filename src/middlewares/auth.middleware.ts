import type { NextFunction, Request, Response } from "express";
import { getUserData, type IUserToken } from "../utils/jwt";

export interface IReqUser extends Request {
  user?: IUserToken
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization

  if (!authorization) {
    return res.status(401).json({
      message: "Unauthorized",
      data: null
    })
  }

  const [prefix, accessToken] = authorization.split(" ")

  if (!(prefix === "Bearer" && accessToken)) {
    return res.status(401).json({
      message: "Unauthorized",
      data: null
    })
  }

  const user = getUserData(accessToken)

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
      data: null
    })
  }

  (req as IReqUser).user = user
  next()
} 
