import "dotenv/config";
import express from "express";
import ConnectDB from "./db/ConnectDb.js";
import authRouter from "./route/auth.route.js";
import contestRouter from "./route/contest.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/contest", contestRouter);

app.use(notFound);
app.use(errorHandler);

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
