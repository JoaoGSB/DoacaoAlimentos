const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 1433, // ⚠️ sua porta personalizada
  user: 'root',
  password: 'root',
  database: 'doacao_alimentos'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err.message);
  } else {
    console.log('Conectado com sucesso ao MySQL!');
  }
});

module.exports = connection;