const db = require('../db');

const Doador = {
  criar: (dados, callback) => {
    const { nome, email, telefone, endereco, cpf } = dados;
    const query = 'INSERT INTO doador (nome, email, telefone, endereco, cpf) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nome, email, telefone, endereco, cpf], callback);
  }
};

module.exports = Doador;
