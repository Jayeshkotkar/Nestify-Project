import mongoose, { Schema } from "mongoose";
import reviewModel from "./reviewModel.js";
import userModel from "./userModel.js";

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: {
       url: String,
       filename: String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
});

const listingModel = mongoose.models.listing || mongoose.model("listing", listingSchema);

export default listingModel;