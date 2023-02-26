const express = require('express');
const routes = require('../routes/routes.js');
const db = require('../sequelize/index.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const rabbitRoutes = require('../rabbitMQ/routesRabbit.js');

//
const sseExpress = require('sse-express');

const app = express();

app.get('/eventos', async function (req, res){
  console.log('Request /eventos');
  console.log('Nova conexão recebida', req.headers.host);
  // res.set({
  //   'Content-Type': 'text/event-stream',
  //   'Cache-Control': 'no-cache',
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Headers': 'Accept',
  //   'Connection': 'keep-alive',
  // });
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    'Connection': 'keep-alive',
  });
  // res.flushHeaders();
  
  let count = 0;

  while(true){
    // const data = `data: Evento ${++count}\n\n`;
    // const data = `event: chat-message\n`;
    res.write('event: chatmessage\n');
    res.write('data: bla\n\n');

    // res.send(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // console.log('Dentro do while3...\n');
  }
})

// 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);
app.use('/api/rabbit', rabbitRoutes);

db.sync(() => console.log('Banco de dados conectado!'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Servidor Rodando');
  console.log(`PORT: ${port}`);
});
