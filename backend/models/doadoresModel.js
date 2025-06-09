const db = require('../db');

const Doadores = {
  criar: (dados, callback) => {
    const { nome, email, senha, telefone, endereco, cpf } = dados;

    // Validação: impede cadastro se algum campo obrigatório estiver vazio
    if (!nome || !email || !senha || !telefone || !endereco || !cpf) {
      return callback(new Error('Todos os campos obrigatórios devem ser preenchidos.'));
    }

    const query = `
      INSERT INTO doadores (nome, email, senha, telefone, endereco, cpf)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [nome, email, senha, telefone, endereco, cpf], callback);
  },
  listar: (callback) => {
    db.query('SELECT * FROM doadores', callback);
  }
};

module.exports = Doadores;