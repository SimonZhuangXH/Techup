const express = require("express");
const path = require("path");
const publicPath = path.join(__dirname,'public');
const app = express(); // instantiates express
const port = 3000;
console.log(publicPath)

app.use(express.static(publicPath));
app.set('view engine', 'html');
app.get('/', (req, res) => {
  console.log("Sent")
  res.render(`${publicPath}/index.html`);
  console.log("Sent")
  });
console.log("proceed to listen")

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
})