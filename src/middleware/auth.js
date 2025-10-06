import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userdb  from "../db/user.js";

dotenv.config();

function authenticateJWT(req, res, next) {
  
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = await userdb.getUserById(user.id);

      next();
    });
  } else {
    res.sendStatus(401);
  }
}

export default{
    authenticateJWT
}