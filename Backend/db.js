const mysql = require('mysql2')

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password:'',
   database:'rdl'
})

db.connect((err) =>{
    if(err){
        console.log("db connection failed", err)
    }
    console.log("DB connected successfully")
})

module.exports = db;