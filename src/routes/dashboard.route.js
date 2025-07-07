import express from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats/:channelId", verifyJWT, getChannelStats);
router.get("/videos/:channelId", verifyJWT, getChannelVideos);

export default router;
