import * as Yup from "yup"
import UserModel from "../models/user.model"
import { encrypt } from "../utils/encryption"
import { generateToken } from "../utils/jwt"
import type { Request, Response } from "express"
import { IReqUser, IUserToken } from "../utils/interfaces"
import response from "../utils/response"

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
      response.success(res, result, "success registration user")
    } catch (error) {
      const err = error as unknown as Error
      return response.error(res, err, "failed registration user")
    }

    response.success(res, { fullName, username, email, password, confirmPassword }, "success registration user")
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
        return response.forbidden(res, "user not found or maybe not active")
      }

      const validatePassword: boolean = encrypt(password) === userByIdentifier.password

      if (!validatePassword) {
        return response.forbidden(res, "username or password is wrong")
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role
      } as IUserToken)

      response.success(res, token, "success login user")
    } catch (error) {
      const err = error as unknown as Error
      return response.error(res, err, "failed login user")
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

      response.success(res, result, "success get user")
    } catch (error) {
      const err = error as unknown as Error
      return response.error(res, err, "failed get user")
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

      response.success(res, user, "user successfully activated")
    } catch (error) {
      const err = error as unknown as Error
      return response.error(res, err, "failed activation user")
    }
  }
}
