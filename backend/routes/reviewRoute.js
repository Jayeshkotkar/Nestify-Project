import express from "express";
import { addReview, removeReview, getReviews } from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/review/add
router.post("/add", auth, addReview);

// DELETE /api/review/remove/:id
router.delete("/remove/:id", auth, removeReview);

// GET /api/review/list/:listingId
router.get("/list/:listingId", getReviews);

export default router;