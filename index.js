const express = require("express");
const puppeteer = require("puppeteer");
// const chromium = require("@sparticuz/chromium");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const clientList = require("./data/Client.json");

const app = express();
let receivedProducts = [];
const port = process.env.PORT || 3000; // Default to port 3000 for local testing

// Set up view engine and paths
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for static files
app.use(express.static(path.join(__dirname, "public")));
// app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use(bodyParser.json());
app.use(cors());

// Serve JSON file route
app.get("/Client.json", (req, res) => {
  res.sendFile(path.join(__dirname, "data/Client.json"));
});

// Render the homepage
app.get("/", (req, res) => {
  res.render("index", { clientList });
});

// Handle the POST request to receive product data
app.post("/print", (req, res) => {
  receivedProducts = req.body.products || []; // Get the products array from the request
  res.status(200).send("Products received on the server.");
});

// Render the print page with received products
app.get("/print", (req, res) => {
  res.render("print", { receivedProducts });
});

// Download invoice as a PDF
app.get("/download-invoice", async (req, res) => {
  try {
    // Puppeteer configuration for different environments
    const browser = await puppeteer.launch();
    //     const browser = await puppeteer.launch({
    //       args: [...chromium.args],
    //       defaultViewport: chromium.defaultViewport,
    //       executablePath: await chromium.executablePath(),
    //       headless: chromium.headless,
    //       ignoreHTTPSErrors: true
    //     });
    const page = await browser.newPage();
    //     // Replace with the full URL of your server when deployed
    await page.goto(`http://localhost:3000/print`, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: "none",
      preferCSSPageSize: true,
    });

    await browser.close();

    //     // Determine the filename based on the received products
    let date = new Date().toJSON().slice(0, 10);
    let fileName = `invoice-${date}`;
    if (receivedProducts && receivedProducts.length > 0) {
      const companyName =
        receivedProducts[receivedProducts.length - 1].Name.trim();

      fileName = `${companyName}-${date}`;
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.pdf"`
    );
    res.contentType("application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Error generating invoice");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
