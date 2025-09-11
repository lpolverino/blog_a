import userdb from "../db/user.js";
import expressValidator from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";

const {param: param, validationResult} = expressValidator;

const validateUserId = [
    param("userId")
        .isNumeric().withMessage("userId has to be a numeric value")
]


const getUserById = [
    validateUserId,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            req.status(400).json({
                title:"Get User", errors: errors.array()
            })
        }
        
        const {userId} = req.params;
        try {   
            const user = await userdb.getUserById(parseInt(userId));
            
            if (!user){
                
                throw new NotFoundError("User not found");
                return;
            }
            
            res.json(user);
        }catch(err) {
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }
]

const createUser = [

]

export default {
    getUserById,
    createUser,
}