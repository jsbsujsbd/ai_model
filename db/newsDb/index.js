const mysql=require('mysql2')
const newsDb=mysql.createPool({
    host:'127.0.0.1:3306',
    user:'root',
    password:'123456',
    database:'ai'
})
module.exports = newsDb;