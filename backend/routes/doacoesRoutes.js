const express = require('express');
const router = express.Router();
const doacoesController = require('../controllers/doacoesController');

// Cadastro de doação
router.post('/cadastrar', doacoesController.cadastrar);

// Listar todas as doações
router.get('/', doacoesController.listar);

// Listar doações realizadas por um doador
router.get('/doador/:id', doacoesController.listarPorDoador);

// Listar doações recebidas por uma ONG
router.get('/ong/:id', doacoesController.listarPorOng);

module.exports = router;