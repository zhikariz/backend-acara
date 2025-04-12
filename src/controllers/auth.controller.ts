import * as Yup from "yup"
import UserModel from "../models/user.model"
import { encrypt } from "../utils/encryption"
import { generateToken, type IUserToken } from "../utils/jwt"
import type { IReqUser } from "../middlewares/auth.middleware"
import type { Request, Response } from "express"

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
  password: Yup.string().required()
    .min(6, "Password must be at least 6 characters")
    .test(
      "at-least-one-uppercase-letter",
      "Contains at least one uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/
        return regex.test(value)
      })
    .test(
      "at-least-one-number",
      "Contains at least one number",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/
        return regex.test(value)
      }),
  confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password doesn't match"),
})

export default {
  register: async (req: Request, res: Response) => {
    /** 
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
       required: true, 
       schema: { $ref: "#/components/schemas/RegisterRequest" }
     }
    */
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
  },
  login: async (req: Request, res: Response) => {
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true, 
        schema: { $ref: "#/components/schemas/LoginRequest" }
      }
    */
    const { identifier, password } = req.body as unknown as TLogin
    try {
      const userByIdentifier = await UserModel.findOne({
        $or: [
          { username: identifier },
          { email: identifier }
        ],
        isActive: true
      })
      if (!userByIdentifier) {
        return res.status(403).json({
          message: "user not found or maybe not active",
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
  },

  me: async (req: IReqUser, res: Response) => {
    /**
      #swagger.tags = ['Auth']
      #swagger.security = [{
        "bearerAuth": []
      }]
    */
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
  },
  activation: async (req: Request, res: Response) => {
    /**
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
      required: true,
      schema: { $ref: "#/components/schemas/ActivationRequest" }
      }
    */
    try {
      const { code } = req.body as { code: string }

      const user = await UserModel.findOneAndUpdate({ activationCode: code }, { isActive: true, }, { new: true })

      res.status(200).json({
        message: "user successfully activated",
        data: user
      })

    } catch (error) {
      const err = error as unknown as Error
      return res.status(400).json({
        message: err.message,
        data: null
      })
    }

  }
}
