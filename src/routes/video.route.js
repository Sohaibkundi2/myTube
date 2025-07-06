import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";

import  upload  from "../middlewares/multer.middleware.js"; 

const router = Router();

router.get("/", getAllVideos);

router.get("/:videoId", getVideoById);

router.post(
  "/publish",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

router.put(
  "/:videoId",
  verifyJWT,
  upload.single("thumbnail"), 
  updateVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);

router.patch("/:videoId/toggle", verifyJWT, togglePublishStatus);

export default router;
