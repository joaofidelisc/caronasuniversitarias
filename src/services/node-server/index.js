//Constantes
const express = require('express');

//Trabalha com requisiões post
const bodyParser=require('body-parser');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Rotas
app.get("/", async(req, res) =>{
    res.send("Página inicial!")
});


app.post('/cadastrar', async(req, res)=>{
    console.log(req.body.nome);
    // console.log('CRIAR!');
    res.send("Página add");
})

let port = process.env.PORT || 8000;

app.listen(8000, (req, res)=>{
    console.log('Servidor Rodando');
    console.log('PORT:', port);
});

//como fazer uma resposta do backend para o front end?