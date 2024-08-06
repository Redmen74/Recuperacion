const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

const conectar = require("./database/db");

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/auth', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results, fields) => {
            if (results.length > 0) {
                // Comparar la contraseña encriptada
                bcrypt.compare(password, results[0].password, (err, isMatch) => {
                    if (isMatch) {
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.redirect('/home');
                    } else {
                        res.send('Contraseña incorrecta');
                    }
                });
            } else {
                res.send('Usuario no encontrado');
            }
            res.end();
        });
    } else {
        res.send('Por favor, ingrese nombre de usuario y contraseña');
        res.end();
    }
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.render('home', { username: req.session.username });
    } else {
        res.send('Por favor, inicie sesión para ver esta página');
    }
    res.end();
});

// Servir archivos estáticos (Bootstrap)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
