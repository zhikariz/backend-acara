import mongoose from "mongoose"
import * as Yup from "yup"

const Schema = mongoose.Schema

export const categoryDTO = Yup.object({
  name: Yup.string().required("category name is required"),
  description: Yup.string().required("category description is required"),
  icon: Yup.string().required("category icon is required"),
})

export type Category = Yup.InferType<typeof categoryDTO>

const CategorySchema = new Schema<Category>({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  icon: {
    type: Schema.Types.String,
    required: true,
  },
}, {
  timestamps: true,
})

const CategoryModel = mongoose.model("Category", CategorySchema)

export default CategoryModel

