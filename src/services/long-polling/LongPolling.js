/*
=====================================================================
                          LONG POLLING 
=====================================================================
A técnica de long polling é baseada em um tipo especial de solicitação
HTTP, chamado de "requisição pendente" (pending request) ou "requisição
de espera" (wait request), que é uma solicitação HTTP que permanece aberta
por um período prolongado de tempo (em contraste com a solicitação HTTP convencional, 
que é feita e respondida imediatamente). 
Quando o servidor tem novas informações para enviar, 
ele envia uma resposta para a solicitação pendente, que o cliente pode 
processar e exibir no navegador.

*/ 

/* 

Neste código: o long polling é implementado usando uma solicitação HTTP GET 
que permanece aberta por um longo período de tempo (DELAY). 
Quando um cliente faz uma solicitação GET para /date, o servidor 
adiciona a conexão do cliente a um array de conexões (connections). 
Quando o servidor tem novas informações para enviar, 
ele percorre o array de conexões e envia uma mensagem para cada conexão 
pendente, atualizando assim os clientes em tempo real.


*/

const express = require("express")

const LIMIT = 7;
const DELAY = 1000;

const app = express()

const connections = [] //Armazenar todas as conexões abertas.

app.get("/date", (req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8") //define o tipo de texto q será retornado
  res.setHeader("Transfer-Encoding", "chunked")
  
  /* 
    Método de codificação chunked permite que o servidor comece a enviar
    a resposta http sem saber seu tamanho total. 
    o conteúdo da resposta é dividido em uma 
    série de "chunks" ou blocos de tamanho variável.
    a conexão permanece aberta até que a última parte da resposta seja enviada.

    compatível com o uso do long polling para atualizações em tempo real.
  
  */

  connections.push(res) // Armazena a conexão atual no array de conexões.
})

let tick = 0;

setTimeout(function run() {
  console.log(tick)
  if(++tick > LIMIT){
    connections.map(res => {
      res.write("END\n")
      res.end()
    })
    connections = [];
    tick = 0
  }
  connections.map((res, i) => { //itera sobre cada conexão do array
    res.write(` 👌 👌 Hello ${i}! Tick: ${tick} \n`)
  })
  setTimeout(run, DELAY)
}, DELAY)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})