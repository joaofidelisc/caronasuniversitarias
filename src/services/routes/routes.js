const express = require('express');
const routes = express.Router();

var userFunctions = require('../controllers/user.js');
// var veiculoFunctions = require('../controllers/veiculo.js');
// var viagemFunctions = require('../controllers/viagem.js');


routes.get("/", (req, res)=>{
    return res.send("Página inicial");
});

routes.get("/todosUsuarios", userFunctions.todosUsuarios);
routes.get("/retornarEmails", userFunctions.retornarEmails);
routes.post("/inserirUsuario", userFunctions.inserirUsuario);

module.exports = routes;
