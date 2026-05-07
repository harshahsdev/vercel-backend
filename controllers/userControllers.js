
import dotenv from 'dotenv';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRET_CODE = process.env.JWT_SECRET;

export const createJWTToken = (user) => {
    const token = jwt.sign({
        userID: user._id,
        email: user.email,
        role: user.role,
        subscription: user.subscription
    }, SECRET_CODE, { expiresIn: "1h" })
    return token;
}

export const createRefresh = (user) => {
    const token = jwt.sign({
        userID: user._id,
        email: user.email,
        role: user.role,
        subscription: user.subscription
    }, SECRET_CODE, { expiresIn: "20h" })
    return token;
}
export const handleRegister = async (req, res) => {
    try {
        const body = req.body;
        console.log("Register request body:", body);
        if (body.username && body.email && body.password) {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const user = new User({ username: body.username, email: body.email, password: hashedPassword, role: body.role })
            try {
                await user.save();
                return res.status(201).json({ message: "User registered", user })
            } catch (err) {
                console.error("Registration error:", err);
                return res.status(400).json({ message: "Something went wrong", error: err.message });
            }
        } else {
            return res.status(400).json({ message: "All fields are required", received: body });
        }
    }
    catch(err){
    return res.status(500).json({ message: "Server error" });
}

    }



export const handleLogin = async (req, res) => {
    const body = req.body;
    if (body.email && body.password) {
        const user = await User.findOne({ email: body.email });
        if (!user) return res.status(401).json({ message: "Username or Password is wrong" });
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) return res.status(401).json({ message: "username or password is wrong" });

        const token = createJWTToken(user);
        const refreshToken = createRefresh(user);
        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 9000000,
            sameSite: "strict"
        })

        if (token) {
            return res.status(200).json({
                message: "Login success",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    subscription: user.subscription
                }
            });
        }
    } else {
        return res.status(400).json({ message: "All fields are required" })
    }
}

export const handleRefreshToken = (req, res) => {
    const accessToken = createJWTToken(req.user);

    return res.status(200).json({
        message: "New access token",
        token: accessToken
    });
};
export const handleSubscribe = async (req,res)=>{
    try{
        const userId = req.user.userID;
        await User.findByIdAndUpdate(userId, {
            subscription:{
                plan: "premium",
                expiresAt: new Date(Date.now() + 30*24*60*60*1000)
            }
        });
        return res.status(200).json({message: "Subscription successfully updated"});
    }catch(err){
        res.status(500).json({message:"Failed to update subscription", error: err.message});
    }
}
// export const handleMe = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.userID);
//         if (!user) return res.status(404).json({ message: "User not found" });
//         res.json({
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role,
//             subscription: user.subscription
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Failed to fetch user", error: err.message });
//     }
// };

