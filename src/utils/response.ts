import { Response } from "express"
import * as Yup from "yup"

type Pagination = {
  totalPages: number,
  current: number,
  total: number
}

export default {
  success: (res: Response, data: any, message: string) => {
    res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data
    })
  },
  error: (res: Response, error: unknown, message: string) => {
    if (error instanceof Yup.ValidationError) {
      const errors: Record<string, string[]> = {};

      // If error.inner is empty, fallback to error.message and error.path
      if (error.inner && error.inner.length > 0) {
        error.inner.forEach((e) => {
          const path = e.path ?? "form"; // fallback to "form" if path is missing

          if (!errors[path]) {
            errors[path] = [];
          }

          errors[path].push(e.message);
        });
      } else if (error.path) {
        errors[error.path] = [error.message];
      } else {
        errors["form"] = [error.message];
      }

      return res.status(400).json({
        meta: {
          status: 400,
          message,
        },
        data: errors,
      });
    }

    return res.status(500).json({
      meta: {
        status: 500,
        message,
      },
      data: error,
    })
  },
  unauthorized: (res: Response, message: string = "unauthorized") => {
    res.status(401).json({
      meta: {
        status: 401,
        message
      },
      data: null
    })
  },
  forbidden: (res: Response, message: string = "forbidden") => {
    res.status(403).json({
      meta: {
        status: 403,
        message
      },
      data: null,
    })
  },
  pagination: (res: Response, data: any[], pagination: Pagination, message: string) => {
    res.status(200).json({
      meta: {
        status: 200,
        message
      },
      data,
      pagination
    })
  }

}


