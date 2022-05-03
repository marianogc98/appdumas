const mysql = require('mysql')

const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
})

connection.connect( (error) => {
    if(error){
        console.log(error)
        return
    }
    console.log('CONECTADO A LA BD')
})

module.exports = connection