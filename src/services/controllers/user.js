    const model = require('../../../models');


    /*
    Dúvidas:

    ATUALIZAR NÚMERO DE VIAGENS REALIZADAS;
        - contar o número de linhas encontradas  ou criar uma coluna em user?
    */


    /*
    A função abaixo, cumpre os seguintes requisitos:
    - CADASTRAR USUÁRIO (PASSAGEIRO OU MOTORISTA).

    Cadastrar um usuário, sendo esse passageiro ou motorista.
    */
    async function cadastrarUsuario(req, res){
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
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }
    
    
    /*
    A função abaixo, cumpre os seguintes requisitos:
    - LER MODO DO APP; 
    - LER NOME DO MOTORISTA;
    - LER TOKEN;
    - LER CLASSIFICAÇÃO DO MOTORISTA;
    - LER NÚMERO DE VIAGENS REALIZADAS;
    - LER EMAIL -> é verificado se o usuário existe ou não pelo seu email.
    
    Busca um usuário com base em sua chave primária (id) e retorna todas as informações de usuário.
    */
    async function buscarUsuario(req, res){
        let reqs = await model.User.findByPk(req.params.id);
        if (reqs){
            res.send(JSON.stringify(reqs));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }
    
    
    async function buscarPorEmail(req, res){
        let reqs = await model.User.findAll({
            where:{
                'email': req.params.email
            }
        })
        if (reqs){
            res.send(JSON.stringify(reqs));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }


    /*
    A função abaixo, cumpre os seguintes requisitos:
    - ATUALIZAR MODO APP (motorista:true ou false);
    
    Atualiza o modo de atuação no aplicativo com base no uid recebido.
    */
   async function atualizarModoApp(req, res){
        let reqs = await model.User.update({
            'motorista': req.body.motorista,
        },{
            where: {'id': req.body.id}
        });
        if (reqs){
            res.send(JSON.stringify('Modo atualizado!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }
    
    
    
    async function atualizarToken(req, res){
        let reqs = await model.User.update({
            'token': req.body.token,
        },{
            where: {'id': req.body.id}
        });
        if (reqs){
            res.send(JSON.stringify('Token atualizado!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }
    
    async function atualizarClassificacao(req, res){
        let reqs = await model.User.update({
            'classificacao': req.body.classificacao,
        },{
            where: {'id': req.body.id}
        });
        if (reqs){
            res.send(JSON.stringify('Classificação atualizada!'));
        }else{
            //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
            res.send(JSON.stringify('Falha'));
        }
    }

    module.exports = {
        cadastrarUsuario,
        buscarUsuario,
        buscarPorEmail,
        atualizarModoApp,
        atualizarToken,
        atualizarClassificacao
    }

    //UserRepository;

    //controler->validar dados de entrada;
    //repositório->
    /*
        ex.: 
        let reqs = await model.User.update({
            'classificacao': req.body.classificacao,
        },{
            where: {'id': req.body.id}
        });
    */
    //pesquisar código de erros
    // http response status codes

    //distribuição automática das funcionalidades;
    