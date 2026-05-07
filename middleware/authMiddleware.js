import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_CODE = process.env.JWT_SECRET;

export const verifyAuth = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_CODE);
        if (!decoded.userID && !decoded._id && !decoded.id) {
            console.warn("verifyAuth: decoded token missing user ID", decoded);
        }

        req.user = {
            ...decoded,
            id: decoded.userID || decoded._id || decoded.id,
            userId: decoded.userID || decoded._id || decoded.id
        };

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
            error: err.message
        });
    }
};
export const roleBased = (role=[])=>{
    return (req, res, next)=>{
        if(!role.includes(req.user.role)){
            return res.status(403).json({message:"Access denied"});
        }
        next();
    }
}
export const verifyRefresh = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token missing" });
        }

        const decoded = jwt.verify(refreshToken, SECRET_CODE);

        req.user = {
            ...decoded,
            id: decoded.userID || decoded._id || decoded.id,
            userId: decoded.userID || decoded._id || decoded.id
        };
        console.log("Decoded user:", req.user);
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};
export const requirePremium = (req, res, next)=>{
    if(req.user.subscription?.plan !=="premium"){
        return res.status(403).json({message:"Premium subscription required"});
    }
    next();
}
