import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.get("/:userId", getUserTweets);           // GET  /api/v1/tweets/:userId

router.post("/",verifyJWT, createTweet);                   // POST /api/v1/tweets/
router.put("/:tweetId",verifyJWT, updateTweet);            // PUT  /api/v1/tweets/:tweetId
router.delete("/:tweetId",verifyJWT, deleteTweet);         // DELETE /api/v1/tweets/:tweetId


export default router;