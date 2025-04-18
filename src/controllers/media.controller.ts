import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import uploader from "../utils/uploader";
import response from "../utils/response";

export default {
  single: async (req: IReqUser, res: Response) => {
    /** 
     #swagger.tags = ['Media']
    */
    if (!req.file) {
      return response.error(res, new Error(), "file is not exists")
    }
    try {
      const result = await uploader.uploadSingle(req.file as Express.Multer.File)
      response.success(res, result, "success upload file")
    } catch (error) {
      response.error(res, error, "failed upload file")
    }
  },
  multiple: async (req: IReqUser, res: Response) => {
    /** 
     #swagger.tags = ['Media']
    */
    if (!req.files || req.files.length === 0) {
      return response.error(res, new Error(), "files are not exists")
    }
    try {
      const result = await uploader.uploadMultiple(req.files as Express.Multer.File[])
      response.success(res, result, "success upload files")
    } catch (error) {
      response.error(res, error, "failed upload files")
    }
  },
  remove: async (req: IReqUser, res: Response) => {
    /** 
     #swagger.tags = ['Media']
    */
    try {
      const { fileUrl } = req.body as { fileUrl: string }
      const result = await uploader.remove(fileUrl)
      response.success(res, result, "success remove file")
    } catch (error) {
      response.error(res, error, "failed remove file")
    }
  }
}
