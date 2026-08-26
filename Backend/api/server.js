import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "node:dns";

const app = express();
dns.setServers(["8.8.8.8", "1.1.1.1"]);
mongoose.set("strictQuery", true);

const connect = async () => {
  await mongoose.connect(process.env.MONGO);
  console.log("Connected to mongoDB!");
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from any origin or localhost/Vercel URLs
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({ message: errorMessage });
});

const PORT = process.env.PORT || 8800;

const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => console.log(`Backend server is running on port ${PORT}!`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

start();
