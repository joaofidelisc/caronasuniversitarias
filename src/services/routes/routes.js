const express = require('express');
const routes = express.Router();

var userFunctions = require('../controllers/user.js');
var veiculoFunctions = require('../controllers/veiculo.js');
// var viagemFunctions = require('../controllers/viagem.js');


routes.get("/", (req, res)=>{
    return res.send("Página inicial");
});


//Rotas do usuário (motorista ou passageiro)
routes.post("/cadastrarUsuario", userFunctions.cadastrarUsuario);
routes.get("/buscarUsuario/:id", userFunctions.buscarUsuario);
routes.get("/buscarPorEmail/:email", userFunctions.buscarPorEmail);
routes.put("/atualizarModoApp", userFunctions.atualizarModoApp);
routes.put("/atualizarToken", userFunctions.atualizarToken);
routes.put("/atualizarClassificacao", userFunctions.atualizarClassificacao);


//Rotas do veículo
routes.post("/cadastrarVeiculo", veiculoFunctions.cadastrarVeiculo);
routes.get("/buscarVeiculo/:userId", veiculoFunctions.buscarVeiculo);
routes.put("/atualizarPlacaVeiculo", veiculoFunctions.atualizarPlacaVeiculo);
routes.put("/atualizarAnoVeiculo", veiculoFunctions.atualizarAnoVeiculo);
routes.put("/atualizarCorVeiculo", veiculoFunctions.atualizarCorVeiculo);
routes.put("/atualizarNomeVeiculo", veiculoFunctions.atualizarNomeVeiculo);

//Rotas de viagem
//Falta fazer as funções no controller e aqui nas rotas e alterar no código do app também!
//Falta entender como fazer o relacionamento entre viagem, carro e motorista(ou passageiro);

module.exports = routes;
