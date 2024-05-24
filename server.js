const express = require("express");
const path = require("path");
const cors = require("cors");
const ejs = require("ejs");
const fs = require("fs");
require("dotenv").config();
const bodyParser = require("body-parser");
const clientList = require("./public/js/Client.json");
const app = express();
let receivedProducts = [];
const date = new Date().toJSON().slice(0, 10);
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(bodyParser.json());
app.use(cors());

// Route to serve JSON file
app.get("/Client.json", (req, res) => {
  res.sendFile(__dirname + "/public/js/Client.json");
});

app.get("/", (req, res) => {
  res.render("index", { clientList: clientList });
});

// Handle the POST request to receive the products data
app.post("/print", (req, res) => {
  receivedProducts = req.body.products; // Get the products array from the request
  // Send a response back to the client
  res.status(200).send("Products received on the server.");
});

app.get("/print", (req, res) => {
  res.render("print", { receivedProducts });
});

app.get("/download-invoice", async (req, res) => {
  try {
    //   // Ensure that receivedProducts is defined and has the required properties
    if (receivedProducts && receivedProducts.length > 0) {
      const companyName =
        receivedProducts[receivedProducts.length - 1].Name.trim();
      var fileName = `${companyName}-${date}`;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating invoice");
  }
});

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
