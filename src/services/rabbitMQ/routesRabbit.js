const express = require('express');
const amqp = require('amqplib');
const router = express.Router();

let conn, ch;

async function connectAMQP() {
  try {
    conn = await amqp.connect('amqp://localhost:5672');
    ch = await conn.createChannel();
  } catch (error) {
    console.error('Erro ao conectar no AMQP:', error);
    // Reconectar após um tempo se a conexão falhar
    setTimeout(connectAMQP, 5000);
  }
}

connectAMQP();

router.post('/enviarInfo/cadastroUsuario', async (req, res) => {
  if (!conn || !ch) {
    return res
      .status(500)
      .send({status: 'Conexão com AMQP não está disponível.'});
  }
  try {
    console.log('enviarInfo/cadastroUsuario');
    const id = req.body.id;
    const nome = req.body.nome;
    const CPF = req.body.CPF;
    const data_nasc = req.body.data_nasc;
    const num_cel = req.body.num_cel;
    const universidade = req.body.universidade;
    const email = req.body.email;
    const placa_veiculo = req.body.placa_veiculo;
    const ano_veiculo = req.body.ano_veiculo;
    const cor_veiculo = req.body.cor_veiculo;
    const nome_veiculo = req.body.nome_veiculo;
    const motorista = req.body.motorista;

    const objInfo = {
      id: id,
      nome: nome,
      CPF: CPF,
      data_nasc: data_nasc,
      num_cel: num_cel,
      universidade: universidade,
      email: email,
      placa_veiculo: placa_veiculo,
      ano_veiculo: ano_veiculo,
      cor_veiculo: cor_veiculo,
      nome_veiculo: nome_veiculo,
      motorista: motorista,
    };

    const exchangeName = 'cadastroUsuarios';
    const routingKey = motorista ? 'motoristas' : 'passageiros';
    const queueName = routingKey;

    ch.assertExchange(exchangeName, 'direct', {durable: false});
    ch.assertQueue(queueName, {durable: false});
    ch.bindQueue(queueName, exchangeName, routingKey); //vincula uma fila (queue) a um exchange específico, usando uma routing key
    ch.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(objInfo)));
    res.status(200).send({status: 'Informações do usuário enviadas!'}); //envia ao servidor
  } catch (error) {
    console.error('Erro ao enviar informações do usuário:', error);
    res.status(500).send({status: 'Erro ao enviar informações do usuário.'});
  }
});

router.get('/consumirInfo/cadastroUsuario/:id', async (req, res) => {
  if (!conn || !ch) {
    return res
      .status(500)
      .send({status: 'Conexão com AMQP não está disponível.'});
  }
  try {
    console.log('consumirInfo/cadastroUsuario/:id');
    const idUsuario = req.params.id;
    let mensagemEncontrada = false;

    const onMessage = msg => {
      if (msg) {
        const mensagem = JSON.parse(msg.content.toString());
        if (mensagem.id === idUsuario) {
          mensagemEncontrada = true;
          ch.ack(msg);
          res.status(200).json({
            status: 'Mensagem consumida com sucesso!',
            data: mensagem,
          });
        } else {
          ch.nack(msg);
        }
      }
    };

    ch.consume('passageiros', onMessage, {noAck: false});

    setTimeout(() => {
      if (!mensagemEncontrada) {
        res.status(404).send({status: 'Mensagem não encontrada.'});
      }
    }, 5000); // Espera 5 segundos antes de concluir que a mensagem não foi encontrada
  } catch (error) {
    console.error('Erro ao consumir mensagem:', error);
    if (!res.headersSent) {
      res.status(500).json({status: 'Erro ao consumir mensagem.'});
    }
  }
});

router.post('/enviarInfo/passageiro', (req, res) => {
  const uid = req.body.uid;
  const estado = req.body.estado;
  const cidade_com_espaco = req.body.cidade; //com espaço
  const cidade_aux = cidade_com_espaco
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  const cidade = cidade_aux.replace(/\s+/g, '_');
  const ativo = req.body.ativo;
  const caronasAceitas = req.body.caronasAceitas || '';
  const latitudeDestino = req.body.latitudeDestino || null;
  const latitudePassageiro = req.body.latitudePassageiro || null;
  const longitudeDestino = req.body.longitudeDestino || null;
  const longitudePassageiro = req.body.longitudePassageiro || null;
  const nomeDestino = req.body.nomeDestino || '';
  const ofertasCaronas = req.body.ofertasCaronas || '';

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
  const routingKey = estado + '_' + cidade + '_passageiros';
  const queueName = routingKey;

  ch.assertExchange(exchangeName, 'direct', {durable: false});
  ch.assertQueue(queueName, {durable: false});
  ch.bindQueue(queueName, exchangeName, routingKey); //vincula uma fila (queue) a um exchange específico, usando uma routing key
  ch.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(objInfo)));
  res.send({status: 'Informações do passageiro enviadas!'}); //envia ao servidor
});

router.post('/enviarInfo/motorista', (req, res) => {
  const uid = req.body.uid;
  const estado = req.body.estado;
  const cidade_com_espaco = req.body.cidade;
  const cidade_aux = cidade_com_espaco
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  const cidade = cidade_aux.replace(/\s+/g, '_');
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
    nomeDestino: nomeDestino,
  };

  const exchangeName = 'localizacoesMotoristas';
  const routingKey = estado + '_' + cidade + '_motoristas';
  const queueName = routingKey;

  ch.assertExchange(exchangeName, 'direct', {durable: false});
  ch.assertQueue(queueName, {durable: false});
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
    Connection: 'keep-alive',
  });

  console.log('Rota obterInfo/motorista');
  const estado = req.params.estado;
  const cidade = req.params.cidade;
  const queueName = estado + '_' + cidade + '_motoristas';

  ch.assertExchange('localizacoes', 'direct', {durable: false});
  ch.assertQueue(queueName, {durable: false});
  ch.bindQueue(queueName, 'localizacoes', `${estado}_${cidade}`);
  ch.consume(
    queueName,
    function (msg) {
      res.write('event: getInfoMotorista\n');
      res.write('data:' + msg.content.toString() + '\n\n');
      // console.log(" [x] Received %s", msg.content.toString());
    },
    {
      noAck: true,
    },
  );
});

router.get('/obterInfo/passageiro/:estado/:cidade', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    Connection: 'keep-alive',
  });

  console.log('Rota obterInfo/passageiro');
  const estado = req.params.estado;
  const cidade = req.params.cidade;
  const queueName = `${estado}_${cidade}_passageiros`;

  ch.assertExchange('localizacoes', 'direct', {durable: false});
  ch.assertQueue(queueName, {durable: false});
  ch.bindQueue(queueName, 'localizacoes', `${estado}_${cidade}`);
  ch.consume(
    queueName,
    function (msg) {
      res.write('event: getInfoPassageiro\n');
      res.write('data:' + msg.content.toString() + '\n\n');
      // console.log(" [x] Received %s", msg.content.toString());
    },
    {
      noAck: true,
    },
  );
});

module.exports = router;
