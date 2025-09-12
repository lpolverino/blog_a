import { Router } from "express";
import postController from "../controller/postController.js";

const router = Router();

router.get("/",postController.getAllPosts);
router.get("/:postId", postController.getPost);
router.post("/", postController.createPost);
router.put("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

export default router;