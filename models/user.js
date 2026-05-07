import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique : true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  subscription: {
  type: {
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free"
    },
    expiresAt: Date
  },
  default: { plan: "free" }
}
})
const User = mongoose.model("Users", userSchema);

export default User;