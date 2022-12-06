const express = require('express');
const app = express();
const port = 8000;

app.get('/', (req, res) =>{
    res.send('Hello World, sejam todos bem-vindos ao servidor!');
})

app.listen(port, ()=>{
    console.log('Servidor iniciado com sucesso!');
})