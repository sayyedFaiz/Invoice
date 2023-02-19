let form = document.querySelector(".invoiceForm");
let addButton = document.querySelector(".btn-add");
let products = [];





addButton.addEventListener("click", () => {
  const data = Object.fromEntries(new FormData(form).entries());
  // Push product name hsn quantity rate into products array
  console.log(data)
});
