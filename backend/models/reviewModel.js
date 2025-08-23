import mongoose, { Schema } from "mongoose";
import userModel from "./userModel.js";

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "user",
    },
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;