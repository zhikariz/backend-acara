import * as Yup from "yup"
import payment, { TypeResponseMidtrans } from "../utils/payment"
import mongoose, { ObjectId, Schema } from "mongoose"
import { USER_MODEL_NAME } from "./user.model"
import { EVENT_MODEL_NAME } from "./event.model"
import { TICKET_MODEL_NAME } from "./ticket.model"
import { getId } from "../utils/id"

export const ORDER_MODEL_NAME = "Order"

export const orderDAO = Yup.object({
  createdBy: Yup.string().required("order created by is required"),
  events: Yup.string().required("order event is required"),
  ticket: Yup.string().required("order ticket is required"),
  quantity: Yup.number().required("order quantity is required"),
})

export type TypeOrder = Yup.InferType<typeof orderDAO>

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type TypeVoucher = {
  voucherId: string
  isPrint: boolean
}

export interface Order extends Omit<TypeOrder, "createdBy" | "events" | "ticket"> {
  total: number;
  status: string;
  payment: TypeResponseMidtrans;
  createdBy: ObjectId
  events: ObjectId
  orderId: string;
  ticket: ObjectId
  quantity: number
  vouchers: TypeVoucher[]
}

const OrderSchema = new Schema<Order>({
  orderId: {
    type: Schema.Types.String,
  },
  total: {
    type: Schema.Types.Number,
    required: true,
  },
  status: {
    type: Schema.Types.String,
    enum: [OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    default: OrderStatus.PENDING,
  },
  payment: {
    type: {
      token: {
        type: Schema.Types.String,
        required: true,
      },
      redirect_url: {
        type: Schema.Types.String,
        required: true,
      }
    },
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: USER_MODEL_NAME,
  },
  events: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: EVENT_MODEL_NAME
  },
  ticket: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: TICKET_MODEL_NAME,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
  },
  vouchers: {
    type: [
      {
        voucherId: {
          type: Schema.Types.String,
        },
        isPrint: {
          type: Schema.Types.Boolean,
          default: false
        }
      }
    ]
  }
}, {
  timestamps: true
}).index({ orderId: "text" })

OrderSchema.pre("save", async function () {
  const order = this
  order.orderId = getId()
  order.payment = await payment.createLink({
    transaction_details: {
      order_id: order.orderId,
      gross_amount: order.total,
    },
  })
})

const OrderModel = mongoose.model(ORDER_MODEL_NAME, OrderSchema)

export default OrderModel
