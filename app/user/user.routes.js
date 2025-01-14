import express from "express";
import { getStatisticByUser, getUserProfile } from "./user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/profile').get(protect, getUserProfile)
router.route('/profile/stat').get(protect, getStatisticByUser)


export default router;