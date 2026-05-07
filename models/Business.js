import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    name: {type: String, required:true, trim: true},
    slug: {type: String, required:true, unique: true},
    category: {type: String, required:true},
    phone: {type: String, match: /^[0-9]{10}$/},
    location: {type: String, required:true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required:true},
    isPremium: {type: Boolean, default: false},
    whatsapp: {type: String},
    address: {type: String},
    description: {type: String},
    services: [String],
    images: { type: [String], default: [] },
    isFeatured: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    geoLocation: {
        type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        required: true
    }
}
});
businessSchema.index({ geoLocation: "2dsphere" });
export default mongoose.model("Business", businessSchema);