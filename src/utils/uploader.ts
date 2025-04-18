import { v2 as cloudinary } from "cloudinary"
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./env"


cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

const toDataUrl = (file: Express.Multer.File) => {
  const base64File = Buffer.from(file.buffer).toString("base64")
  const dataURL = `data:${file.mimetype};base64,${base64File}`
  return dataURL
}

const getPublicIdFromFileURL = (fileUrl: string) => {
  const fileNameUsingSubstring = fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
  const publicId = fileNameUsingSubstring.substring(0, fileNameUsingSubstring.lastIndexOf("."))
  return publicId
}

export default {
  uploadSingle: async (file: Express.Multer.File) => {
    const fileDataUrl = toDataUrl(file)
    const result = await cloudinary.uploader.upload(fileDataUrl, {
      resource_type: "auto"
    })
    return result
  },
  async uploadMultiple(files: Express.Multer.File[]) {
    const uploadBatch = files.map((item) => {
      const result = this.uploadSingle(item)
      return result
    })
    const result = await Promise.all(uploadBatch)
    return result
  },
  remove: async (fileUrl: string) => {
    const publicId = getPublicIdFromFileURL(fileUrl)
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  }
}
