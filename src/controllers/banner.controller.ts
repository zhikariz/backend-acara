import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import BannerModel, { bannerDAO, TypeBanner } from "../models/banner.model";
import { FilterQuery } from "mongoose";


export default {
  create: async (req: IReqUser, res: Response) => {
    try {
      await bannerDAO.validate(req.body, { abortEarly: false })

      const result = await BannerModel.create(req.body)
      response.success(res, result, "success create a banner")
    } catch (error) {
      response.error(res, error, "failed to create a banner")
    }
  },
  findAll: async (req: IReqUser, res: Response) => {
    try {

      const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery

      const query: FilterQuery<TypeBanner> = {}

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search
          }
        })
      }

      const result = await BannerModel
        .find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec()

      const count = await BannerModel.countDocuments(query)

      response.pagination(res, result, {
        current: page,
        total: count,
        totalPages: Math.ceil(count / limit)
      }, "success to get all banner")
    } catch (error) {
      response.error(res, error, "failed to find all banner")
    }
  },
  findOne: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      const result = await BannerModel.findById(id)
      response.success(res, result, "success to find a banner")
    } catch (error) {
      response.error(res, error, "failed to find a banner")
    }
  },
  update: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      const result = await BannerModel.findByIdAndUpdate(id, req.body, { new: true })
      response.success(res, result, "success to update a banner")
    } catch (error) {
      response.error(res, error, "failed to update a banner")
    }
  },
  remove: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      const result = await BannerModel.findByIdAndDelete(id, { new: true })
      response.success(res, result, "success to remove a banner")
    } catch (error) {
      response.error(res, error, "failed to remove a banner")
    }
  },
}
