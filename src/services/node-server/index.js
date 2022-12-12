//Constantes
const express = require('express');

//Trabalha com requisiões post
const bodyParser=require('body-parser');

const cors = require('cors');

const model = require('../../../models');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Rotas
app.get("/", async(req, res) =>{
    res.send("Página inicial!")
});


app.post('/cadastrar', async(req, res)=>{
    let reqs = await model.User.create({
        'userId': req.body.userId,
        'nome': req.body.nome,
        'CPF': req.body.CPF,
        'dataNasc': req.body.dataNasc,
        'email': req.body.email,
        'numCel': req.body.numCel,
        'token': req.body.token,
        'universidade': req.body.universidade,
        'classificacao': req.body.classificacao,
        'fotoPerfil': req.body.fotoPerfil,
        'motorista': req.body.motorista,
        'createdAt': new Date(),
        'updatedAt': new Date(),
    });
    if (reqs){
        res.send(JSON.stringify('Usuário cadastrado com sucesso'));
    }
})

app.get('/retornarEmails', async(req, res)=>{
    let reqs = await model.User.findAll({
        attributes: ['email']
    });
    if (reqs){
        res.send(JSON.stringify(reqs));
    }
})

// app.get('/')

let port = process.env.PORT || 8000;

app.listen(8000, (req, res)=>{
    console.log('Servidor Rodando');
    console.log('PORT:', port);
});

//como fazer uma resposta do backend para o front end?