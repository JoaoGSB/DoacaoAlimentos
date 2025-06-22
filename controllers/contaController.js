const bcrypt = require('bcrypt');
const Conta = require('../models/contaModel');
const Doadores = require('../models/doadoresModel');
const Ongs = require('../models/ongsModel');
const db = require('../db');

// Cadastrar nova conta (doador ou ong)
exports.cadastrar = async (req, res) => {
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

  try {
    // Gera o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Primeiro, cria a conta na tabela contas
    Conta.criar({ nome, email, senha: senhaHash, tipo, telefone, endereco, cpf, cnpj }, (err, result) => {
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
          senha: senhaHash,
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
          senha: senhaHash,
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
  } catch (err) {
    console.error('Erro ao gerar hash da senha:', err);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar conta.' });
  }
};

// Função de login
exports.login = (req, res) => {
  const { email, senha } = req.body;
  db.query('SELECT * FROM contas WHERE email = ?', [email.trim()], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar conta para login:', err);
      return res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário ou senha inválido.' });
    }

    const usuario = results[0];
    // Compara a senha digitada com o hash salvo
    const senhaCorreta = await bcrypt.compare(senha.trim(), usuario.senha);
    if (!senhaCorreta) {
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

  // Monta a query dinamicamente
  let campos = [];
  let valores = [];

  if (telefone !== undefined) {
    campos.push('telefone = ?');
    valores.push(telefone);
  }
  if (endereco !== undefined) {
    campos.push('endereco = ?');
    valores.push(endereco);
  }
  if (senha !== undefined && senha !== '') {
    campos.push('senha = ?');
    valores.push(senha);
  }

  if (campos.length === 0) {
    return res.status(400).json({ mensagem: 'Nenhum dado para atualizar.' });
  }

  valores.push(id);

  const sql = `UPDATE contas SET ${campos.join(', ')} WHERE id = ?`;

  db.query(sql, valores, (err, result) => {
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

      // Atualiza também em doadores ou ongs, se necessário
      let tabela = tipo === 'doador' ? 'doadores' : tipo === 'ong' ? 'ongs' : null;
      if (tabela) {
        let camposSec = [];
        let valoresSec = [];
        if (telefone !== undefined) {
          camposSec.push('telefone = ?');
          valoresSec.push(telefone);
        }
        if (endereco !== undefined) {
          camposSec.push('endereco = ?');
          valoresSec.push(endereco);
        }
        if (senha !== undefined && senha !== '') {
          camposSec.push('senha = ?');
          valoresSec.push(senha);
        }
        valoresSec.push(id);

        if (camposSec.length > 0) {
          db.query(
            `UPDATE ${tabela} SET ${camposSec.join(', ')} WHERE id = ?`,
            valoresSec,
            (err3) => {
              if (err3) {
                console.error(`Erro ao atualizar ${tabela}:`, err3);
              }
              return res.json({ mensagem: 'Conta atualizada com sucesso!' });
            }
          );
        } else {
          return res.json({ mensagem: 'Conta atualizada com sucesso!' });
        }
      } else {
        return res.json({ mensagem: 'Conta atualizada com sucesso!' });
      }
    });
  });
};

// Atualizar senha (rota específica, se desejar)
exports.atualizarSenha = async (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  db.query('SELECT senha, tipo FROM contas WHERE id = ?', [id], async (err, results) => {
    if (err) {
      console.error('Erro ao verificar senha:', err);
      return res.status(500).json({ mensagem: 'Erro ao verificar senha.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    // Verifica se a senha atual está correta
    const senhaCorreta = await bcrypt.compare(senhaAtual, results[0].senha);
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'Senha atual incorreta.' });
    }

    // Gera hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    db.query('UPDATE contas SET senha = ? WHERE id = ?', [novaSenhaHash, id], (err2) => {
      if (err2) {
        console.error('Erro ao atualizar senha em contas:', err2);
        return res.status(500).json({ mensagem: 'Erro ao atualizar senha.' });
      }

      const tipo = results[0].tipo;
      if (tipo === 'doador') {
        db.query('UPDATE doadores SET senha = ? WHERE id = ?', [novaSenhaHash, id], (err3) => {
          if (err3) {
            console.error('Erro ao atualizar senha em doadores:', err3);
          }
          return res.json({ mensagem: 'Senha alterada com sucesso!' });
        });
      } else if (tipo === 'ong') {
        db.query('UPDATE ongs SET senha = ? WHERE id = ?', [novaSenhaHash, id], (err3) => {
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