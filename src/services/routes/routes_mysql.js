const express = require('express');
const routes = express.Router();

let userFunctions = require('../controllers/mysql/user.js');
let veiculoFunctions = require('../controllers/mysql/veiculo.js');
let viagemFunctions = require('../controllers/mysql/viagem.js');
let passageiroViagemFunctions = require('../controllers/mysql/passageiroviagem.js');


routes.get("/", (req, res)=>{
    return res.send("Página inicial");
});


//Rotas do usuário (motorista ou passageiro)
routes.post("/cadastrarUsuarioPublico", userFunctions.cadastrarUsuarioPublico);
routes.post("/cadastrarUsuarioPrivado", userFunctions.cadastrarUsuarioPrivado);
routes.get("/buscarUsuarioPublico/:id", userFunctions.buscarUsuarioPublico);
routes.get("/buscarUsuarioPrivado/:id", userFunctions.buscarUsuarioPrivado);
routes.get("/buscarPorEmailUsuarioPublico/:email", userFunctions.buscarPorEmailUsuarioPublico);
routes.get("/buscarPorEmailUsuarioPrivado/:email", userFunctions.buscarPorEmailUsuarioPrivado);
routes.put("/atualizarModoAppUsuarioPublico", userFunctions.atualizarModoAppUsuarioPrivado);
routes.put("/atualizarModoAppUsuarioPrivado", userFunctions.atualizarModoAppUsuarioPrivado);
routes.put("/atualizarTokenUsuarioPublico", userFunctions.atualizarTokenUsuarioPublico);
routes.put("/atualizarTokenUsuarioPrivado", userFunctions.atualizarTokenUsuarioPrivado);
routes.put("/atualizarClassificacaoUsuarioPublico", userFunctions.atualizarClassificacaoUsuarioPublico);
routes.put("/atualizarClassificacaoUsuarioPrivado", userFunctions.atualizarClassificacaoUsuarioPrivado);


//Rotas do veículo
routes.post("/cadastrarVeiculo", veiculoFunctions.cadastrarVeiculo);
routes.get("/buscarVeiculo/:userId", veiculoFunctions.buscarVeiculo);
routes.put("/atualizarPlacaVeiculo", veiculoFunctions.atualizarPlacaVeiculo);
routes.put("/atualizarAnoVeiculo", veiculoFunctions.atualizarAnoVeiculo);
routes.put("/atualizarCorVeiculo", veiculoFunctions.atualizarCorVeiculo);
routes.put("/atualizarNomeVeiculo", veiculoFunctions.atualizarNomeVeiculo);

//Rotas de viagem
routes.post("/cadastrarViagem", viagemFunctions.cadastrarViagem);
routes.get("/buscarUltimaViagem/:uidMotorista", viagemFunctions.buscarUltimaViagem);
routes.get("/contarViagens/:uidMotorista", viagemFunctions.contarViagens);
// routes.get("/buscarViagem/:uidPassageiro1", viagemFunctions.buscarViagem);
// routes.put("/atualizarViagem", viagemFunctions.atualizarViagem);


//Rotas passageiro viagem
routes.post("/cadastrarViagemPassageiro", passageiroViagemFunctions.cadastrarViagemPassageiro);
routes.get("/buscarViagemPassageiro/:userId/:idViagem", passageiroViagemFunctions.buscarViagemPassageiro);
routes.get("/contarViagensPassageiro/:userId", passageiroViagemFunctions.contarViagensPassageiro);
module.exports = routes;


