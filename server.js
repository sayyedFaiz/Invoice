const express = require("express");
const path = require("path");
const clientList = require("./public/js/Client.json");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
// Get an item from local storage

app.get("/", (req, res) => {
  res.render("index", { clientList: clientList.clientList });
});
app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});


