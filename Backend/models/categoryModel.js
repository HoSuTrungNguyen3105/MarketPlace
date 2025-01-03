import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "", // Mô tả thêm về danh mục
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId, // Danh mục cha (nếu có)
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;
