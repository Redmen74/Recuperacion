const express = require('express')
const app = express()
const router = require('./router/router')
const port = 3000

app.set('view engine','ejs')

app.get('/', (req, res) => {
    res.render('index')
})