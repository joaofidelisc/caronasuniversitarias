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

  //CRIAR ROTA PARA:
    //criar filas ESTADO_CIDADE_Motoristas_UID
      //exemplo:
        //SP_SãoCarlos_Motoristas_0VtQXRifF8PdbcKCrthdOtlnah12
    //enviar obj (motorista):
        // - Pro passageiro a mesma coisa (verificar informações firebase realtime)
      //ativo:true or false;
      //buscandoCaronista;
      //caronasAceitas;
      //caronistasAbordo;
      // latitudeMotorista;
      // longitudeMotorista;
      // nomeDestino;

  //Enviar dados para chatrooms;
  //Receber dados dos chatrooms;

// -----------------------------------------------------------
  //Para motoristas:
   /* 
   nome do banco Motoristas
   uid;
   estado -> sigla
   cidade -> São Carlos
   ativo: true
   buscandoCaronista:""
   caronasAceitas:""
   caronistasAbordo:""
   latitudeMotorista: -21.985245
   longitudeMotorista: -47.895199
   nomeDestino
   */

  /*
  Para passageiros
  nome do banco Passageiros
  uid;
  estado -> sigla
  cidade -> São Carlos
  ativo: true
  caronasAceitas: ""
  latitudeDestino: -22.0094691
  latitudePassageiro: -21.9958199
  longitudeDestino: -47.891227
  longitudePassageiro: -47.8828265
  nomeDestino: "Centro..."
  ofertasCaronas:""
  
  Para chatrooms:
  - uidchat;
  firstUser: UID;
  messages: {objeto}
  secondUser: UID;
  
  */
  
  //antes de enviar um objeto é necessário serializar (usar JSON.stringfy);
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

    const exchangeName = 'localizacoes';
    const routingKey = estado+'_'+cidade;
    const queueName = routingKey;

    ch.assertExchange(exchangeName, 'direct', { durable: false });
    ch.assertQueue(queueName, { durable: false });
    ch.bindQueue(queueName, exchangeName, routingKey); //vincula a fila ao exchange;
    ch.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(objInfo))); //envia mensagem ao exchange;
    console.log("Informações enviadas com sucesso!");
    res.send({status: 'Informações enviadas com sucesso!'});
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
    const queueName = `${estado}_${cidade}`;

    console.log('queueName:', queueName);
    console.log('estado:', estado);
    console.log('cidade:', cidade);
  
    ch.assertExchange('localizacoes', 'direct', { durable: false });
    ch.assertQueue(queueName, { durable: false });
    ch.bindQueue(queueName, 'localizacoes', `${estado}_${cidade}`);
    ch.consume(queueName, function(msg) {
      res.write('event: chatmessage\n');
      res.write('data:'+ msg.content.toString() + '\n\n');
      console.log(" [x] Received %s", msg.content.toString());
    }, {
      noAck: true
    });
  });
  

  router.post('/enviar_mensagem', (req, res) => {
    const mensagem = req.body.mensagem;
    console.log('Mensagem que tô enviando:', mensagem);
    ch.assertQueue('fila_de_mensagens', {durable: false});
    ch.sendToQueue('fila_de_mensagens', Buffer.from(mensagem));
    res.send({ status: 'Mensagem enviada com sucesso' });
  });
  
  router.get('/obter_mensagem', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Accept',
      'Connection': 'keep-alive',
    });

    console.log('entrando em obter_mensagem');
    ch.assertQueue('fila_de_mensagens', {durable: false});
    console.log('Aguardando por mensagens...\n');
    ch.consume('fila_de_mensagens', function(msg){
      // console.log('MENSAGEM RECEBIDA:',msg.content.toString());
      // res.write('data:', msg.content.toString(), '\n\n');
      // res.write('data:\n\n');
      res.write('event: chatmessage\n');
      res.write('data:'+ msg.content.toString() + '\n\n');
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // res.send({mensagem: msg.content.toString()});
    }, { noAck:true });
  });


module.exports = router;
