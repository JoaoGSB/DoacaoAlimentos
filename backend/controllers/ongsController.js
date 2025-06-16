const db = require('../db');
const Ongs = require('../models/ongsModel');

// Controller para cadastrar uma nova ONG
exports.cadastrar = (req, res) => {
  const { nome, email, senha, telefone, endereco, cnpj } = req.body;

  // Primeiro, cria a conta na tabela contas
  const sqlConta = `
    INSERT INTO contas (nome, email, senha, tipo, telefone, endereco, cnpj)
    VALUES (?, ?, ?, 'ong', ?, ?, ?)
  `;
  db.query(sqlConta, [nome, email, senha, telefone, endereco, cnpj], (err, result) => {
    if (err) {
      console.error('Erro ao criar conta:', err);
      return res.status(500).json({ mensagem: 'Erro ao criar conta.' });
    }
    const idConta = result.insertId;

    // Agora, cria a ONG usando o mesmo id da conta
    Ongs.criar({
      id: idConta,
      nome,
      email,
      senha,
      cnpj,
      telefone,
      endereco
    }, (err2) => {
      if (err2) {
        console.error('Erro ao cadastrar ONG:', err2);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar ONG.' });
      }
      res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', id: idConta });
    });
  });
};

// Buscar ONG pelo id
exports.buscarPorId = (req, res) => {
  const { id } = req.params;
  Ongs.buscarPorId(id, (err, results) => {
    if (err) {
      console.error('Erro ao buscar ONG:', err);
      return res.status(500).json({ mensagem: 'Erro ao buscar ONG.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'ONG não encontrada.' });
    }
    res.json(results[0]);
  });
};

// Listar todas as ONGs
exports.listar = (req, res) => {
  Ongs.listar((err, results) => {
    if (err) {
      console.error('Erro ao listar ONGs:', err);
      return res.status(500).json({ mensagem: 'Erro ao listar ONGs.' });
    }
    res.json(results);
  });
};