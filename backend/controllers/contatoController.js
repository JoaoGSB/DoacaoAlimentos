// controllers/contatoController.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });const nodemailer = require('nodemailer');

exports.enviarMensagem = async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
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
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: 'Mensagem de contato do site',
      text: mensagem,
      html: `<p><b>Nome:</b> ${nome}</p>
             <p><b>E-mail:</b> ${email}</p>
             <p><b>Mensagem:</b><br>${mensagem}</p>`
    });
    res.json({ mensagem: 'Mensagem enviada com sucesso!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ mensagem: 'Erro ao enviar mensagem.' });
  }
};