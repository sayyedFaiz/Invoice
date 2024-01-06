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


function print() {
  updateLastInvoiceNumber();
  window.print();
}
