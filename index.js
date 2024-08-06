const express = require('express');
const app = express();
const conectar = require("./database/db");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false}));

app.use(express(JSON));
const port = 3000

app.set('view engine','ejs')

app.get('/', (req, res) => {
    res.render('login')
})

app.listen(port, () => {
    console.log(`Servidor ejecutandose http://localhost:${port}`)
})