import express from "express"
import dotenv from "dotenv";
import prisma from "./src/db/prisma.js"
import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local"
import bcrypt from "bcryptjs";

const LocalStrategy = passportLocal.Strategy;

import routes from "./src/routes/index.js"

dotenv.config();

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const { rows } = await prisma.user.findFirst({
        where:{
         email:email   
        }
      });
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(user.password, password);
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
            name:username   
        }
      });
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

const app = express();
app.use(cors());

app.use(session({secret:"orcas", resave:false, saveUninitialized:false}));
app.use(passport.session());

app.use("/post",routes.post);
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