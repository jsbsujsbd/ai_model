const mongoose = require('mongoose');

// 连接到 130 的 IP
const mogDb=async()=>mongoose.connect('mongodb://192.168.88.130:27017/chat_db')
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('连接失败', err));
module.exports = mogDb;