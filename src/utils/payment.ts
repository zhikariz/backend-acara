import axios from "axios";
import { MIDTRANS_TRANSACTION_URL } from "./env";

export interface Payment {
  transaction_details: {
    order_id: string,
    gross_amount: number,
  }
}

export type TypeResponseMidtrans = {
  token: string;
  redirect_url: string;
}

export default {
  createLink: async (payload: Payment): Promise<TypeResponseMidtrans> => {
    const result = await axios.post<TypeResponseMidtrans>(
      `${MIDTRANS_TRANSACTION_URL}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`
        },
      }
    )

    if (result.status !== 201) {
      throw new Error("payment failed")
    }

    return result?.data
  }
}
