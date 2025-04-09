import * as Yup from "yup"
import UserModel from "../models/user.model"
import { encrypt } from "../utils/encryption"
import { generateToken, type IUserToken } from "../utils/jwt"
import type { IReqUser } from "../middlewares/auth.middleware"
import type { Response } from "express"

type TRegister = {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

type TLogin = {
  identifier: string,
  password: string
}

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password doesn't match"),
})

const register = async (req: any, res: any) => {
  const { fullName, username, email, password, confirmPassword } = req.body as unknown as TRegister

  try {
    await registerValidateSchema.validate({
      fullName,
      username,
      email,
      password,
      confirmPassword,
    })

    const result = await UserModel.create({
      fullName,
      username,
      email,
      password
    })
    res.status(200).json({
      message: "Success Registration User", data: result
    })
  } catch (error) {
    const err = error as unknown as Error
    return res.status(400).json({
      message: err.message,
      data: null
    })
  }

  res.json({ fullName, username, email, password, confirmPassword })
}

const login = async (req: any, res: any) => {
  const { identifier, password } = req.body as unknown as TLogin
  try {
    const userByIdentifier = await UserModel.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    })
    if (!userByIdentifier) {
      return res.status(403).json({
        message: "User not found",
        data: null
      })
    }

    const validatePassword: boolean = encrypt(password) === userByIdentifier.password

    if (!validatePassword) {
      return res.status(403).json({
        message: "username or password is wrong",
        data: null
      })
    }

    const token = generateToken({
      id: userByIdentifier._id,
      role: userByIdentifier.role
    } as IUserToken)

    res.status(200).json({
      message: "Success Login User",
      data: token
    })
  } catch (error) {
    const err = error as unknown as Error
    return res.status(400).json({
      message: err.message,
      data: null
    })
  }
}

const me = async (req: IReqUser, res: any) => {
  try {
    const user = req.user

    const result = await UserModel.findById(user?.id)

    res.status(200).json({
      message: "Success Get User",
      data: result
    })
  } catch (error) {
    const err = error as unknown as Error
    return res.status(400).json({
      message: err.message,
      data: null
    })
  }
}

export default {
  register,
  login,
  me
}
