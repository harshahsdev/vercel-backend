import express from 'express';
import {verifyAuth} from '../middleware/authMiddleware.js';
import { createReview, getReviews, getAverageRating } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/create', verifyAuth, createReview);
router.get('/business/:businessId', getReviews);
router.get('/business/:businessId/average', getAverageRating);

export default router;