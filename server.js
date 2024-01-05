const express = require("express");
const puppeteer = require('puppeteer');
const path = require("path");
const bodyParser = require('body-parser');
const clientList = require("./public/js/Client.json");
const app = express();
let receivedProducts = []
const date =  new Date().toJSON().slice(0, 10);
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
  // Send a response back to the client
  res.status(200).send('Products received on the server.');
});

app.get("/print", (req, res) => {
  res.render("print", {receivedProducts});
});
app.get('/download-invoice', async (req, res) => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/print', { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4',  printBackground: true, margin : 'none',
  preferCSSPageSize: true  });

  await browser.close();
  let fileName = `${(receivedProducts[receivedProducts.length - 1].Name).trim()}${date}`
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
  res.contentType("application/pdf");
  // Send the buffer as a response to download
  res.send(pdf);
});

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});



