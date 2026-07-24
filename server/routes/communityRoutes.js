import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  getCommunityStats,
  getPosts,
  createPost,
  toggleLike,
  getComments,
  addComment,
} from "../controllers/communityController.js";

const router = express.Router();

router.get("/stats", getCommunityStats);
router.get("/posts", protect, getPosts);
router.post("/posts", protect, upload.single("image"), createPost);
router.post("/posts/:id/like", protect, toggleLike);
router.get("/posts/:id/comments", protect, getComments);
router.post("/posts/:id/comments", protect, addComment);

export default router;
