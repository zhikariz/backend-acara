import type { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { TokenExpiredError } from "jsonwebtoken";


export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization

  if (!authorization) {
    return response.unauthorized(res)
  }

  const [prefix, accessToken] = authorization.split(" ")

  if (!(prefix === "Bearer" && accessToken)) {
    return response.unauthorized(res)
  }

  try {
    const user = getUserData(accessToken)

    if (!user) {
      return response.unauthorized(res)
    }

    (req as IReqUser).user = user
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return response.unauthorized(res, "Token has expired");
    }

    return response.unauthorized(res, "Invalid token");
  }
} 
