const express = require('express');
const router = express.Router();
const doadoresController = require('../controllers/doadoresController');

// Cadastro de doador
router.post('/cadastrar', doadoresController.cadastrar);

// Listar todos os doadores
router.get('/', doadoresController.listar);

module.exports = router;