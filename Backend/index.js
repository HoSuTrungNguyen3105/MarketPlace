import bodyparser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import postRoute from "./routes/PostRoute.js";
import sequelize from "./config/db.js";
import router from "./routes/PostRoute.js";

const app = express();
const port = 8080;
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
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
// Route mặc định
app.get("/", (req, res) => {
  res.send("Đang chạy"); // Hiển thị "Đang chạy"
});
// Routes
app.use("/api/post", postRoute);
