const model = require('../../../models');

async function cadastrarViagemPassageiro(req, res){
    let reqs = await model.PassageiroViagem.create({
        'userId': req.body.userId,
        'idViagem': req.body.idViagem,
        'destino': req.body.destino,
        'createdAt': new Date(),
        'updatedAt': new Date(),
    });
    if (reqs){
        res.send(JSON.stringify('Viagem inserida com sucesso!'));
    }else{
        res.send(JSON.stringify('Falha'));
    }
}

async function buscarViagemPassageiro(req, res){
    let reqs = await model.PassageiroViagem.findOne({
        where: {
          userId: req.params.userId,
          idViagem: req.params.idViagem
        }
    });
    if (reqs){
        res.send(JSON.stringify('Viagem inserida com sucesso!'));
    }else{
        res.send(JSON.stringify('Falha'));
    }
}

async function contarViagensPassageiro(req, res){
    const count = await model.PassageiroViagem.count({
        where: {
            userId: req.params.userId,
        }
    });
    if (count){
        res.json({count});
    }else{
        res.json({count:0});
    }
}

//contar o número de viagens que um passageiro fez;
module.exports = {
   cadastrarViagemPassageiro,
    buscarViagemPassageiro,
    contarViagensPassageiro
}