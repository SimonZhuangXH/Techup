import express from "express";
import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url))
const publicPath = path.join(__dirname,'public');

const app = express(); // instantiates express
const port = 8080;

console.log(publicPath)

app.use(express.static(publicPath));
app.set('view engine', 'html');
app.get('/', (req, res) => {
  console.log("Sent")
  res.render(`${publicPath}/index`);
  });
console.log("proceed to listen");

// app.use(bodyParser.urlencoded({extended: True}));
// app.post("/submit", (req,res) => {
//   console.log(req.body);
// })

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
})