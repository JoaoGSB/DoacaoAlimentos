const express = require('express');
const router = express.Router();
const doacoesController = require('../controllers/doacoesController');

// Cadastro de doação
router.post('/', doacoesController.cadastrar); // POST /api/doacoes

// Listar todas as doações (com dados completos)
router.get('/', doacoesController.listar);

// Listar doações realizadas por um doador
router.get('/doador/:id', doacoesController.listarPorDoador);

// Listar doações recebidas por uma ONG
router.get('/ong/:id', doacoesController.listarPorOng);

// Confirmar doação (ONG marca como Entregue/Recebida)
router.put('/:id/confirmar', doacoesController.confirmar);

// Cancelar doação (ONG ou doador marca como Cancelada)
router.put('/:id/cancelar', doacoesController.cancelar);

module.exports = router;