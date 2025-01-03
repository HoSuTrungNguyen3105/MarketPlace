import bodyparser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyparser.json({ limit: "20mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "20mb", extended: true }));
dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port`, port);
  });
});
