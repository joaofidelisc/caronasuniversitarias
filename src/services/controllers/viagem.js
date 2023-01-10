const model = require('../../../models');

//busca viagem por id do passageiro (ou motorista)
async function cadastrarViagem(req, res){
    let reqs = await model.Viagem.create({
        // 'id': req.body.id,
        'nomeMotorista': req.body.nome,
        'uidPassageiro1': req.body.uidPassageiro1,
        'uidPassageiro2': req.body.uidPassageiro2,
        'uidPassageiro3': req.body.uidPassageiro3,
        'uidPassageiro4': req.body.uidPassageiro4,
        'uidMotorista': req.body.uidMotorista,
        'fotoPerfil': req.body.fotoPerfil,
        'destino': req.body.destino,
        'dataViagem': req.body.dataViagem,
        'createdAt': new Date(),
        'updatedAt': new Date(),
    });
    if (reqs){
        res.send(JSON.stringify('Viagem inserida com sucesso!'));
    }else{
        //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
        res.send(JSON.stringify('Falha'));
    }
}


async function buscarViagem(req, res){
    let reqs = await model.Viagem.findAll({
        where: {
           uidPassageiro1:req.params.uidPassageiro1,
           uidPassageiro2:req.params.uidPassageiro1,
           uidPassageiro3:req.params.uidPassageiro1,
           uidPassageiro4:req.params.uidPassageiro1,
           uidMotorista:req.params.uidPassageiro1,
        }
    });
    if (reqs){
        res.send(JSON.stringify(reqs));
    }else{
        //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
        res.send(JSON.stringify('Falha'));
    }        
}


async function contarViagens(req, res){
    let reqs = await model.Viagem.count({
        where: {
           uidPassageiro1:req.params.id,
           uidPassageiro2:req.params.id,
           uidPassageiro3:req.params.id,
           uidPassageiro4:req.params.id,
           uidMotorista:req.params.id,
        }
    });
    if (reqs){
        res.send(JSON.stringify(reqs));
    }else{
        //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
        res.send(JSON.stringify('Falha'));
    }        
}


module.exports = {
    cadastrarViagem,
    buscarViagem,
    contarViagens
}