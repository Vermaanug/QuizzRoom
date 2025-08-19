import 'dotenv/config';
import express from 'express';
import ConnectDB from "./db/ConnectDb.js";
import authRouter from "./route/auth.route.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRouter)


ConnectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
});