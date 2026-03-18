const mysql=require('mysql2')
const newsDb=mysql.createPool({
    host:'192.168.88.130',
    user:'root',
    password:'123456',
    database:'ai'
})
module.exports = newsDb;