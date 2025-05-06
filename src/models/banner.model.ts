import mongoose, { Schema } from "mongoose"
import * as Yup from "yup"

export const BANNER_MODEL_NAME = "Banner"

export const bannerDAO = Yup.object({
  title: Yup.string().required("banner title is required"),
  image: Yup.string().required("banner image is required"),
  isShow: Yup.boolean().required("banner is show is required"),
})

export type TypeBanner = Yup.InferType<typeof bannerDAO>

interface Banner extends TypeBanner { }

const BannerSchema = new Schema<Banner>({
  title: {
    type: Schema.Types.String,
    required: true,
  },
  image: {
    type: Schema.Types.String,
    required: true,
  },
  isShow: {
    type: Schema.Types.Boolean,
    required: true,
  },
}, {
  timestamps: true
})

BannerSchema.index({
  title: "text",
})

const BannerModel = mongoose.model(BANNER_MODEL_NAME, BannerSchema)

export default BannerModel
