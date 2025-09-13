import userdb from "../db/user.js";
import expressValidator from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";

const { param: param, validationResult, body } = expressValidator;

const validateUserId = [
    param("userId")
        .isNumeric().withMessage("userId has to be a numeric value")
]

const validateUser = [
    body("name")
        .trim()
        .isAlphanumeric()
        .isLength({ min: 4, max: 56 })
        .withMessage("Invalid name value")
]

const getAllUsers = [
    async (req, res) => {
        try {
            const users = await userdb.getAllUsers();
            return res.json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error")
        }
    }
]

const getUserById = [
    validateUserId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Get User", errors: errors.array()
            })
        }

        const { userId } = req.params;
        try {
            const user = await userdb.getUserById(parseInt(userId,10));

            if (!user) {

                throw new NotFoundError("User not found");
            }

            return res.json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }
]

const modifyUser = [
    validateUserId,
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Modify User", errors: errors.array()
            })
        }

        const userId = parseInt(req.params.userId,10);
        try {
            const user = await userdb.getUserById(userId);

            if (!user) {
                throw new NotFoundError("User not found");
            }
            await userdb.modifyUser(userId, req,body.name);
        } catch(err){
            console.error(err);
            res.status(500).send("Internal server error");
        }
    }
]

export default {
    getAllUsers,
    getUserById,
    modifyUser,
}