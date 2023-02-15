const express = require ('express')
const http = require('http')
//import {Server} from "socket.io"
//const serverHttp = require ('./src/services/Socketio/http');
//const websocket = require ('./src/services/Socketio/Websocket');
//serverHttp.listen(3000, () => console.log ("server on na porta 3000"));



const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Usuário conectado');
  /*
  Nesta parte do código, é registrado um ouvinte de eventos chamado 
  'loop' no socket do cliente. Quando o evento 'loop' é disparado pelo 
  cliente, o servidor inicia um loop que envia números incrementais para
  o cliente a cada segundo usando o evento 'numero'. O loop é executado
  20 vezes e é interrompido quando o número chega a 20.
  
  */
  socket.on('loop', () => {
    let n = 0;
    const intervalId = setInterval(() => {
      socket.emit('numero', n);
      console.log('Número enviado: ' + n);
      n++;
      if (n > 20) {
        clearInterval(intervalId);
      }
    }, 1000);
  });
  
  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

/* 
Criada a rota raiz do aplicativo e é registrada
uma função de retorno de chamada para lidar com solicitações nessa rota.
A função de retorno de chamada define os cabeçalhos HTTP necessários para
manter uma conexão persistente entre o cliente e o servidor. 
Quando um cliente se conecta ao servidor, o servidor registra a conexão 
e imprime uma mensagem de log indicando que um usuário foi conectado. 
Além disso, o servidor registra um ouvinte para o evento "numero" que é 
enviado pelo cliente. Quando o servidor recebe um evento "numero" do 
cliente, ele grava o número recebido no corpo da resposta HTTP e o 
envia de volta ao cliente.


*/
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive'); //manter conexão
  res.flushHeaders();

  io.on('connection', (socket) => {
    console.log('Usuário conectado');
    socket.on('numero', (data) => {
      console.log('Mensagem recebida: ' + data);
      res.write(`Número: ${data}\n`);
    });
    socket.on('disconnect', () => {
      console.log('Usuário desconectado');
    });
  });
});

server.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});

//implementar o front - evnt source 











