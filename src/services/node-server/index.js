//Constantes
const express = require('express');

//Trabalha com requisições post
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
        'id': req.body.id,
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

// app.post('/cadastrarMotorista', async(req, res)=>{
//     let reqs = await model.Veiculo.create({
//         'userId': req.body.userId,
//         'nome': req.body.nome,
//         'CPF': req.body.CPF,
//         'dataNasc': req.body.dataNasc,
//         'email': req.body.email,
//         'numCel': req.body.numCel,
//         'token': req.body.token,
//         'universidade': req.body.universidade,
//         'classificacao': req.body.classificacao,
//         'fotoPerfil': req.body.fotoPerfil,
//         'motorista': req.body.motorista,
//         'createdAt': new Date(),
//         'updatedAt': new Date(),
//     });
//     if (reqs){
//         res.send(JSON.stringify('Usuário cadastrado com sucesso'));
//     }
// })

//eu faço um post pra retornar as informações passando os parametros que eu quero ou um get?
//tem como passar parametros pro get?

//
// app.get(`/retornarEmails/:${id}`, async(req, res)=>{
//     let reqs = await model.User.findAll({
//         attributes: ['email']
//     });
//     if (reqs){
//         res.send(JSON.stringify(reqs));
//     }
// })

app.put('/atualizarModo', async(req, res)=>{
    let reqs = await model.User.update({
        'motorista': req.body.motorista,
    },{
        where: {'userID': req.body.userId}
    });
    if (reqs){
        res.send(JSON.stringify('Modo atualizado!'));
    }
})

app.put('/atualizarToken', async(req, res)=>{
    let reqs = await model.User.update({
        'token': req.body.token,
    },{
        where: {'userID': req.body.userId}
    });
    if (reqs){
        res.send(JSON.stringify('Modo atualizado!'));
    }
})

// app.get('/')

let port = process.env.PORT || 8000;

app.listen(8000, (req, res)=>{
    console.log('Servidor Rodando');
    console.log('PORT:', port);
});

//como fazer uma resposta do backend para o front end?