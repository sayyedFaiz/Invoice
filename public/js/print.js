let generatePDF = document.querySelector(".generatePDF");
let downloadPDF = document.querySelector(".downloadPDF");

generatePDF.addEventListener("click", () => print());
generatePDF.addEventListener("touchstart", () => print());

function updadateLastInvoice() {
  let InvoiceField = document.querySelector(".Invoice");
  let lastInvoiceNumber = localStorage.getItem("InvoiceNumber");
  if (parseInt(InvoiceField.innerHTML) > parseInt(lastInvoiceNumber)) {
    localStorage.setItem("InvoiceNumber", `${InvoiceField.innerHTML}`);
  }
}

downloadPDF.addEventListener("click", function () {
  window.location.href = "/download-invoice";
});

downloadPDF.addEventListener("touchstart", function () {
  window.location.href = "/download-invoice";
});

function print() {
  updadateLastInvoice();
  window.print();
}
