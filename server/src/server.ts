import "dotenv/config";
import express, { Express } from "express";
import { connectDb } from "./db/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import quizRouter from "./routes/quizRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import roomRouter from "./routes/roomRoutes.js";

const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/room", roomRouter)

app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
