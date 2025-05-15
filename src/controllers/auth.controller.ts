import * as Yup from "yup";
import UserModel, { userDTO, UserLoginDTO, userUpdatePasswordDTO } from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import type { Request, Response } from "express";
import { IReqUser, IUserToken } from "../utils/interfaces";
import response from "../utils/response";

export default {
  updateProfile: async (req: IReqUser, res: Response) => {
    try {
      const userId = req.user?.id
      const { fullName, profilePicture } = req.body

      const result = await UserModel.findByIdAndUpdate(userId, {
        fullName,
        profilePicture

      }, { new: true })

      if (!result) return response.notFound(res, "failed update profile")
      response.success(res, result, "success update profile")
    } catch (error) {
      response.error(res, error, "failed update profile")
    }
  },
  updatePassword: async (req: IReqUser, res: Response) => {
    try {
      const userId = req.user?.id
      const { oldPassword, password, confirmPassword } = req.body
      await userUpdatePasswordDTO.validate(
        {
          oldPassword,
          password,
          confirmPassword
        }
      )

      const user = await UserModel.findById(userId)

      if (!user || user.password !== encrypt(oldPassword)) response.notFound(res, "user not found")

      const result = await UserModel.findByIdAndUpdate(userId, {
        password
      }, { new: true })

      if (!result) return response.notFound(res, "failed update password")

      response.success(res, result, "success update password")
    } catch (error) {
      response.error(res, error, "failed update password")
    }
  },
  register: async (req: Request, res: Response) => {
    const { fullName, username, email, password, confirmPassword } = req.body;

    try {
      await userDTO.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });
      response.success(res, result, "success registration user");
    } catch (error) {
      const err = error as unknown as Error;
      return response.error(res, err, "failed registration user");
    }

    response.success(
      res,
      { fullName, username, email, password, confirmPassword },
      "success registration user"
    );
  },
  login: async (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    try {
      await UserLoginDTO.validate({
        identifier, password
      })
      const userByIdentifier = await UserModel.findOne({
        $or: [{ username: identifier }, { email: identifier }],
        isActive: true,
      });
      if (!userByIdentifier) {
        return response.forbidden(res, "user not found or maybe not active");
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.forbidden(res, "username or password is wrong");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      } as IUserToken);

      response.success(res, token, "success login user");
    } catch (error) {
      const err = error as unknown as Error;
      return response.error(res, err, "failed login user");
    }
  },
  me: async (req: IReqUser, res: Response) => {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);
      response.success(res, result, "success get user");
    } catch (error) {
      const err = error as unknown as Error;
      return response.error(res, err, "failed get user");
    }
  },
  activation: async (req: Request, res: Response) => {
    try {
      const { code } = req.body as { code: string };

      const user = await UserModel.findOneAndUpdate(
        { activationCode: code },
        { isActive: true },
        { new: true }
      );

      response.success(res, user, "user successfully activated");
    } catch (error) {
      const err = error as unknown as Error;
      return response.error(res, err, "failed activation user");
    }
  },
};
