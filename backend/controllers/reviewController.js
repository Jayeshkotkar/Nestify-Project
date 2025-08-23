import reviewModel from "../models/reviewModel.js";
import listingModel from "../models/listingModel.js";

// POST /api/review/add
// body: { rating:number(1-5), comment:string, listingId:string }
const addReview = async (req, res) => {
  try {
    const { rating, comment, listingId } = req.body || {};
    if (!listingId) {
      return res.status(400).json({ success: false, message: "listingId is required" });
    }
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }
    if (!comment || !String(comment).trim()) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const review = await new reviewModel({
      rating: Number(rating),
      comment: String(comment).trim(),
      author: req.userId,
    });
    await review.save();

    // attach to listing via atomic update to avoid full document validation errors
    const updated = await listingModel.findByIdAndUpdate(
      listingId,
      { $push: { reviews: review._id } },
      { new: true, runValidators: false }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    console.log("Review added and linked to listing", { reviewId: review._id, listingId });

    return res.status(201).json({ success: true, message: "Review added", data: review });
  } catch (err) {
    console.error("addReview error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

// DELETE /api/review/remove/:id
const removeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await reviewModel.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (String(review.author) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this review" });
    }
    // pull from any listing containing this review
    await listingModel.updateMany({ reviews: review._id }, { $pull: { reviews: review._id } });
    await review.deleteOne();
    return res.json({ success: true, message: "Review removed" });
  } catch (err) {
    console.error("removeReview error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to remove review" });
  }
};

// GET /api/review/list/:listingId
const getReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await listingModel
      .findById(listingId)
      .populate({
        path: "reviews",
        populate: { path: "author", select: "name email" },
        options: { sort: { createdAt: -1 } },
      });
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    return res.json({ success: true, data: listing.reviews || [] });
  } catch (err) {
    console.error("getReviews error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

export { addReview, removeReview, getReviews };