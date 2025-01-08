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
    },
    location: {
      type: String, // Địa chỉ hoặc vị trí rao bán
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
    followers: [],
    following: [],
    isBlocked: {
      type: Boolean,
      default: false, // Mặc định người dùng không bị chặn
    },
    blockExpires: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    soldItems: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
