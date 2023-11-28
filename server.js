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

// Rendering and exposing directories
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Session Files for Auth
app.use(session({
  secret: process.env.SESSIONAUTH,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

// DB Mongoose Objects
const connection = mongoose.connect(process.env.MONGO_DB)
connection.then(  (result) => {
    console.log('Mongo_DB Connection Established');
    const mongo_conn = result }).catch(
    (err) => {console.log(err)}
  );
const userSchema = new mongoose.Schema({
  username: String, 
  password: String })
userSchema.plugin(passportLocalMongoose);
const substackSchema = new mongoose.Schema({
  Title: String, 
  Datetime: Date,
  Summary: String,
  Raw: String,
  Author: String })
const User = new mongoose.model(
  'users', 
  userSchema, 
  'users'); // my collection name

const Substacks = new mongoose.model(
  'substacks', 
  substackSchema, 
  'substacks'); // my collection name

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
      res.redirect("/home");
    } else {
      res.render("login");
    }
  });

app.post("/", function(req,res,next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local", {
        failureRedirect: "/",
      })(req,res,function() {
        res.redirect("/home")
      })
    }
  })
})

app.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    res.render(`home`);
  } else {
    res.render("login");
  }
  });

app.get('/products', (req, res) => {
  if (req.isAuthenticated()) {
    res.render(`products`);
  } else {
    res.render("login");
  }
  });

  app.get("/logout", function(req,res) {
    req.logOut(function(err) {
      if (err) {return next(err);}
      res.redirect("/")
    })
  });

  app.get('/substacks', async (req, res) => {
    if (req.isAuthenticated()) {
      const data = await Substacks.find({})
      res.render(`substacks`, {data:data, connection: connection, Substacks:Substacks});
    } else {
      res.render("login");
    }
    });

  app.get('/query', (req, res) => {
    if (req.isAuthenticated()) {
      res.render(`query`);
    } else {
      res.render("login");
    }
    });

  app.get('/test', (req, res) => {
    if (req.isAuthenticated()) {
      res.render(`test`);
    } else {
      res.render("login");
    }
    });

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});