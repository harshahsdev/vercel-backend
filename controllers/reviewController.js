import reviewModel from "../models/reviewModel.js";

// export const createReview = async (req, res)=>{
//     try{
//         const {businessId, rating, comment} = req.body;
//         if(!businessId || !rating) return res.status(400).json({message:"Business ID and rating are required"});

//         const existingReview = await reviewModel.findOne({
//             businessId,
//             userId: req.user.userID
//         });
//         if(existingReview){
//             return res.status(400).json({message:"you have already reviewed this business"});
//         }

//         const review = new reviewModel({
//             businessId,
//             // token payload uses "userID" (capital D) so match that field
//             userId: req.user.userID,
//             rating,
//             comment
//         });
//         await review.save();
//         // logging headers can happen before sending response if still needed
//         console.log(req.headers);
//         res.status(201).json({message: "Review created", review});
//     }
//     catch(err){
//         res.status(500).json({message: err.message});
//     }
// }
// export const getReviews = async (req,res)=>{
//     try{
//         const reviews = await reviewModel.find({businessId: req.params.businessId});
//         res.status(200).json(reviews);
//     }
//     catch(err){
//         res.status(500).json({message:err.message});
//     }
// };
// export const getAverageRating = async (req,res)=>{
//     try{
//         const reviews = await reviewModel.find({
//             businessId: req.params.businessId
//         });
//         const total = reviews.reduce((sum, r)=> sum + r.rating, 0);
//         const avg = reviews.length? total / reviews.length : 0;

//         res.json({ avgerageRating: avg,
//             totalReviews: reviews.length
//         });
//     }
//     catch(err){
//         res.status(500).json({message:err.message});
//     }
// }

export const createReview = async (req,res)=>{
    try{
        const {businessId, rating, comment} = req.body;

        if(!businessId || !rating || rating <1 || rating >5){
            return res.status(400).json({
                message:"Business ID and valid rating (1-5) required"
            });
        }

        console.log("createReview req.user:", req.user);

        const userId = req.user?.userId || req.user?.userID || req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Authenticated user ID is missing" });
        }

        const existingReview = await reviewModel.findOne({
            businessId,
            userId
        });

        if(existingReview){
            return res.status(400).json({
                message: "You have already reviewed this business"
            });
        }
        const review = new reviewModel({
            businessId,
            userId,
            rating,
            comment
        });
        await review.save();

        res.status(201).json({
            message: "Review created",
            review
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({ businessId: req.params.businessId });
        res.status(200).json(reviews);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const reviews = await reviewModel.find({ businessId: req.params.businessId });
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = reviews.length ? total / reviews.length : 0;

        res.status(200).json({
            averageRating: avg,
            totalReviews: reviews.length
        });
    } catch (e) {
        res.status(500).json({ Message: e.message });
    }
};