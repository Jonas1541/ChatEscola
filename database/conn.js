const mongoose = require('mongoose');
const URL = 'mongodb://localhost:27017/ChatEscola';
const db = mongoose.connect(URL);
const con = mongoose.connection;

con.on('open', function () {
  console.log('Conectado ao MongoDB!');
});

con.on('error', function () {
  console.log('Erro na conexão com o MongoDB!');
});

con.on('close', function () {
  console.log('Desconectado do MongoDB!');
});

module.exports = db;