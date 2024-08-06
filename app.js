const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

const connection = require("./database/db");

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

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Verifica si el usuario ya existe
    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.send('El nombre de usuario ya está registrado');
        } else {
            // Encriptar la contraseña
            bcrypt.hash(password, 8, (err, hash) => {
                if (err) throw err;
                // Insertar el nuevo usuario en la base de datos
                connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (error, results) => {
                    if (error) throw error;
                    res.redirect('/');
                });
            });
        }
    });
});

app.post('/auth', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
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
        });
    } else {
        res.send('Por favor, ingrese nombre de usuario y contraseña');
    }
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.render('home', { username: req.session.username });
    } else {
        res.send('Por favor, inicie sesión para ver esta página');
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
