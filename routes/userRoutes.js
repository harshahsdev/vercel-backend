import express from 'express';
import { handleRegister, handleLogin, handleRefreshToken, handleSubscribe } from '../controllers/userControllers.js';
import { verifyAuth, verifyRefresh } from '../middleware/authMiddleware.js';


const route = express.Router();

route.post('/register',handleRegister);
route.post('/login', handleLogin);
route.get('/token', verifyRefresh, handleRefreshToken);
route.post('/subscribe', verifyAuth, handleSubscribe);
// route.get('/me', verifyAuth, handleMe);


export default route;