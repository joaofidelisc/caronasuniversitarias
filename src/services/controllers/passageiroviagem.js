const model = require('../../../models');
const { Op } = require("sequelize");

//busca viagem por id do passageiro (ou motorista)
async function cadastrarPassageiroViagem(req, res){
    let reqs = await model.Viagem.create({
        'uidMotorista': req.body.uidMotorista,
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


// async function buscarViagem(req, res){
//     let reqs = await model.Viagem.findAll({
//         where: {
//             [Op.or]: {
//                 uidPassageiro1:req.params.uidPassageiro1,
//                 uidPassageiro2:req.params.uidPassageiro1,
//                 uidPassageiro3:req.params.uidPassageiro1,
//                 uidPassageiro4:req.params.uidPassageiro1,
//                 uidMotorista:req.params.uidPassageiro1,
//             }
//         }
//     });
//     if (reqs){
//         res.send(JSON.stringify(reqs));
//     }else{
//         //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
//         res.send(JSON.stringify('Falha'));
//     }        
// }

// // async function buscarViagem(req, res){
// //     let reqs = await model.Viagem.findAll({
// //         where: {
// //            uidPassageiro1:req.params.uidPassageiro1,
// //            uidPassageiro2:req.params.uidPassageiro1,
// //            uidPassageiro3:req.params.uidPassageiro1,
// //            uidPassageiro4:req.params.uidPassageiro1,
// //            uidMotorista:req.params.uidPassageiro1,
// //         }
// //     });
// //     if (reqs){
// //         res.send(JSON.stringify(reqs));
// //     }else{
// //         //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
// //         res.send(JSON.stringify('Falha'));
// //     }        
// // }


// async function contarViagens(req, res){
//     let reqs = await model.Viagem.count({
//         where: {
//             [Op.or]:{
//                 uidPassageiro1:req.params.uidPassageiro1,
//                 uidPassageiro2:req.params.uidPassageiro1,
//                 uidPassageiro3:req.params.uidPassageiro1,
//                 uidPassageiro4:req.params.uidPassageiro1,
//                 uidMotorista:req.params.uidPassageiro1,
//             }
//         }
//     });
//     if (reqs){
//         res.send(JSON.stringify(reqs));
//     }else{
//         //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
//         res.send(JSON.stringify('Falha'));
//     }        
// }

// async function atualizarViagem(req, res){
//     let reqs = await model.Veiculo.update({
//         'dataViagem': req.body.dataViagem,
//         'nomeMotorista': req.body.nomeMotorista,
//         'destino': req.body.nomeDestino,
//         'fotoPerfilMotorista': req.body.fotoPerfilMotorista,
//     },{
//         where: 
//             {
//                 [Op.or]:{
//                     uidPassageiro1:req.params.uidPassageiro1,
//                     uidPassageiro2:req.params.uidPassageiro2,
//                     uidPassageiro3:req.params.uidPassageiro3,
//                     uidPassageiro4:req.params.uidPassageiro4,
//                     uidMotorista:req.params.uidMotorista,
//                 }
//             }
//     });
//     if (reqs){
//         res.send(JSON.stringify('Dados da viagem atualizados!'));
//     }else{
//         //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
//         res.send(JSON.stringify('Falha'));
//     }
// }


//     //criar uma função que busque a viagem mais recente do passageiro;
//     //BUSCA O CAMPO CREATED-AT ou UPDATED-AT;
// // uidMotorista: uidMotorista,
// //         dataViagem: data,
// //         nome: nomeMotorista,
// //         destino: nomeDestino,
// //         fotoPerfil: motoristaURL,



module.exports = {
    cadastrarPassageiroViagem,
    // buscarViagem,
    // contarViagens,
    // atualizarViagem
}