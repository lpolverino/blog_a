import { Router } from "express";
import userController from "../controller/userController.js";

const router = Router();

router.get("/", userController.getAllUsers);

router.get("/:userId",userController.getUserById);


export default router;