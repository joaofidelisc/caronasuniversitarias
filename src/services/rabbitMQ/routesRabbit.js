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
    // sendSSE(mensagem)
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
