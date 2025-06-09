const db = require('../db');

const Ongs = {
  cadastrar: (dados, callback) => {
    const { nome, email, senha, endereco, telefone, cnpj } = dados;
    const sql = 'INSERT INTO ongs (nome, email, senha, endereco, telefone, cnpj) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, email, senha, endereco, telefone, cnpj], callback);
  },

  listar: (callback) => {
    db.query('SELECT * FROM ongs', callback);
  }
};

module.exports = Ongs;