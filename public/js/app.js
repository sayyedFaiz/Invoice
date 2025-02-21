var data = {
  clientInfo: [],
  products: [],
};

var form = document.querySelector(".invoiceForm");
var addButton = document.querySelector(".btn-add");
var submitButton = document.querySelector(".submitButton");
var deleteButton = document.querySelector(".btn-delete");
var productTable = document.querySelector("tbody");
var clientName = document.querySelector(".Client-company-name");

var clientList;
const lastInvoiceNumber = localStorage.getItem("InvoiceNumber");
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

addButton.addEventListener("pointerdown", (e) => addProducts(e, data));
addButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addProducts(e, data);
});
deleteButton.addEventListener("pointerdown", () => deleteProducts(data));

function updateProducts(data) {
  const productData = Object.fromEntries(new FormData(form).entries());
  console.log("formData:", productData);
  let products = productData.products;
  let productQuantity = parseFloat(productData.Quantity);
  let productPrice = parseFloat(productData.Price);
  let productAmount = productQuantity * productPrice;
  // Set an item in local storage
  console.log("data:", data);
  if (data.products.length <= 10) {
    Object.assign(data, {
      date: new Date(productData.Date).toLocaleDateString("en-GB"),
      invoiceNumber: productData.InvoiceNumber,
      products: [
        {
          ProductName: productData.ProductName,
          HSN: productData.HSN,
          Quantity: productQuantity,
          Price: productPrice,
          Amount: productAmount,
        },
      ],
    });
    // products.unshift({
    //   date: new Date(productData.Date).toLocaleDateString("en-GB"),
    //   InvoiceNumber: productData.InvoiceNumber,
    //   ProductName: productData.ProductName,
    //   HSN: productData.HSN,
    //   Quantity: productQuantity,
    //   Price: productPrice,
    //   Amount: productAmount,
    // });
    let item = `
    <tr>
      <td>${data.products.length}</td>
      <td>${data.products[0].ProductName}</td>
      <td>${data.products[0].HSN}</td>
      <td>${data.products[0].Quantity}</td>
      <td>${data.products[0].Price.toFixed(2)}</td>
      <td>${data.products[0].Amount.toFixed(2)}</td>
    </tr>`;
    productTable.insertAdjacentHTML("beforeend", item);
    calculateTotal(data);
  }
}

async function calculateTotal(data) {
  console.log(data);
  let taxes = await getGST();
  let CGST = parseFloat(taxes[0]);
  let SGST = parseFloat(taxes[1]);
  let IGST = parseFloat(taxes[2]);
  data.clientInfo["CGST_Value"] = CGST;
  data.clientInfo["SGST_Value"] = SGST;
  data.clientInfo["IGST_Value"] = IGST;
  let roundOff = 0;
  let grandTotal = 0;
  data.products.forEach((product) => {
    if (product.Amount) {
      grandTotal = grandTotal + product.Amount;
      // products[0]["total"] = grandTotal;
      product.total = grandTotal;
    }
  });
  document.querySelector(".totalBeforeTax").innerHTML = grandTotal;
  document.querySelector(".CGST").innerHTML = (grandTotal * CGST) / 100;
  document.querySelector(".SGST").innerHTML = (grandTotal * SGST) / 100;
  document.querySelector(".IGST").innerHTML = (grandTotal * IGST) / 100;
  data.products[0]["CGST"] = (grandTotal * CGST) / 100;
  data.products[0]["SGST"] = (grandTotal * SGST) / 100;
  data.products[0]["IGST"] = (grandTotal * IGST) / 100;
  grandTotal =
    grandTotal +
    (grandTotal * parseFloat(IGST)) / 100 +
    (grandTotal * parseFloat(CGST)) / 100 +
    (grandTotal * parseFloat(SGST)) / 100;
  roundOff = (Math.round(grandTotal) - grandTotal).toFixed(2);
  document.querySelector(".grandTotal").innerHTML =
    Math.round(grandTotal).toFixed(2);
  document.querySelector(".roundOff").innerHTML = roundOff;
  data.products[0]["grandTotal"] = Math.round(grandTotal).toFixed(2);
  data.products[0]["roundOff"] = roundOff;
}
clientName.addEventListener("change", async (e) => {
  console.log("change");
  console.log(data);
  clientList = await getClients();
  clientList.forEach((client) => {
    if (client.Name == e.target.value) {
      data.clientInfo.pop();
      document.querySelector(".client__Company-Name").innerHTML = client.Name;
      document.querySelector(".client__GST-number").innerHTML =
        client.GSTNumber;
      document.querySelector(".client__address").innerHTML = client.Address;

      if (client.TransportName.length > 1) {
        selectTransport(client.TransportName);
        let getTransportBtn = document.querySelector(".getTransport-btn");
        getTransportBtn.addEventListener("pointerdown", () => {
          let transportName = document.querySelector(".Client-transport-name").value;
          document.querySelector(".client__Trasnport-details").innerHTML = transportName
          client.TransportName = (client.TransportName).filter(el => el === transportName)
          console.log(client.TransportName)
        });
      } else {
        document.querySelector(".client__Trasnport-details").innerHTML =
          client.TransportName;
      }
      products.push(client);
      console.log(products)
    }
  });
  calculateTotal(data);
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

function addProducts(e, data) {
  if (form.checkValidity()) {
    updateProducts(data);
    clearInputFields();
  } else {
    form.classList.add("was-validated");
    e.preventDefault();
    e.stopPropagation();
  }
}

function deleteProducts(data) {
  console.log(data);
  if (data.products.length > 0) {
    console.log("deleted");
    data.products = data.products.slice(1);
    productTable.lastElementChild.remove();
    calculateTotal(data);
    clearInputFields();
  }
}

async function submit() {
  console.log({ products });
  const response = await fetch("/print", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ products }), // Send the products array as JSON
  });

  if (response.ok) {
    updadateLastInvoice();

    window.location.href = "/download-invoice";
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
    <div class="modal fade" id="exampleModal" >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
             <select
              class="form-select Client-transport-name"
              name="TransporNname"
              id="TransporNname"
              required
            >
            <option  selected value="">Select Transport Name</option>
            <option  value="${list[0]}">${list[0]}</option>
            <option  value="${list[1]}">${list[1]}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary getTransport-btn" data-bs-dismiss="modal">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    `;
  form.insertAdjacentHTML("afterbegin", transportElementList);

  var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
    keyboard: false,
  });

  myModal.show();
}


