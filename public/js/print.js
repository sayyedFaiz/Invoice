let generatePDF = document.querySelector('.generatePDF')
let downloadPDF = document.querySelector('.downloadPDF')

generatePDF.addEventListener('click',()=>{updadateLastInvoice() })


function updadateLastInvoice() {
    let InvoiceField = document.querySelector(".Invoice");
    let lastInvoiceNumber = localStorage.getItem("InvoiceNumber");
    if (parseInt(InvoiceField.innerHTML) > parseInt(lastInvoiceNumber)) {
      localStorage.setItem("InvoiceNumber", `${InvoiceField.innerHTML}`);
    }
    window.print()
  }

downloadPDF.addEventListener('click', function() {
    window.location.href = '/download-invoice';
});
