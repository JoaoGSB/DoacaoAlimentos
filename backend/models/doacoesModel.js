const db = require('../db');

const Doacoes = {
  criar: (dados, callback) => {
    const {
      alimento, quantidade, tipo, vencimento, id_ong,
      telefone, endereco, observacoes, status,
      id_doador, nome_doador, email_doador
    } = dados;

    const query = `
      INSERT INTO doacoes
      (alimento, quantidade, tipo, vencimento, id_ong, telefone, endereco, observacoes, status, id_doador, nome_doador, email_doador)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [alimento, quantidade, tipo, vencimento, id_ong, telefone, endereco, observacoes, status, id_doador, nome_doador, email_doador];

    db.query(query, values, callback);
  }
};

module.exports = Doacoes;