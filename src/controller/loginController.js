import userdb from "../db/user.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const validateUser = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid Email provided"),
    body("password")
        .trim()
        .isAlphanumeric()
        .isLength({ min: 4, max: 56 })
        .withMessage("Invalid password")
]


const singUp = [
    validateUser,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Get User", errors: errors.array()
            })
        }
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = userdb.createUser(req.body.email, hashedPassword);
            res.json(user.id);
        } catch (err) {
            return next(err);
        }
    }
]
const logIn = [
    validateUser,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Get User", errors: errors.array()
            })
        }

        passport.authenticate("local", { session: false }, (err, user, info) => {
            console.log({
                err,
                user,
                info
            });
            
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username }, 
                process.env.JWT_SECRET,                  
                { expiresIn: "1h" }                      
            );

            res.json({ message: "Login exitoso", token });
        })(req, res, next);
    }
]
const logOut = [
    (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    }
]

export default {
    singUp, logIn, logOut
}