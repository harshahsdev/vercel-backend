import express from "express";
import {
    getBusinesses,
    getBusinessBySlug,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    searchBusiness,
    uploadImage,
    getNearbyBusiness
} from "../controllers/businessController.js";
import { requirePremium, verifyAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.get("/search", searchBusiness);
router.get("/nearby", getNearbyBusiness);
router.get("/list", getBusinesses);
router.get("/", getBusinesses);
router.get("/:slug", getBusinessBySlug);
router.post("/", verifyAuth, createBusiness);
router.put("/:id", verifyAuth, requirePremium, updateBusiness);
router.delete("/:id", verifyAuth, requirePremium, deleteBusiness);
router.post(
    "/:id/upload-image",
    verifyAuth,
    upload.array("images", 5),
    uploadImage
);

export default router;