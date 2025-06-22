const db = require('../db');

// Aqui ficam todas as funções relacionadas à tabela de doações
const Doacoes = {
  // Função para criar uma nova doação no banco de dados
  criar: (dados, callback) => {
    const {
      alimento,
      quantidade,
      tipo,
      vencimento,
      id_ong,
      nome_ong,
      telefone,
      endereco,
      observacoes,
      status = 'Pendente',
      id_doador,
      nome_doador,
      email_doador
    } = dados;

    const query = `
      INSERT INTO doacoes
      (alimento, quantidade, tipo, vencimento, id_ong, nome_ong, telefone, endereco, observacoes, status, id_doador, nome_doador, email_doador)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      alimento,
      quantidade,
      tipo,
      vencimento,
      id_ong,
      nome_ong,
      telefone,
      endereco,
      observacoes,
      status,
      id_doador,
      nome_doador,
      email_doador
    ];

    db.query(query, values, callback);
  },

  // Função para listar todas as doações, trazendo também o nome da ONG e do doador
  listarCompletas: (callback) => {
    const query = `
      SELECT d.*, o.nome AS nome_ong, doad.nome AS nome_doador, doad.email AS email_doador
      FROM doacoes d
      LEFT JOIN ongs o ON d.id_ong = o.id
      LEFT JOIN doadores doad ON d.id_doador = doad.id
    `;
    db.query(query, callback);
  },

  // Função para listar todas as doações de um doador específico
  listarPorDoador: (idDoador, callback) => {
    const query = `
      SELECT d.*, o.nome AS nome_ong, doad.nome AS nome_doador, doad.email AS email_doador
      FROM doacoes d
      LEFT JOIN ongs o ON d.id_ong = o.id
      LEFT JOIN doadores doad ON d.id_doador = doad.id
      WHERE d.id_doador = ?
    `;
    db.query(query, [idDoador], callback);
  },

  // Função para listar todas as doações de uma ONG específica
  listarPorOng: (idOng, callback) => {
    const query = `
      SELECT d.*, o.nome AS nome_ong, doad.nome AS nome_doador, doad.email AS email_doador
      FROM doacoes d
      LEFT JOIN ongs o ON d.id_ong = o.id
      LEFT JOIN doadores doad ON d.id_doador = doad.id
      WHERE d.id_ong = ?
    `;
    db.query(query, [idOng], callback);
  },

  // Função para atualizar o status de uma doação
  atualizarStatus: (id, status, callback) => {
    const query = `UPDATE doacoes SET status = ? WHERE id = ?`;
    db.query(query, [status, id], callback);
  }
};

module.exports = Doacoes;