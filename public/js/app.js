import clientList from "./Client.json" assert { type: "json" };
var form = document.querySelector(".invoiceForm");
var addButton = document.querySelector(".btn-add");
var submitButton = document.querySelector(".submitButton");
var deleteButton = document.querySelector(".btn-delete");
var productTable = document.querySelector("tbody");
var clientName = document.querySelector(".Client-company-name");
var products = [];
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
    products.pop();
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
  products.unshift({
    date: data.Date,
    InvoiceNumber : data.InvoiceNumber,
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
  if (products.length <= 7) {
    productTable.insertAdjacentHTML("beforeend", item);
    calculateTotal();
  }
}

function calculateTotal() {
  let tax = document.querySelectorAll(".tax");
  tax.forEach((el) => {
    if (el.innerHTML == "-") el.innerHTML = 0;
  });
  let CGST = document.querySelector(".CGST").innerHTML;
  let IGST = document.querySelector(".IGST").innerHTML;
  let SGST = document.querySelector(".SGST").innerHTML;
  let grandTotal = 0;
  let roundOff = 0;
  products.forEach((product) => {
    grandTotal = grandTotal + product.Amount;
  });
  console.log("Before :", grandTotal);
  document.querySelector(".totalBeforeTax").innerHTML = grandTotal;
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
      let GST = parseFloat(client.GSTValue);
      if (Object.values(client).includes("CGST")) {
        document.querySelector(`.SGST`).innerHTML = `${GST}%`;
        document.querySelector(`.CGST`).innerHTML = `${GST}%`;
        document.querySelector(`.IGST`).innerHTML = "-";
        CGST = 9;
        SGST = 9;
        IGST = 0;
      } else {
        document.querySelector(`.${client.GST}`).innerHTML = `${GST}%`;
        document.querySelector(`.SGST`).innerHTML = "-";
        document.querySelector(`.CGST`).innerHTML = "-";
        IGST = 18;
        CGST = 0;
        SGST = 0;
      }
      document.querySelector('.client__Company-Name').innerHTML = client.Name
      document.querySelector('.client__GST-number').innerHTML = client.GSTNumber
      document.querySelector('.client__address').innerHTML = client.Address
      document.querySelector('.client__Trasnport-details').innerHTML = client.TransportName
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

function print(){
  let dateField = document.querySelector('.Date')
  let InvoiceField = document.querySelector('.Invoice')
  InvoiceField.innerHTML = products[0].InvoiceNumber
  dateField.innerHTML = products[0].date
}


submitButton.addEventListener('click',()=>{
  print()
  window.print()
})