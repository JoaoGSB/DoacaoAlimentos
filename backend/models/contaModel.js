const db = require('../db');

const Conta = {
  autenticar: (email, senha, callback) => {
    const query = 'SELECT * FROM contas WHERE email = ? AND senha = ? AND status = "ativo"';
    db.query(query, [email, senha], callback);
  }
};

module.exports = Conta;