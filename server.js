import dotenv from "dotenv"
dotenv.config()

import express from "express";
import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser"

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicPath = path.join(__dirname,'public');

const app = express(); // instantiates express
const port = 8080;

console.log(publicPath)

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}))

var authenticated = false

app.get('/', (req, res) => {
  res.render(`login`);
  // console.log("login")
  });

app.get('/login', (req, res) => {
  res.render(`login`);
  // console.log("login")
  });

app.post("/login", (req,res) => {
  const uid = process.env.ALLOWED.split(",");
  const ups = process.env.PASS.split(",");
  const user = req.body.username
  const pass = req.body.pass

  if (uid.includes(user) && ups[uid.indexOf(user)]===pass) {
    // console.log("Authenticated")
    res.render('home', {authenticated:true})
    authenticated = true
  } else {
    console.log(`Wrong pass for user: ${user}`)
    res.render('login', {not_authenticated:true})
  }
})

app.get('/home', (req, res) => {
  if (authenticated) {
    res.render(`home`);
  } else {
    res.render("login")
  }

  });

app.get('/products', (req, res) => {
  if (authenticated) {
    res.render(`products`);
  } else {
    res.render("login")
  }
  });


console.log("proceed to listen")

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
})