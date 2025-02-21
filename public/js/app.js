var form = document.querySelector(".invoiceForm");
var addButton = document.querySelector(".btn-add");
var submitButton = document.querySelector(".submitButton");
var deleteButton = document.querySelector(".btn-delete");
var productTable = document.querySelector("tbody");
var clientName = document.querySelector(".Client-company-name");
var products = [];
var clientList;
const lastInvoiceNumber = localStorage.getItem("InvoiceNumber")
  ? localStorage.getItem("InvoiceNumber")
  : localStorage.setItem("InvoiceNumber", 0);
var lastInvoiceNumberElement = document.querySelector(".lastInvoiceNumber");
if (lastInvoiceNumber) {
  lastInvoiceNumberElement.innerHTML = lastInvoiceNumber;
}

async function getClients() {
  try {
    const response = await fetch("./Client.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const clientList = await response.json();
    return clientList;
  } catch (error) {
    console.error("There was a problem fetching the client list:", error);
  }
}

addButton.addEventListener("pointerdown", (e) => addProducts(e));
addButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addProducts(e);
});
deleteButton.addEventListener("pointerdown", () => deleteProducts());

function updateProducts() {
  const data = Object.fromEntries(new FormData(form).entries());
  let productQuantity = parseFloat(data.Quantity);
  let productPrice = parseFloat(data.Price);
  let productAmount = productQuantity * productPrice;
  // Set an item in local storage
  if (products.length <= 10) {
    products.unshift({
      date: new Date(data.Date).toLocaleDateString("en-GB"),
      InvoiceNumber: data.InvoiceNumber,
      ProductName: data.ProductName,
      HSN: data.HSN,
      Quantity: productQuantity,
      Price: productPrice,
      Amount: productAmount,
    });
    let item = `
    <tr>
      <td>${products.length - 1}</td>
      <td>${products[0].ProductName}</td>
      <td>${products[0].HSN}</td>
      <td>${productQuantity}</td>
      <td>${productPrice.toFixed(2)}</td>
      <td>${productAmount.toFixed(2)}</td>
    </tr>`;
    productTable.insertAdjacentHTML("beforeend", item);
    calculateTotal();
  }
}

async function calculateTotal() {
  let taxes = await getGST();
  let CGST = parseFloat(taxes[0]);
  let SGST = parseFloat(taxes[1]);
  let IGST = parseFloat(taxes[2]);
  products[0]["CGST_Value"] = CGST;
  products[0]["SGST_Value"] = SGST;
  products[0]["IGST_Value"] = IGST;
  let roundOff = 0;
  let grandTotal = 0;
  products.forEach((product) => {
    if (product.Amount) {
      grandTotal = grandTotal + product.Amount;
      products[0]["total"] = grandTotal;
    }
  });
  document.querySelector(".totalBeforeTax").innerHTML = grandTotal;
  document.querySelector(".CGST").innerHTML = (grandTotal * CGST) / 100;
  document.querySelector(".SGST").innerHTML = (grandTotal * SGST) / 100;
  document.querySelector(".IGST").innerHTML = (grandTotal * IGST) / 100;
  products[0]["CGST"] = (grandTotal * CGST) / 100;
  products[0]["SGST"] = (grandTotal * SGST) / 100;
  products[0]["IGST"] = (grandTotal * IGST) / 100;
  grandTotal =
    grandTotal +
    (grandTotal * parseFloat(IGST)) / 100 +
    (grandTotal * parseFloat(CGST)) / 100 +
    (grandTotal * parseFloat(SGST)) / 100;
  roundOff = (Math.round(grandTotal) - grandTotal).toFixed(2);
  document.querySelector(".grandTotal").innerHTML =
    Math.round(grandTotal).toFixed(2);
  document.querySelector(".roundOff").innerHTML = roundOff;
  products[0]["grandTotal"] = Math.round(grandTotal).toFixed(2);
  products[0]["roundOff"] = roundOff;
}

clientName.addEventListener("change", async (e) => {
  clientList = await getClients();
  clientList.forEach((client) => {
    if (client.Name == e.target.value) {
      products.pop();
      document.querySelector(".client__Company-Name").innerHTML = client.Name;
      document.querySelector(".client__GST-number").innerHTML =
        client.GSTNumber;
      document.querySelector(".client__address").innerHTML = client.Address;

      if (client.TransportName.length > 1) {
        document.querySelector(
          ".client__Trasnport-details"
        ).innerHTML = `${client.TransportName[0]}
        <button class='btn btn-secondary changeTransport d-print-none' data-bs-toggle="modal" data-bs-target="#staticBackdrop">Change</button>
        `;
        selectTransport(client.TransportName);
        let getTransportBtn = document.querySelector(".getTransport-btn");
        getTransportBtn.addEventListener("pointerdown", () => {
          let transportName = document.querySelector(
            ".Client-transport-name"
          ).value;

          document.querySelector(
            ".client__Trasnport-details"
          ).innerHTML = `${transportName}
          <button class='btn btn-secondary changeTransport d-print-none' data-bs-toggle="modal" data-bs-target="#staticBackdrop">Change</button>
          `;
        });
      } else {
        document.querySelector(".client__Trasnport-details").innerHTML =
          client.TransportName;
      }
      products.push(client);
      console.log(products);
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

async function getGST() {
  var CGST, SGST, IGST;
  clientList = await getClients();
  clientList.forEach((client) => {
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
  return [CGST, SGST, IGST];
}

submitButton.addEventListener("pointerdown", () => {
  products.length > 1 ? submit() : alert("Please Enter atleast One Product");
});

function addProducts(e) {
  if (form.checkValidity()) {
    updateProducts();
    clearInputFields();
  } else {
    form.classList.add("was-validated");
    e.preventDefault();
    e.stopPropagation();
  }
}

function deleteProducts() {
  if (products.length) {
    products = products.slice(1);
    productTable.lastElementChild.remove();
    calculateTotal();
    clearInputFields();
  }
}

async function submit() {
  const response = await fetch("/print", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ products }), // Send the products array as JSON
  });

  if (response.ok) {
    updadateLastInvoice();
    window.open("/download-invoice", "_blank");
  } else {
    console.error("Failed to send products.");
  }
}

function updadateLastInvoice() {
  let currentInvoiceNumber = document.querySelector(
    ".InvoiceNumber-Input"
  ).value;
  let lastInvoiceNumber = localStorage.getItem("InvoiceNumber");
  if (parseInt(currentInvoiceNumber) > parseInt(lastInvoiceNumber)) {
    localStorage.setItem("InvoiceNumber", `${currentInvoiceNumber}`);
  }
}

function selectTransport(list) {
  let transportElementList = `
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-target="#staticBackdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Select Transport</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
             <select
              class="form-select Client-transport-name"
              name="TransporNname"
              id="TransporNname"
              required
            >
            <option  selected disabled>Select Transport Name</option>
            ${renderTransportOptions(list)}
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary getTransport-btn" data-bs-dismiss="modal">Save</button>
          </div>
        </div>
      </div>
    </div>
    `;
  form.insertAdjacentHTML("afterbegin", transportElementList);
}

function renderTransportOptions(list) {
  return list
    .map((transport) => `<option value="${transport}">${transport}</option>`)
    .join("");
}
