let generatePDF = document.querySelector(".generatePDF");
let downloadPDF = document.querySelector(".downloadPDF");

generatePDF.addEventListener("click", () => print());
generatePDF.addEventListener("touchstart", () => print());

downloadPDF.addEventListener("click", function () {
  window.location.href = "/download-invoice";
});

downloadPDF.addEventListener("touchstart", function () {
  window.location.href = "/download-invoice";
});

function updateLastInvoiceNumber() {
  let InvoiceField = document.querySelector(".Invoice");
//   InvoiceField.innerHTML = products[0].InvoiceNumber;
  let lastInvoiceNumber = localStorage.getItem("InvoiceNumber");
  if (InvoiceField.innerHTML > lastInvoiceNumber) {
    localStorage.setItem("InvoiceNumber", `${InvoiceField.innerHTML}`);
  }
}

function print() {
  updateLastInvoiceNumber();
  window.print();
}
