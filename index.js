import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./routes/auth.route.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


connectToDB().catch((err) => console.log(err));
async function connectToDB() {
  await mongoose.connect(process.env.MONGO);
  console.log("Database Connected!");
}

app.use("/user/", userRouter);

app.listen(3000, () => {
  console.log("listing from port 3000");
});

// ======app middleware ========//
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
