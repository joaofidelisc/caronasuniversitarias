
// FUNÇÕES NECESSÁRIAS:

// ATUALIZAR HISTÓRICO DE VIAGENS PASSAGEIRO(
//     UIDMOTORISTA;
//     DATAVIAGEM;
//     NOME DO MOTORISTA;
//     DESTINO DO PASSAGEIRO;
//     LINK DA FOTO DE PERFIL DO MOTORISTA;
//     REFERENCIA DA VIAGEM;
//     )
    
// ATUALIZAR HISTÓRICO DE VIAGENS MOTORISTA(
//     ?
// )


const model = require('../../../models');

async function getUidMotorista(req, res){
    let reqs = await model.viagem.findAll({
        where: {
            userId: req.params.userId
        }
    });
    if (reqs){
        res.send(JSON.stringify(reqs));
    }else{
        //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
        res.send(JSON.stringify('Falha'));
    }        
}

async function getDataViagem(req, res){
    let reqs = await model.viagem.findAll({
        where: {
            userId: req.params.dataViagem
        }
    });
    if (reqs){
        res.send(JSON.stringify(reqs));
    }else{
        //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
        res.send(JSON.stringify('Falha'));
    }        
}
