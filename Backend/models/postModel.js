import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js"; // Đường dẫn tới cấu hình Sequelize

class Post extends Model {}

Post.init(
  {
    image: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
    published: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize, // Tham chiếu tới instance của Sequelize
    modelName: "Post",
    timestamps: true, // Tự động tạo `createdAt` và `updatedAt`
  }
);
export default Post;
