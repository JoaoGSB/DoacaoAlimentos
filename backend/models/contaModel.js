const db = require('../db');

const Conta = {
  // Cria uma nova conta (doador ou ong)
  criar: (dados, callback) => {
    const { nome, email, senha, tipo, telefone, endereco, cpf, cnpj } = dados;
    const query = `
      INSERT INTO contas (nome, email, senha, tipo, telefone, endereco, cpf, cnpj)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [nome, email, senha, tipo, telefone, endereco, cpf, cnpj],
      callback
    );
  },

  // Buscar conta por email
  buscarPorEmail: (email, callback) => {
    db.query('SELECT * FROM contas WHERE email = ?', [email], callback);
  },

  // Buscar conta por id
  buscarPorId: (id, callback) => {
    db.query('SELECT * FROM contas WHERE id = ?', [id], callback);
  },

  // Listar todas as ONGs
  listarOngs: (callback) => {
    db.query("SELECT * FROM contas WHERE tipo = 'ong'", callback);
  },

  // Listar todos os doadores
  listarDoadores: (callback) => {
    db.query("SELECT * FROM contas WHERE tipo = 'doador'", callback);
  },

  // Atualizar telefone, endereço e senha
  atualizar: (id, { telefone, endereco, senha }, callback) => {
    db.query(
      'UPDATE contas SET telefone = ?, endereco = ?, senha = ? WHERE id = ?',
      [telefone, endereco, senha, id],
      callback
    );
  }
};

module.exports = Conta;