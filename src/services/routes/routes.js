const express = require('express');
const routes = express.Router();
// const channel = require('../node-server/server.js');

var userFunctions = require('../controllers/user.js');
var veiculoFunctions = require('../controllers/veiculo.js');
var viagemFunctions = require('../controllers/viagem.js');
var passageiroViagemFunctions = require('../controllers/passageiroviagem.js');


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


//Rotas para atualização de coordenadas em tempo real
//Colocar em um controler esse trecho
// routes.put('/coordenadas', (req, res) =>{
//     console.log('atualizarCoordenadas!!!!!!!!!!1111');
//     let coordenadas = req.body.coordenadas;
//     channel.sendToQueue(queue, Buffer.from(coordenadas));
//     res.send('Coordenadas atualizadas com sucesso');
// })