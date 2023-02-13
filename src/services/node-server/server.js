const compression = require('compression');
const express = require('express');
const routes = require('../routes/routes.js');
const db = require('../sequelize/index.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const SSE = require('express-sse');

const app = express();
app.use(compression());

const sse = new SSE();

app.get('/stream', (req, res)=>{
    sse.init(req, res);
    // sse.on()
});

// app.get('/stream', (req, res) => {
//   sse.init(req, res);
// //   console.log('inicializando /stream');
// //   sse.send('Hello, client!');
// //   sse.on('connection', (stream) => {
// //     console.log('someone connected!');
// //   });
// });

app.post('/enviar_mensagem', (req, res)=>{
    console.log('Enviando mensagem...');
    sse.send('teste', 'message');
    res.send({ status: 'Mensagem enviada com sucesso -> ->!'})
})

app.use(cors());
app.get('/updates', sse.init);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

db.sync(() => console.log('Banco de dados conectado!'));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('Servidor Rodando');
  console.log(`PORT: ${port}`);
});
