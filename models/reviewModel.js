import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required : true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model("Review", reviewSchema);