const db = require('../db');
const Doadores = require('../models/doadoresModel');

// Controller para cadastrar um novo doador
exports.cadastrar = (req, res) => {
  const { nome, email, senha, telefone, endereco, cpf } = req.body;

  // Primeiro, cria a conta na tabela contas
  const sqlConta = `
    INSERT INTO contas (nome, email, senha, tipo, telefone, endereco, cpf)
    VALUES (?, ?, ?, 'doador', ?, ?, ?)
  `;
  db.query(sqlConta, [nome, email, senha, telefone, endereco, cpf], (err, result) => {
    if (err) {
      console.error('Erro ao criar conta:', err);
      return res.status(500).json({ mensagem: 'Erro ao criar conta.' });
    }
    const idConta = result.insertId;

    // Agora, cria o doador usando o mesmo id da conta
    Doadores.criar({
      id: idConta,
      nome,
      email,
      senha,
      cpf,
      telefone,
      endereco
    }, (err2) => {
      if (err2) {
        console.error('Erro ao cadastrar doador:', err2);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar doador.' });
      }
      res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', id: idConta });
    });
  });
};

// Buscar doador pelo id
exports.buscarPorId = (req, res) => {
  const { id } = req.params;
  Doadores.buscarPorId(id, (err, results) => {
    if (err) {
      console.error('Erro ao buscar doador:', err);
      return res.status(500).json({ mensagem: 'Erro ao buscar doador.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Doador não encontrado.' });
    }
    res.json(results[0]);
  });
};

// Listar todos os doadores
exports.listar = (req, res) => {
  Doadores.listar((err, results) => {
    if (err) {
      console.error('Erro ao listar doadores:', err);
      return res.status(500).json({ mensagem: 'Erro ao listar doadores.' });
    }
    res.json(results);
  });
};