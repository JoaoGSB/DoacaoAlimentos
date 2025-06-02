const db = require('../db');

const Ong = {
  cadastrar: ({ nome, email, endereco, telefone, cnpj }) => {
    const sql = 'INSERT INTO ong (nome, email, endereco, telefone, cnpj) VALUES (?, ?, ?, ?, ?)';
    return db.execute(sql, [nome, email, endereco, telefone, cnpj]);
  },

  listar: () => {
    return db.execute('SELECT * FROM ong');
  }
};

module.exports = Ong;
