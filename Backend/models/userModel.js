import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    //accountId can be google Id, facebook Id, github Id etc.
    accountId: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    location: {
      type: String, // Địa chỉ hoặc vị trí rao bán
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"], // Phân quyền người dùng
      default: "buyer",
    },
    profilePic: {
      type: String,
      default: "",
    },
    connect: [],
    isBlocked: {
      type: Boolean,
      default: false, // Mặc định người dùng không bị chặn
    },
    blockExpires: { type: Date },
    provider: {
      type: String,
    },
    loginAttempts: { type: Number, default: 0 },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
