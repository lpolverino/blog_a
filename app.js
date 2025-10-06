import express from "express"
import dotenv from "dotenv";
import prisma from "./src/db/prisma.js"
import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local"
import bcrypt from "bcryptjs";
import auth from "./src/middleware/auth.js";

const LocalStrategy = passportLocal.Strategy;

import routes from "./src/routes/index.js"

dotenv.config();

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where:{
         email:username 
        }
      });
      console.log(user);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await prisma.user.findFirst({
        where:{
            id:id
        }
      });
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());


app.use(session({secret:"orcas", resave:false, saveUninitialized:false}));
app.use(express.urlencoded({ extended: false }));
app.use(passport.session());

app.use("/post", auth.authenticateJWT, routes.post);
app.use("/user",routes.user);
app.use("/auth",routes.login);

app.get("/", (req,res)=> res.send("Hello World"));

const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});


app.listen(PORT, (error) =>{
    if(error){
        throw error;
    }
    console.log(`Express listen to port: ${PORT}`)
});