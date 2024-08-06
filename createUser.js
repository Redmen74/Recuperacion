const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

const username = 'testuser';
const password = 'password123';

bcrypt.hash(password, 8, (err, hash) => {
    if (err) throw err;
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (error, results) => {
        if (error) throw error;
        console.log('Usuario creado exitosamente');
        connection.end();
    });
});
