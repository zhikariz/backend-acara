import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel, { eventDAO, TEvent } from "../models/event.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  create: async (req: IReqUser, res: Response) => {
    try {
      const payload = { ...req.body, createdBy: req.user?.id } as TEvent
      await eventDAO.validate(payload, { abortEarly: false })
      const result = await EventModel.create(payload)
      response.success(res, result, "success to create an event")
    } catch (error) {
      response.error(res, error, "failed to create an event")
    }
  },
  findAll: async (req: IReqUser, res: Response) => {
    try {
      const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery

      const query: FilterQuery<TEvent> = {}

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search
          }
        })
      }

      const result = await EventModel
        .find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec()

      const count = await EventModel.countDocuments(query)

      response.pagination(res, result, {
        current: page,
        total: count,
        totalPages: Math.ceil(count / limit)
      }, "success to get all events")

    } catch (error) {
      response.error(res, error, "failed to get all events")
    }
  },
  findOne: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      if (!isValidObjectId(id)) return response.notFound(res, "failed to find an event")
      const result = await EventModel.findById(id)
      if (!result) return response.notFound(res, "failed to find an event")
      response.success(res, result, "success to get an event")
    } catch (error) {
      response.error(res, error, "failed to get an event")
    }
  },
  update: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      if (!isValidObjectId(id)) return response.notFound(res, "failed to find an event")
      const result = await EventModel.findByIdAndUpdate(id, req.body, { new: true })
      response.success(res, result, "success to update an event")
    } catch (error) {
      response.error(res, error, "failed to update an event")
    }
  },
  remove: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      if (!isValidObjectId(id)) return response.notFound(res, "failed to find an event")
      const result = await EventModel.findByIdAndDelete(id, { new: true })
      response.success(res, result, "success to delete an event")
    } catch (error) {
      response.error(res, error, "failed to delete an event")
    }
  },
  findOneBySlug: async (req: IReqUser, res: Response) => {
    try {
      const { slug } = req.params
      const result = await EventModel.findOne({ slug })
      response.success(res, result, "success to get an event by slug")
    } catch (error) {
      response.error(res, error, "failed to get an event by slug")
    }
  },
}
