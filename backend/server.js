import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import listingRouter from "./routes/listingRoute.js";
import userRouter from "./routes/userRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config({ quiet: true });
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

app.use("/api/listing", listingRouter);
// Resolve absolute path to ensure static serving works regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/review", reviewRouter);

app.get("/", (req, res) => {
    res.send("Hello World! how are you?");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
