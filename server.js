const express = require("express");
const puppeteer = require('puppeteer');
const path = require("path");

const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const clientList = require("./public/js/Client.json");
const app = express();
let receivedProducts = []
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(bodyParser.json());
// Get an item from local storage

app.get("/", (req, res) => {
  res.render("index", { clientList: clientList.clientList });
});


// Handle the POST request to receive the products data
app.post('/send-products', (req, res) => {
   receivedProducts = req.body.products; // Get the products array from the request
  // Handle the received products here in your server-side logic
  console.log('Received products:', receivedProducts);
  // Perform operations or save to a database, etc.

  // Send a response back to the client
  res.status(200).send('Products received on the server.');
});


app.get("/print", (req, res) => {
  res.render("print", {receivedProducts});
});

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});



