import { DataTypes, Sequelize } from "sequelize";
import mysqlpool from "../config/db.js"; // Đường dẫn tới cấu hình Sequelize

class User extends Model {}

User.init(
  {
    accountId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("buyer", "seller", "admin"),
      defaultValue: "buyer",
    },
    profilePic: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    blockExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    soldItems: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    activeListings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    responseRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationCodeExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize, // Tham chiếu tới instance của Sequelize
    modelName: "User",
    timestamps: true, // Tự động tạo `createdAt` và `updatedAt`
  }
);

export default User;
