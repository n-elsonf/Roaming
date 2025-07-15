import express from "express";
import { getUserPosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
// router.get("/", verifyToken, getFeedPosts); // maybe not search on home page
// router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
// router.patch("/:id/like:", verifyToken, likePost);

export default router;
