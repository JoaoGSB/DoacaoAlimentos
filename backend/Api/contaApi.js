// controllers/contaController.js
const db = require('../db');

const getContaDados = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica a conta
    const [contaResult] = await db.promise().query('SELECT * FROM contas WHERE id = ?', [id]);

    if (contaResult.length === 0) {
      return res.status(404).json({ erro: 'Conta não encontrada' });
    }

    const conta = contaResult[0];
    let dadosUsuario;

    if (conta.tipo === 'doador') {
      const [doador] = await db.promise().query('SELECT nome, endereco, celular, fonefixo FROM doadores WHERE IDdoador = ?', [conta.id_referencia]);
      dadosUsuario = doador[0];
    } else {
      const [ong] = await db.promise().query('SELECT nome, endereco, celular, fonefixo FROM ongs WHERE IDong = ?', [conta.id_referencia]);
      dadosUsuario = ong[0];
    }

    res.json({
      email: conta.email,
      tipo: conta.tipo,
      status: conta.status,
      criado_em: conta.criado_em,
      ...dadosUsuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar dados da conta' });
  }
};

module.exports = { getContaDados };
