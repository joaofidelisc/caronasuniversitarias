/*const express = require ('express')
const http = require('http')
const path = require('path')
const { Server } = require("socket.io");

const app = express();

app.use(express.static(path.join(__dirname, '.', "Socketio")))

const serverHttp = http.createServer(app); //criado o sv com o express p/ rotas e reaproveitado para o sv http

const io = new Server(serverHttp);

module.exports = serverHttp, io*/
  