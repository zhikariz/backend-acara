import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, { orderDAO, OrderStatus, TypeOrder, TypeVoucher } from "../models/order.model";
import TicketModel from "../models/ticket.model";
import { FilterQuery } from "mongoose";
import { getId } from "../utils/id";

export default {
  create: async (req: IReqUser, res: Response) => {
    try {
      const userId = req.user?.id
      const payload = {
        ...req.body,
        createdBy: userId
      } as TypeOrder

      await orderDAO.validate(payload, { abortEarly: false })

      const ticket = await TicketModel.findById(payload.ticket)

      if (!ticket) return response.notFound(res, "ticket not found")

      if (ticket.quantity < payload.quantity) return response.error(res, null, "ticket quantity is not enough")

      const total: number = +ticket?.price * +payload.quantity

      Object.assign({
        ...payload,
        total
      })

      const result = await OrderModel.create(payload)

      response.success(res, result, "success to create an order")
    } catch (error) {
      response.error(res, error, "failed to create an order")
    }
  },
  findAll: async (req: IReqUser, res: Response) => {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeOrder> = {}
        if (filter.search) query.$text = { $search: filter.search }
        return query
      }

      const { limit = 10, page = 1, search } = req.query

      const query = buildQuery({ search })


      const result = await OrderModel
        .find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec()

      const count = await OrderModel.countDocuments(query)

      response.pagination(res, result, {
        current: +page,
        total: count,
        totalPages: Math.ceil(count / +limit)
      }, "success find all orders")
    } catch (error) {
      response.error(res, error, "failed find all orders")
    }
  },
  findOne: async (req: IReqUser, res: Response) => {
    try {
      const { orderId } = req.params
      const result = await OrderModel.findById({
        orderId,
      })

      if (!result) return response.notFound(res, "order not found")

      response.success(res, result, "success to find an order")
    } catch (error) {
      response.error(res, error, "failed to find an order")
    }
  },
  findAllByMember: async (req: IReqUser, res: Response) => {

  },
  complete: async (req: IReqUser, res: Response) => {
    try {
      const { orderId } = req.params
      const userId = req.user?.id
      const order = await OrderModel.findById({ orderId, createdBy: userId })
      if (!order) return response.notFound(res, "order not found")
      if (order.status === OrderStatus.COMPLETED) return response.error(res, null, "you have been completed this order")
      const vouchers: TypeVoucher[] = Array.from({ length: order.quantity }, () => {
        return {
          isPrint: false,
          voucherId: getId()
        } as TypeVoucher
      })
      const result = await OrderModel.findOneAndUpdate({
        orderId,
        createdBy: userId
      }, {
        vouchers,
        status: OrderStatus.COMPLETED
      }, { new: true })

      const ticket = await TicketModel.findById(order.ticket)

      if (!ticket) return response.notFound(res, "ticket and order not found")

      await TicketModel.updateOne({
        _id: ticket._id
      }, {
        quantity: ticket.quantity - order.quantity
      })

      response.success(res, result, "success to complete an order")
    } catch (error) {
      response.error(res, error, "failed to complete an order")
    }
  },
  pending: async (req: IReqUser, res: Response) => {
    try {

    } catch (error) {
      response.error(res, error, "failed to pending an order")
    }
  },
  cancelled: async (req: IReqUser, res: Response) => {
    try {

    } catch (error) {
      response.error(res, error, "failed to cancelled an order")
    }
  },
}
