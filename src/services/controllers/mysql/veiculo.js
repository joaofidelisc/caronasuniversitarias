const model = require('../../../../models');

    
    // CADASTRAR VEICULO;
    async function cadastrarVeiculo(req, res){
        let reqs = await model.Veiculo.create({
            'userId': req.body.userId,
            'nomeVeiculo': req.body.nomeVeiculo,
            'anoVeiculo': req.body.anoVeiculo,
            'corVeiculo': req.body.corVeiculo,
            'placaVeiculo': req.body.placaVeiculo,
            'createdAt': new Date(),
            'updatedAt': new Date(),
        });
        if (reqs){
            res.send(JSON.stringify('Veículo cadastrado com sucesso!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }
    
    
    // LER NOME DO CARRO DO MOTORISTA;
    // LER PLACA DO CARRO DO MOTORISTA;
    async function buscarVeiculo(req, res){
        let reqs = await model.Veiculo.findAll({
            where: {
                userId: req.params.userId
            }
        });
        if (reqs){
            if (JSON.stringify(reqs).length == 2){
                res.send(JSON.stringify('Não encontrou'));
            }else{
                res.send(JSON.stringify(reqs));
            }
        }else{
            res.send(JSON.stringify('Falha'));
        }       
    }
    
    
    async function atualizarPlacaVeiculo(req, res){
        let reqs = await model.Veiculo.update({
            'motorista': req.body.motorista,
        },{
            where: {'id': req.body.id}
        });
        if (reqs){
            res.send(JSON.stringify('Placa atualizada!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }

    
    async function atualizarAnoVeiculo(req, res){
        let reqs = await model.Veiculo.update({
            'token': req.body.token,
        },{
            where: {'id': req.body.id}
        });
        if (reqs){
            res.send(JSON.stringify('Ano atualizado!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }


    async function atualizarCorVeiculo(req, res){
        let reqs = await model.Veiculo.update({
            'classificacao': req.body.classificacao,
        },{
            where: {'id': req.body.id}
        });
        if (reqs){
            res.send(JSON.stringify('Cor atualizada!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }


    async function atualizarNomeVeiculo(req, res){
        let reqs = await model.Veiculo.update({
            'classificacao': req.body.classificacao,
        },{
            where: {'id': req.body.id}
        });
        if (reqs){
            res.send(JSON.stringify('Nome atualizado!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }


    module.exports = {
        cadastrarVeiculo,
        buscarVeiculo,
        atualizarPlacaVeiculo,
        atualizarAnoVeiculo,
        atualizarCorVeiculo,
        atualizarNomeVeiculo
    }