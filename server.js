import dotenv from "dotenv"
dotenv.config()

import express from "express";
import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser"

console.log(process.env)
const __dirname = dirname(fileURLToPath(import.meta.url))
const publicPath = path.join(__dirname,'public');

const app = express(); // instantiates express
const port = 8080;

console.log(publicPath)

app.use(express.static(publicPath));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.sendFile(`${publicPath}/login.html`);
  console.log("Loaded")
  });

app.post("/submit", (req,res) => {
  console.log(req.body)
  var user = (req.body[""])
  var pass = (req.body[""])
})

console.log("proceed to listen")

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
})