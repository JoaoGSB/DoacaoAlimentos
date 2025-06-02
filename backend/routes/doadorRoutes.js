const express = require('express');
const router = express.Router();
const doadorController = require('../controllers/doadorController');

router.post('/doador', doadorController.cadastrarDoador);

module.exports = router;
