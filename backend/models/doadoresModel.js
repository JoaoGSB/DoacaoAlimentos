const db = require('../db');

// Model para manipular a tabela de doadores vinculada à tabela contas
const Doadores = {
  // Cria um novo doador usando o id gerado em contas
  criar: (dados, callback) => {
    const {
      id, // id da tabela contas
      nome,
      email,
      senha,
      cpf,
      telefone,
      endereco
    } = dados;

    const query = `
      INSERT INTO doadores
      (id, nome, email, senha, cpf, telefone, endereco)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, nome, email, senha, cpf, telefone, endereco];
    db.query(query, values, callback);
  },

  // Buscar doador pelo id (que é igual ao id da conta)
  buscarPorId: (id, callback) => {
    db.query('SELECT * FROM doadores WHERE id = ?', [id], callback);
  },

  // Listar todos os doadores
  listar: (callback) => {
    db.query('SELECT * FROM doadores', callback);
  }
};

module.exports = Doadores;