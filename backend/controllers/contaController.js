const Conta = require('../models/contaModel');
const Doadores = require('../models/doadoresModel');
const Ongs = require('../models/ongsModel');
const db = require('../db');

// Cadastrar nova conta (doador ou ong)
exports.cadastrar = (req, res) => {
  const { nome, email, senha, tipo, telefone, endereco, cpf, cnpj } = req.body;

  // Validação básica
  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ mensagem: 'Nome, email, senha e tipo são obrigatórios.' });
  }
  if (tipo === 'doador' && !cpf) {
    return res.status(400).json({ mensagem: 'CPF é obrigatório para doadores.' });
  }
  if (tipo === 'ong' && !cnpj) {
    return res.status(400).json({ mensagem: 'CNPJ é obrigatório para ONGs.' });
  }

  // Primeiro, cria a conta na tabela contas
  Conta.criar({ nome, email, senha, tipo, telefone, endereco, cpf, cnpj }, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar conta:', err);
      return res.status(500).json({ mensagem: 'Erro ao cadastrar conta.', erro: err });
    }
    const idConta = result.insertId;

    // Se for doador, cria também na tabela doadores
    if (tipo === 'doador') {
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
          return res.status(500).json({ mensagem: 'Erro ao cadastrar doador.', erro: err2 });
        }
        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', id: idConta });
      });

    }
    
    // Se for ONG, cria também na tabela ongs
    else if (tipo === 'ong') {
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
          return res.status(500).json({ mensagem: 'Erro ao cadastrar ONG.', erro: err2 });
        }
        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', id: idConta });
      });
    }
  });
};

// Função de login
exports.login = (req, res) => {
  const { email, senha } = req.body;
  db.query('SELECT * FROM contas WHERE email = ?', [email.trim()], (err, results) => {
    if (err) {
      console.error('Erro ao buscar conta para login:', err);
      return res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário ou senha inválido.' });
    }

    const usuario = results[0];
    if (usuario.senha !== senha.trim()) {
      return res.status(401).json({ mensagem: 'Usuário ou senha inválido.' });
    }

    res.json({
      id: usuario.id,
      tipo: usuario.tipo,
      nome: usuario.nome,
      email: usuario.email
    });
  });
};

// Buscar conta por email
exports.buscarPorEmail = (req, res) => {
  const { email } = req.params;
  Conta.buscarPorEmail(email, (err, results) => {
    if (err) {
      console.error('Erro ao buscar conta:', err);
      return res.status(500).json({ mensagem: 'Erro ao buscar conta.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }
    res.json(results[0]);
  });
};

// Buscar conta por id
exports.buscarPorId = (req, res) => {
  const { id } = req.params;
  Conta.buscarPorId(id, (err, results) => {
    if (err) {
      console.error('Erro ao buscar conta:', err);
      return res.status(500).json({ mensagem: 'Erro ao buscar conta.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }
    res.json(results[0]);
  });
};

// Listar todas as ONGs
exports.listarOngs = (req, res) => {
  Conta.listarOngs((err, results) => {
    if (err) {
      console.error('Erro ao listar ONGs:', err);
      return res.status(500).json({ mensagem: 'Erro ao listar ONGs.' });
    }
    res.json(results);
  });
};

// Listar todos os doadores
exports.listarDoadores = (req, res) => {
  Conta.listarDoadores((err, results) => {
    if (err) {
      console.error('Erro ao listar doadores:', err);
      return res.status(500).json({ mensagem: 'Erro ao listar doadores.' });
    }
    res.json(results);
  });
};

// Atualizar conta (telefone, endereço e senha em contas e também em doadores/ongs)
exports.atualizar = (req, res) => {
  const { id } = req.params;
  const { telefone, endereco, senha } = req.body;

  // Atualiza em contas
  Conta.atualizar(id, { telefone, endereco, senha }, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar conta:', err);
      return res.status(500).json({ mensagem: 'Erro ao atualizar conta.' });
    }

    // Descobre o tipo do usuário para atualizar também em doadores ou ongs
    db.query('SELECT tipo FROM contas WHERE id = ?', [id], (err2, results) => {
      if (err2 || results.length === 0) {
        return res.json({ mensagem: 'Conta atualizada com sucesso!' });
      }
      const tipo = results[0].tipo;
      if (tipo === 'doador') {
        db.query('UPDATE doadores SET telefone = ?, endereco = ?, senha = ? WHERE id = ?', [telefone, endereco, senha, id], (err3) => {
          if (err3) {
            console.error('Erro ao atualizar doador:', err3);
          }
          return res.json({ mensagem: 'Conta atualizada com sucesso!' });
        });
      } else if (tipo === 'ong') {
        db.query('UPDATE ongs SET telefone = ?, endereco = ?, senha = ? WHERE id = ?', [telefone, endereco, senha, id], (err3) => {
          if (err3) {
            console.error('Erro ao atualizar ONG:', err3);
          }
          return res.json({ mensagem: 'Conta atualizada com sucesso!' });
        });
      } else {
        return res.json({ mensagem: 'Conta atualizada com sucesso!' });
      }
    });
  });
};

// Atualizar senha (rota específica, se desejar)
exports.atualizarSenha = (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  db.query('SELECT senha, tipo FROM contas WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao verificar senha:', err);
      return res.status(500).json({ mensagem: 'Erro ao verificar senha.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (results[0].senha !== senhaAtual) {
      return res.status(400).json({ mensagem: 'Senha atual incorreta.' });
    }

    db.query('UPDATE contas SET senha = ? WHERE id = ?', [novaSenha, id], (err2) => {
      if (err2) {
        console.error('Erro ao atualizar senha em contas:', err2);
        return res.status(500).json({ mensagem: 'Erro ao atualizar senha.' });
      }

      const tipo = results[0].tipo;
      if (tipo === 'doador') {
        db.query('UPDATE doadores SET senha = ? WHERE id = ?', [novaSenha, id], (err3) => {
          if (err3) {
            console.error('Erro ao atualizar senha em doadores:', err3);
          }
          return res.json({ mensagem: 'Senha alterada com sucesso!' });
        });
      } else if (tipo === 'ong') {
        db.query('UPDATE ongs SET senha = ? WHERE id = ?', [novaSenha, id], (err3) => {
          if (err3) {
            console.error('Erro ao atualizar senha em ongs:', err3);
          }
          return res.json({ mensagem: 'Senha alterada com sucesso!' });
        });
      } else {
        return res.json({ mensagem: 'Senha alterada com sucesso!' });
      }
    });
  });
};