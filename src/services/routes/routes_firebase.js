const express = require('express');
const routes = express.Router();

var passengerFunctions = require('../controllers/firebase/passageiro.js');

routes.get("/buscarCarona/:estado/:cidade/:currentUser", passengerFunctions.buscarCarona)

module.exports = routes;