const Doacoes = require('../models/doacoesModel');
const Conta = require('../models/contaModel');
const Ong = require('../models/ongsModel');

// Cadastrar nova doação
exports.cadastrar = (req, res) => {
  const { id_doador, id_ong, tipo } = req.body;

  if (!id_doador || !id_ong) {
    return res.status(400).json({ mensagem: 'id_doador e id_ong são obrigatórios.' });
  }

  Doacoes.criar(req.body, async (err, result) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao registrar doação.' });
    }

    // Função auxiliar para buscar dados e preferências
    function buscarUsuarioComPreferencias(model, id) {
      return new Promise((resolve) => {
        model.buscarPorId(id, (err1, results) => {
          if (err1 || !results || !results[0]) return resolve(null);
          const usuario = results[0];
          Preferencias.buscarPorContaId(id, (err2, pref) => {
            usuario.smsNotificacoes = pref?.sms_notificacoes ?? pref?.smsNotificacoes ?? false;
            usuario.receberNotificacoes = pref?.receber_notificacoes ?? pref?.receberNotificacoes ?? false;
            resolve(usuario);
          });
        });
      });
    }

    // Busca doador e ONG em paralelo
    const doadorPromise = buscarUsuarioComPreferencias(Conta, id_doador);
    const ongPromise = buscarUsuarioComPreferencias(Ong, id_ong);

    Promise.all([doadorPromise, ongPromise]).then(async ([usuario, ong]) => {
      // Notificação doador
      if (usuario) {
        try {
          await enviarAgradecimento({ usuario, tipoDoacao: tipo });
        } catch (erroNotificacao) {
          console.error('Erro ao enviar notificação ao doador:', erroNotificacao);
        }
      }
      // Notificação ONG
      if (ong) {
        ong.nome = ong.nome || ong.razao_social || 'ONG';
        try {
          await enviarAgradecimento({
            usuario: ong,
            tipoDoacao: tipo || 'alimentos',
            mensagemPersonalizada: `Parabéns, ${ong.nome}! Você recebeu uma nova doação pelo DoaFácil. Continue fazendo a diferença!`
          });
        } catch (erroNotificacao) {
          console.error('Erro ao enviar notificação à ONG:', erroNotificacao);
        }
      }
      // Resposta ao frontend
      res.status(201).json({
        mensagem: 'Doação registrada com sucesso!',
        id: result.insertId
      });
    });
  });
};

// Listar todas as doações (agora filtra por conta_id se enviado na query)
exports.listar = (req, res) => {
  const contaId = req.query.conta_id;
  if (contaId) {
    Doacoes.listarPorDoador(contaId, (err, results) => {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro ao buscar doações do doador.' });
      }
      res.json(results);
    });
  } else {
    Doacoes.listarCompletas((err, results) => {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro ao buscar doações.' });
      }
      res.json(results);
    });
  }
};

// Listar doações por doador
exports.listarPorDoador = (req, res) => {
  const idDoador = req.params.id;
  Doacoes.listarPorDoador(idDoador, (err, results) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao buscar doações do doador.' });
    }
    res.json(results);
  });
};

// Listar doações por ONG
exports.listarPorOng = (req, res) => {
  const idOng = req.params.id;
  Doacoes.listarPorOng(idOng, (err, results) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao buscar doações da ONG.' });
    }
    res.json(results);
  });
};

// Confirmar doação (ONG)
exports.confirmar = (req, res) => {
  const id = req.params.id;
  Doacoes.atualizarStatus(id, 'Entregue', (err) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao confirmar doação.' });
    }
    res.json({ mensagem: 'Doação confirmada com sucesso!' });
  });
};

// Cancelar doação (ONG)
exports.cancelar = (req, res) => {
  const id = req.params.id;
  Doacoes.atualizarStatus(id, 'Cancelada', (err) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao cancelar doação.' });
    }
    res.json({ mensagem: 'Doação cancelada com sucesso!' });
  });
};

// Cancelar doação pelo doador (opcional)
exports.cancelarDoador = (req, res) => {
  const id = req.params.id;
  Doacoes.atualizarStatus(id, 'Cancelada', (err) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao cancelar doação pelo doador.' });
    }
    res.json({ mensagem: 'Doação cancelada pelo doador com sucesso!' });
  });
};