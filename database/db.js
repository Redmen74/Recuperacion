const mysql = require('mysql');

const conectar = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'login_db'
});

conectar.connect((error) => {
    if(error)
    {
        console.log('error de conexion')
    }
    else{
        console.log('conectado a la base de datos')
    }
});

module.exports = conectar;