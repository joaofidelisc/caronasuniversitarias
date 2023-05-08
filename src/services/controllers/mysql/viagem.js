const model = require('../../../../models');

async function cadastrarViagem(req, res){
    let reqs = await model.Viagem.create({
        'uidMotorista': req.body.uidMotorista,
        'dataViagem': req.body.dataViagem,
        'createdAt': new Date(),
        'updatedAt': new Date(),
    });
    if (reqs){
        res.send(JSON.stringify('Viagem inserida com sucesso!'));
    }else{
        res.send(JSON.stringify('Falha'));
    }
}


async function buscarUltimaViagem(req, res){
    const viagem = await model.Viagem.findOne({
        where: {
            uidMotorista: req.params.uidMotorista,
        },
        order: [['createdAt', 'DESC']]
    });
    if (viagem){
        res.send(viagem);
    }else{
        res.send(JSON.stringify('Falha'));
    }
}


async function contarViagens(req, res){
    const count = await model.Viagem.count({
        where: {
            uidMotorista: req.params.uidMotorista,
        }
    });
    if (count){
        res.json({count});
        // console.log('count:', count);
    }else{
        res.json({count:0});
        // console.log('deu ruim!');
        // res.status(404).send({error: 'Viagem not found'});
    }
}

//contar o número de viagens que um motorista fez;

module.exports = {
    cadastrarViagem,
    buscarUltimaViagem,
    contarViagens
}