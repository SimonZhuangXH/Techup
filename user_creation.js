import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import encrypt from "mongoose-encryption" ;
import md5 from "md5" // Hashing;
import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

// Path and instantiating app
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname,'public');
const app = express(); // instantiates express
const port = 8080;
console.log(publicPath);

// Session Files for Auth
app.use(session({
  secret: process.env.SESSIONAUTH,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

var authenticated = false

// DB Mongoose Objects
mongoose.connect(process.env.MONGO_DB).then(
  (result) => {console.log('Mongo_DB Connection Established')}).catch(
    (err) => {console.log(err)}
  );
const userSchema = new mongoose.Schema({
  username: String, 
  password: String })
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model(
  'users', 
  userSchema, 
  'users'); // my collection name

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function registration(username,password) {
  User.register({username: username},password, function(err,user) {
    if (err) {
      console.log(err)
    } else {
      passport.authenticate("local")
      console.log("Successfully registered "+ username)
    }
  })
}
// username and password
registration("","")