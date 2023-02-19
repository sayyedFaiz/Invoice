const express = require('express')
const path = require('path');
const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})