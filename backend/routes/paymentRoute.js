import express from "express";
import { createPayment } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/", auth, createPayment);

export default paymentRouter;
