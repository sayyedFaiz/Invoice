var form = document.querySelector(".invoiceForm");
var addButton = document.querySelector(".btn-add");
var productTable = document.querySelector('tbody')
var products = [];




addButton.addEventListener("click", () => {
  const data = Object.fromEntries(new FormData(form).entries());
  // Push product name hsn quantity rate into products array
  products.unshift(
    {'ProductName':data.ProductName,
    'HSN': data.HSN,
    'Quantity': data.Quantity,
    'Price': data.Price
  })
  console.log(products)
  console.log(productTable.childElementCount+1)
  let item =
`  <tr>
    <td>${products.length}</td>
    <td>${products[0].ProductName}</td>
    <td>${products[0].HSN}</td>
    <td>${products[0].Quantity}</td>
    <td>${products[0].Price}</td>
  </tr>`
  if(products.length <= 10)
  productTable.insertAdjacentHTML('beforeend',item)
});
