const mysql = require('mysql');
const util = require('util');  //manejar la bd de manera remota 

const pool = mysql.createPool({
    connectionLimit: 10, //limite de conexiones simultaneas a la base de datos
    host: 'localhost',
    user: 'root',
    password: '',   
    database: 'pokemon'
}); //para crear diferentes conexiones a la base de datos, 
// es una buena práctica para evitar problemas de conexión

pool.query = util.promisify(pool.query); //promisify es una función que convierte una función 
// que utiliza callbacks en una función que devuelve una promesa,
module.exports = pool;  //vamos a exportar la conexiona la bd para utilizarla donde nosotros queremos