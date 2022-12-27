const model = require('../../../models');

async function todosUsuarios(req, res){
    let reqs = await model.User.findAll();
    if (reqs){
        res.send(JSON.stringify(reqs));
    }
}

async function retornarEmails(req, res){
    let reqs = await model.User.findAll({
        attributes: ['email']
    });
    if (reqs){
        res.send(JSON.stringify(reqs));
    }
}

async function inserirUsuario(req, res){
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
        res.send(JSON.stringify('Usuário cadastrado com sucesso!'));
    }
}

/*
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
*/

module.exports = {
    todosUsuarios,
    retornarEmails,
    inserirUsuario
}