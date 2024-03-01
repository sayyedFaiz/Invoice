const express = require("express");
if(process.env.AWS_LAMBDA_FUNCTION_VERSION){
  let puppeteer = require("puppeteer-core");
}else{
  puppeteer = require('puppeteer')
}

const path = require("path");
const cors = require("cors");
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

app.get('/download-invoice', async (req, res) => {
  try {
    let options ={}
    if(process.env.AWS_LAMBDA_FUNCTION_VERSION){
      options = {
        executablePath: puppeteer.executablePath(),
        headless: true
      }
    }
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    // Replace with the full URL of your server when deployed
    await page.goto(`${process.env.SERVER_URL}/print`, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: 'none', preferCSSPageSize: true });

    await browser.close();

    // Ensure that receivedProducts is defined and has the required properties
    if (receivedProducts && receivedProducts.length > 0) {
      const companyName = receivedProducts[receivedProducts.length - 1].Name.trim();
      var fileName = `${companyName}-${date}`;
    }

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    res.contentType("application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating invoice');
  }
});


app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
