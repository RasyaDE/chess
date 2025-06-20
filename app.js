const express = require('express')

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.listen(port)

app.get('/', (req,res) => {
  res.render('index', {title: "TosChess"})
})
