let generatePDF = document.querySelector(".generatePDF");
let downloadPDF = document.querySelector(".downloadPDF");

generatePDF.addEventListener("pointerdown", () => print());
function updadateLastInvoice() {
  let InvoiceField = document.querySelector(".Invoice");
  let lastInvoiceNumber = localStorage.getItem("InvoiceNumber");
  if (parseInt(InvoiceField.innerHTML) > parseInt(lastInvoiceNumber)) {
    localStorage.setItem("InvoiceNumber", `${InvoiceField.innerHTML}`);
  }
}

// downloadPDF.addEventListener("pointerdown", function () {
//   window.location.href = "/download-invoice";
// });

function print() {
  updadateLastInvoice();
  window.print();
}
