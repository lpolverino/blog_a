import { Router } from "express";
import loginController from "../controller/loginController.js";

const router = Router();

router.post("/sign",loginController.singUp);

router.post("/log-in", loginController.logIn);

router.get("/log-out",loginController.logOut);

export default router;