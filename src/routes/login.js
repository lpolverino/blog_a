import { Router } from "express";
import prisma from "../db/prisma.js"
import passport from "passport";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/sign", async(req,res,next)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await prisma.user.create({
            data:{
                email: req.body.email,
                password:hashedPassword
            }
        });
        res.redirect("/");
    }catch(err){
        return next(err);
    }
})

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;