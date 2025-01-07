import bodyparser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import PostRoute from "./routes/PostRoute.js";
import MessageRoute from "./routes/MessageRoute.js";

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyparser.json({ limit: "20mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "20mb", extended: true }));
dotenv.config();

app.use(cookieParser());
app.use(express.json());
// Cors configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// Route mặc định
app.get("/", (req, res) => {
  res.send("Đang chạy"); // Hiển thị "Đang chạy"
});
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port`, port);
  });
});
// Routes
app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/post", PostRoute);
app.use("/api/message", MessageRoute);
