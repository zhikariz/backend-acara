import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import { Response } from "express";
import response from "../utils/response";
import TicketModel, { ticketDTO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  create: async (req: IReqUser, res: Response) => {
    try {
      await ticketDTO.validate(req.body, { abortEarly: false })

      const result = await TicketModel.create(req.body)
      response.success(res, result, "success create a ticket")
    } catch (error) {
      response.error(res, error, "failed create a ticket")
    }
  },
  findAll: async (req: IReqUser, res: Response) => {
    try {
      const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery

      const query: FilterQuery<TypeTicket> = {}

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search
          }
        })
      }

      const result = await TicketModel
        .find(query)
        .populate("events")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec()

      const count = await TicketModel.countDocuments(query)

      response.pagination(res, result, {
        current: page,
        total: count,
        totalPages: Math.ceil(count / limit)
      }, "success to get all tickets")

    } catch (error) {
      response.error(res, error, "failed to get all tickets")
    }
  },
  findOne: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      if (!isValidObjectId(id)) return response.notFound(res, "failed to find a ticket")
      const result = await TicketModel.findById(id)
      if (!result) return response.notFound(res, "failed to find a ticket")
      response.success(res, result, "success to find a ticket")
    } catch (error) {
      response.error(res, error, "failed to find a ticket")
    }
  },
  update: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      if (!isValidObjectId(id)) return response.notFound(res, "failed to find a ticket")
      const result = await TicketModel.findByIdAndUpdate(id, req.body, { new: true })
      response.success(res, result, "success to update a ticket")
    } catch (error) {
      response.error(res, error, "failed to update a ticket")
    }
  },
  remove: async (req: IReqUser, res: Response) => {
    try {
      const { id } = req.params
      if (!isValidObjectId(id)) return response.notFound(res, "failed to find a ticket")
      const result = await TicketModel.findByIdAndDelete(id, { new: true })
      response.success(res, result, "success to remove a ticket")
    } catch (error) {
      response.error(res, error, "failed to remove a ticket")
    }
  },
  findAllByEvent: async (req: IReqUser, res: Response) => {
    try {
      const { eventId } = req.params
      if (!isValidObjectId(eventId)) return response.notFound(res, "failed to find ticket by event")
      const result = await TicketModel.find({ events: eventId })
      response.success(res, result, "success to find ticket by event")
    } catch (error) {
      response.error(res, error, "failed to find ticket by event")
    }
  },
}
