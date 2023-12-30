let generatePDF = document.querySelector('.generatePDF')
let downloadPDF = document.querySelector('.downloadPDF')

generatePDF.addEventListener('click',()=> window.print())

downloadPDF.addEventListener('click', function() {
    window.location.href = '/download-invoice';
});
