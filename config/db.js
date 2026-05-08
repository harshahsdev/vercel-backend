import { connect } from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("Missing MONGO_URI environment variable. Set it in Render service settings.");
        process.exit(1);
    }

    try {
        await connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};
export default connectDB;