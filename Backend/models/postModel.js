import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    geoLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    images: {
      type: [String],
      default: [],
    },
    contact: {
      type: String,
    },
    condition: {
      type: String,
      enum: ["new", "used"],
      default: "used",
    },
    sellerRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    reports: {
      type: [
        {
          reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          reportedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    // Bổ sung các fields động theo từng danh mục
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}, // Dữ liệu động cho từng danh mục
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("MarketplacePost", postSchema);

export default PostModel;
