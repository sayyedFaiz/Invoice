var form = document.querySelector(".invoiceForm");
var inputs = document.querySelectorAll(".form-control");
var checkboxes = document.querySelectorAll(".form-check-input");
var addButton = document.querySelector(".btn-add");
var productTable = document.querySelector("tbody");

var products = [];
addButton.addEventListener("click", (e) => {
  if (form.checkValidity()) {
    updateProducts();
    console.log(products)
  } else {
    form.classList.add("was-validated");
    e.preventDefault();
    e.stopPropagation();

  }
});

function updateProducts() {
  const data = Object.fromEntries(new FormData(form).entries());
  let productQuantity = parseFloat(data.Quantity);
  let productPrice = parseFloat(data.Price);
  let productAmount = productQuantity * productPrice;
  products.unshift({
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
  let grandTotal = 0;
  let roundOff = 0;
  products.forEach((product) => {
    grandTotal = grandTotal + product.Amount;
  });
  checkboxes.forEach((input) => {
    if (input.checked) {
      let GST = parseFloat(input.value);
      document.querySelector(`.${input.name}`).innerHTML = `${GST}%`;
      console.log("Before :", grandTotal);
      grandTotal = grandTotal + (grandTotal * GST) / 100;
      console.log("After : ", grandTotal);
    }
  });
  roundOff = (Math.round(grandTotal) - grandTotal).toFixed(2);
  document.querySelector(".grandTotal").innerHTML =
    Math.round(grandTotal).toFixed(2);
  document.querySelector(".roundOff").innerHTML = roundOff;
}


