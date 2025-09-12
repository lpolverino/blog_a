import { Router } from "express";
import userController from "../controller/userController.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:userId",userController.getUserById);
router.put("/:userId", userController.modifyUser);
router.delete("/:userId", (req,res)=>{
    res.send("Not implemented")
})

export default router;