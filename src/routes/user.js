import { Router } from "express";
import userController from "../controller/userController.js";

const router = Router();

router.get("/", (req,res) =>{
    return res.send("user");
});

router.get("/:userId",userController.getUserById);


export default router;