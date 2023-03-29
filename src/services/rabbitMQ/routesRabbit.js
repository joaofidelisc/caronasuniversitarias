  const express = require('express');
  const amqp = require('amqplib/callback_api');
  const router = express.Router();

  let conn, ch;



  function connectAndCreateCh(){
    amqp.connect('amqp://localhost:5672', function (err, connection) {
      conn = connection;
      conn.createChannel(function(err, channel){
        ch = channel;
      });
    }); 
  }

connectAndCreateCh();

  router.post('/enviarInfo/passageiro', (req, res) =>{
    const uid = req.body.uid;
    const estado = req.body.estado;
    const cidade_com_espaco = req.body.cidade; //com espaço
    const cidade_aux = cidade_com_espaco.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const cidade = cidade_aux.replace(/\s+/g, "_");
    const ativo = req.body.ativo;
    const caronasAceitas = req.body.caronasAceitas || "";
    const latitudeDestino = req.body.latitudeDestino || null;
    const latitudePassageiro = req.body.latitudePassageiro || null;
    const longitudeDestino = req.body.longitudeDestino || null;
    const longitudePassageiro = req.body.longitudePassageiro || null;
    const nomeDestino = req.body.nomeDestino || "";
    const ofertasCaronas = req.body.ofertasCaronas || "";

    const objInfo = {
      uid: uid,
      estado: estado,
      cidade: cidade,
      ativo: ativo,
      caronasAceitas: caronasAceitas,
      latitudeDestino: latitudeDestino,
      latitudePassageiro: latitudePassageiro,
      longitudeDestino: longitudeDestino,
      longitudePassageiro: longitudePassageiro,
      nomeDestino: nomeDestino,
      ofertasCaronas: ofertasCaronas,
    };
    
    const exchangeName = 'localizacoesPassageiros';
    const routingKey = estado+'_'+cidade+'_passageiros';
    const queueName = routingKey;

    ch.assertExchange(exchangeName, 'direct', {durable:false});
    ch.assertQueue(queueName, {durable: false});
    ch.bindQueue(queueName, exchangeName, routingKey); //vincula uma fila (queue) a um exchange específico, usando uma routing key
    ch.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(objInfo)));
    res.send({status: "Informações do passageiro enviadas!"}); //envia ao servidor

  });
  
  router.post('/enviarInfo/motorista', (req, res) =>{
    const uid = req.body.uid;
    const estado = req.body.estado;
    const cidade_com_espaco = req.body.cidade;
    const cidade_aux = cidade_com_espaco.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const cidade = cidade_aux.replace(/\s+/g, "_");
    const ativo = req.body.ativo;
    const buscandoCaronista = req.body.buscandoCaronista;
    const caronasAceitas = req.body.caronasAceitas;
    const caronistasAbordo = req.body.caronistasAbordo;
    const latitudeMotorista = req.body.latitudeMotorista;
    const longitudeMotorista = req.body.longitudeMotorista;
    const nomeDestino = req.body.nomeDestino;

    const objInfo = {
      uid: uid,
      estado: estado,
      cidade: cidade,
      ativo: ativo,
      buscandoCaronista: buscandoCaronista,
      caronasAceitas: caronasAceitas,
      caronistasAbordo: caronistasAbordo,
      latitudeMotorista: latitudeMotorista,
      longitudeMotorista: longitudeMotorista,
      nomeDestino: nomeDestino
    };

    const exchangeName = 'localizacoesMotoristas';
    const routingKey = estado+'_'+cidade+'_motoristas';
    const queueName = routingKey;

    ch.assertExchange(exchangeName, 'direct', { durable: false });
    ch.assertQueue(queueName, { durable: false });
    ch.bindQueue(queueName, exchangeName, routingKey); //vincula a fila ao exchange;
    ch.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(objInfo))); //envia mensagem ao exchange;
    res.send({status: 'Informações do motorista enviadas!'});
  });


  router.get('/obterInfo/motorista/:estado/:cidade', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Accept',
      'Connection': 'keep-alive',
    });

    console.log('Rota obterInfo/motorista');
    const estado = req.params.estado;
    const cidade = req.params.cidade;
    const queueName = estado+'_'+cidade+'_motoristas';
  
    ch.assertExchange('localizacoes', 'direct', { durable: false });
    ch.assertQueue(queueName, { durable: false });
    ch.bindQueue(queueName, 'localizacoes', `${estado}_${cidade}`);
    ch.consume(queueName, function(msg) {
      res.write('event: getInfoMotorista\n');
      res.write('data:'+ msg.content.toString() + '\n\n');
      // console.log(" [x] Received %s", msg.content.toString());
    }, {
      noAck: true
    });
  });

  
  router.get('/obterInfo/passageiro/:estado/:cidade', (req, res) => {

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Accept',
      'Connection': 'keep-alive',
    });


    console.log('Rota obterInfo/passageiro');
    const estado = req.params.estado;
    const cidade = req.params.cidade;
    const queueName = `${estado}_${cidade}_passageiros`;
  
    ch.assertExchange('localizacoes', 'direct', { durable: false });
    ch.assertQueue(queueName, { durable: false });
    ch.bindQueue(queueName, 'localizacoes', `${estado}_${cidade}`);
    ch.consume(queueName, function(msg) {
      res.write('event: getInfoPassageiro\n');
      res.write('data:'+ msg.content.toString() + '\n\n');
      // console.log(" [x] Received %s", msg.content.toString());
    }, {
      noAck: true
    });
  });
  

module.exports = router;
