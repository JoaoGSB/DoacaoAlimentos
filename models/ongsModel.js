const db = require('../db');

// Model para manipular a tabela de ongs vinculada à tabela contas
const Ongs = {
  // Cria uma nova ONG usando o id gerado em contas
  criar: (dados, callback) => {
    const {
      id, // id da tabela contas
      nome,
      email,
      senha,
      cnpj,
      telefone,
      endereco
    } = dados;

    const query = `
      INSERT INTO ongs
      (id, nome, email, senha, cnpj, telefone, endereco)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, nome, email, senha, cnpj, telefone, endereco];
    db.query(query, values, callback);
  },

  // Buscar ONG pelo id (que é igual ao id da conta)
  buscarPorId: (id, callback) => {
    db.query('SELECT * FROM ongs WHERE id = ?', [id], callback);
  },

  // Listar todas as ONGs
  listar: (callback) => {
    db.query('SELECT * FROM ongs', callback);
  }
};

module.exports = Ongs;