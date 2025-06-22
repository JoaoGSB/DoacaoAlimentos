const nodemailer = require('nodemailer');

exports.enviarMensagem = async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }

  // Verifique se as variáveis de ambiente estão definidas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ mensagem: 'Configuração de e-mail ausente.' });
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Remetente autenticado
      replyTo: email,               // Responder para o e-mail do usuário
      to: process.env.EMAIL_USER,
      subject: 'Mensagem de contato do site',
      text: `
        Nome: ${nome}
        E-mail: ${email}
        Mensagem: ${mensagem}
      `,
      html: `<p><b>Nome:</b> ${nome}</p>
             <p><b>E-mail:</b> ${email}</p>
             <p><b>Mensagem:</b><br>${mensagem}</p>`
    });
    res.json({ mensagem: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    res.status(500).json({ mensagem: 'Erro ao enviar mensagem.', erro: err.message });
  }
};