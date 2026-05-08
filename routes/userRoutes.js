import express from 'express';
import { handleRegister, handleLogin, handleRefreshToken, handleSubscribe } from '../controllers/userControllers.js';
import { verifyAuth, verifyRefresh } from '../middleware/authMiddleware.js';


const route = express.Router();

router.get("/register", (req, res) => {
  res.send("GET register route works");
});
router.post("/register", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Register route working"
  });
});
route.post('/login', handleLogin);
route.get('/token', verifyRefresh, handleRefreshToken);
route.post('/subscribe', verifyAuth, handleSubscribe);
// route.get('/me', verifyAuth, handleMe);


export default route;