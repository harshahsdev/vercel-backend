import { connect } from "mongoose";

const connectDB = async () =>{
    try{
        await connect(process.env.MONGO_URI);
        console.log("MOngoDB connected");
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};
export default connectDB;