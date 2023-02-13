  const express = require('express');
  const amqp = require('amqplib/callback_api');
  const router = express.Router();
  // const sse = require('../SSE/sse.js');
  var SSE = require('express-sse');

  
  // const app = express();
  var sse = new SSE();
  // var sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);
  let conn, ch;
  
  // const app = express();
  
 
  router.get('/stream', function(req, res){
    console.log('Entrou no /stream!');
    sse.init(req, res)
    sse.on('open', function(){
      console.log('Conexão SSE estabelecida');
    })
  });
  
  function sendSSE(data){
    // sse.init();
    console.log('Enviando mensagem SSE...');
    sse.send(data, "message");
  }


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

  
  //antes de enviar um objeto é necessário serializar (usar JSON.stringfy);
  router.post('/enviarDados', (req, res) =>{
    const estado = req.body.estado;
    const cidade_com_espaco = req.body.cidade;
    const cidade = cidade_com_espaco.trim();
    const situacao = req.body.situacao;
    const uid = req.body.uid;
    const queue = estado+'_'+cidade+'_'+situacao+'_'+uid;
    const objInfo = req.body.objInfo;
    ch.assertQueue(queue, {durable: false});
    ch.sendToQueue(queue, Buffer.from(objInfo));
    res.send({status: 'Informações enviadas com sucesso!'});
  });

  router.post('/enviar_mensagem', (req, res) => {
    const mensagem = req.body.mensagem;
    console.log('Mensagem que tô enviando:', mensagem);
    ch.assertQueue('fila_de_mensagens', {durable: false});
    ch.sendToQueue('fila_de_mensagens', Buffer.from(mensagem));
    sendSSE(mensagem)
    res.send({ status: 'Mensagem enviada com sucesso' });
  });
  
  router.get('/obter_mensagem', (req, res) => {
    console.log('entrando em obter_mensagem');
    ch.assertQueue('fila_de_mensagens', {durable: false});
    console.log('Aguardando por mensagens...\n');
    ch.consume('fila_de_mensagens', function(msg){
      console.log(msg.content.toString());
    }, { noAck:true });
  });


module.exports = router;
