const express = require('express');
const router = express.Router();
const ContatoController = require('../controllers/contatoController');

router.post('/api/contato', ContatoController.enviarMensagem);

module.exports = router;