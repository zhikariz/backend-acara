import mongoose, { Schema } from "mongoose"
import * as Yup from "yup"
import { EVENT_MODEL_NAME } from "./event.model"


export const TICKET_MODEL_NAME = "Ticket"

export const ticketDAO = Yup.object({
  price: Yup.number().required("ticket price is required"),
  name: Yup.string().required("ticket name is required"),
  events: Yup.string().required("ticket events is required"),
  description: Yup.string().required("ticket description is required"),
  quantity: Yup.number().required("ticket quantity is required"),
})

export type TypeTicket = Yup.InferType<typeof ticketDAO>

interface Ticket extends Omit<TypeTicket, "events"> {
  events: Schema.Types.ObjectId;
}

const TicketSchema = new Schema<Ticket>({
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  name: {
    type: Schema.Types.String,
    required: true,
  },
  events: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: EVENT_MODEL_NAME,
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
  }
}, {
  timestamps: true
})

TicketSchema.index({
  name: 'text',
  description: 'text',
})

const TicketModel = mongoose.model(TICKET_MODEL_NAME, TicketSchema)

export default TicketModel

