const db = require('../db');

const Doacao = {
  doar: ({ doador_id, ong_id, descricao, data }) => {
    const sql = 'INSERT INTO doacao (doador_id, ong_id, descricao, data) VALUES (?, ?, ?, ?)';
    return db.execute(sql, [doador_id, ong_id, descricao, data]);
  },

  listar: () => {
    const sql = `
      SELECT d.id, d.descricao, d.data,
             o.nome AS nome_ong,
             dr.nome AS nome_doador
      FROM doacao d
      JOIN ong o ON d.ong_id = o.id
      JOIN doador dr ON d.doador_id = dr.id
      ORDER BY d.data DESC
    `;
    return db.execute(sql);
  }
};

module.exports = Doacao;
