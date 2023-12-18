import clientList from "./Client.json" assert { type: "json" };

var form = document.querySelector(".invoiceForm");
var addButton = document.querySelector(".btn-add");
var submitButton = document.querySelector(".submitButton");
var deleteButton = document.querySelector(".btn-delete");
var productTable = document.querySelector("tbody");
var clientName = document.querySelector(".Client-company-name");
var products = [];
const lastInvoiceNumber = localStorage.getItem("InvoiceNumber");
document.querySelector(".lastInvoiceNumber").innerHTML = lastInvoiceNumber;
addButton.addEventListener("click", (e) => {
  if (form.checkValidity()) {
    updateProducts();
    clearInputFields();
  } else {
    form.classList.add("was-validated");
    e.preventDefault();
    e.stopPropagation();
  }
});
deleteButton.addEventListener("click", () => {
  if (products.length) {
    products = products.slice(1);
    console.log("after delete",products)
    productTable.lastElementChild.remove();
    calculateTotal();
    clearInputFields();
  }
});
function updateProducts() {
  const data = Object.fromEntries(new FormData(form).entries());
  let productQuantity = parseFloat(data.Quantity);
  let productPrice = parseFloat(data.Price);
  let productAmount = productQuantity * productPrice;
  // Set an item in local storage
  products.unshift({
    date: data.Date,
    InvoiceNumber: data.InvoiceNumber,
    ProductName: data.ProductName,
    HSN: data.HSN,
    Quantity: productQuantity,
    Price: productPrice,
    Amount: productAmount,
  });
  let item = `  <tr>
    <td>${products.length}</td>
    <td>${products[0].ProductName}</td>
    <td>${products[0].HSN}</td>
    <td>${productQuantity}</td>
    <td>${productPrice.toFixed(2)}</td>
    <td>${productAmount.toFixed(2)}</td>
  </tr>`;
  if (products.length <= 10) {
    productTable.insertAdjacentHTML("beforeend", item);
    calculateTotal();
  }
}

function calculateTotal() {
  let taxes = getGST();
  console.log(taxes)
  let CGST = taxes[0];
  let SGST = taxes[1];
  let IGST = taxes[2];
  let grandTotal = 0;
  let roundOff = 0;
  console.log("calculate products:",products)
  products.forEach((product) => {
    grandTotal = grandTotal + product.Amount;
  });
  console.log("Before :", grandTotal);
  document.querySelector(".totalBeforeTax").innerHTML = grandTotal;
  document.querySelector(".CGST").innerHTML =
    ((grandTotal * parseFloat(CGST)) / 100).toFixed(2);
  document.querySelector(".SGST").innerHTML =
    ((grandTotal * parseFloat(SGST)) / 100).toFixed(2);
  document.querySelector(".IGST").innerHTML =
    ((grandTotal * parseFloat(IGST)) / 100).toFixed(2);
  grandTotal =
    grandTotal +
    (grandTotal * parseFloat(IGST)) / 100 +
    (grandTotal * parseFloat(CGST)) / 100 +
    (grandTotal * parseFloat(SGST)) / 100;
  console.log("After : ", grandTotal);
  roundOff = (Math.round(grandTotal) - grandTotal).toFixed(2);
  document.querySelector(".grandTotal").innerHTML =
    Math.round(grandTotal).toFixed(2);
  document.querySelector(".roundOff").innerHTML = roundOff;
}

clientName.addEventListener("change", (e) => {
  var CGST, SGST, IGST;
  clientList.clientList.forEach((client) => {
    if (client.Name == e.target.value) {
      document.querySelector(".client__Company-Name").innerHTML = client.Name;
      document.querySelector(".client__GST-number").innerHTML =
        client.GSTNumber;
      document.querySelector(".client__address").innerHTML = client.Address;
      document.querySelector(".client__Trasnport-details").innerHTML =
        client.TransportName;
    }
  });
  calculateTotal();
});

function clearInputFields() {
  let productData = document.querySelectorAll(".productData");
  productData.forEach((product) => {
    product.value = "";
  });
}

function print() {
  let dateField = document.querySelector(".Date");
  let InvoiceField = document.querySelector(".Invoice");
  InvoiceField.innerHTML = products[0].InvoiceNumber;
  let lastInvoiceNumber = localStorage.getItem("InvoiceNumber")
  if (products[0].InvoiceNumber > lastInvoiceNumber){
    localStorage.setItem("InvoiceNumber", `${products[0].InvoiceNumber}`);
    console.log(lastInvoiceNumber)
  }
  const formattedDate = new Date(products[0].date).toLocaleDateString("en-GB");
  dateField.innerHTML = formattedDate;
}

submitButton.addEventListener("click", () => {
  print();
  window.print();
});

function getGST() {
  var CGST, SGST, IGST;
  clientList.clientList.forEach((client) => {
    if (
      client.Name == document.querySelector(".client__Company-Name").innerHTML
    ) {
      if (Object.values(client).includes("CGST")) {
        CGST = parseFloat(client.GSTValue);
        SGST = parseFloat(client.GSTValue);
        IGST = 0;
      } else {
        CGST = 0;
        SGST = 0;
        IGST = parseFloat(client.GSTValue);
      }
    }
  });
  console.log(document.querySelector(".client__Company-Name").innerHTML)
  return [CGST, SGST, IGST];
}

