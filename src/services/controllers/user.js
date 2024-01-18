const model = require('../../../../models');

/*
    A função abaixo, cumpre os seguintes requisitos:
    - CADASTRAR USUÁRIO (PASSAGEIRO OU MOTORISTA).

    Cadastrar um usuário, sendo esse passageiro ou motorista.
    */
async function cadastrarUsuarioPublico(req, res) {
  try {
    let reqs = await model.PublicUser.create({
      id: req.body.id,
      nome: req.body.nome,
      email: req.body.email,
      universidade: req.body.universidade,
      classificacao: req.body.classificacao,
      fotoPerfil: req.body.fotoPerfil,
      motorista: req.body.motorista,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (reqs) {
      res.status(200).send(JSON.stringify('Usuário cadastrado com sucesso!'));
    } else {
      res.status(500).send(JSON.stringify('Falha ao cadastrar o usuário.'));
    }
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send(JSON.stringify('Erro interno ao cadastrar o usuário.'));
  }
}

async function cadastrarUsuarioPrivado(req, res) {
  try {
    let reqs = await model.PrivateUser.create({
      id: req.body.id,
      nome: req.body.nome,
      CPF: req.body.CPF,
      dataNasc: req.body.dataNasc,
      email: req.body.email,
      numCel: req.body.numCel,
      token: req.body.token,
      universidade: req.body.universidade,
      classificacao: req.body.classificacao,
      fotoPerfil: req.body.fotoPerfil,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (reqs) {
      res.status(200).send(JSON.stringify('Usuário cadastrado com sucesso!'));
    } else {
      res.status(500).send(JSON.stringify('Falha ao cadastrar o usuário.'));
    }
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send(JSON.stringify('Erro interno ao cadastrar o usuário.'));
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
async function buscarUsuarioPublico(req, res) {
  let reqs = await model.PublicUser.findByPk(req.params.id);
  if (reqs) {
    res.send(JSON.stringify(reqs));
  } else {
    //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
    res.send(JSON.stringify('Falha'));
  }
}

async function buscarUsuarioPrivado(req, res) {
  let reqs = await model.PrivateUser.findByPk(req.params.id);
  if (reqs) {
    res.send(JSON.stringify(reqs));
  } else {
    //RESPOSTA AO FRONT-END AQUI CASO DÊ ERRADO!
    res.send(JSON.stringify('Falha'));
  }
}

async function buscarPorEmailUsuarioPublico(req, res) {
  let reqs = await model.PublicUser.findAll({
    where: {
      email: req.params.email,
    },
  });
  if (reqs) {
    if (JSON.stringify(reqs).length == 2) {
      res.send(JSON.stringify('Não encontrou'));
    } else {
      res.send(JSON.stringify(reqs));
    }
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

async function buscarPorEmailUsuarioPrivado(req, res) {
  let reqs = await model.PrivateUser.findAll({
    where: {
      email: req.params.email,
    },
  });
  if (reqs) {
    if (JSON.stringify(reqs).length == 2) {
      res.send(JSON.stringify('Não encontrou'));
    } else {
      res.send(JSON.stringify(reqs));
    }
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

/*
    A função abaixo, cumpre os seguintes requisitos:
    - ATUALIZAR MODO APP (motorista:true ou false);
    
    Atualiza o modo de atuação no aplicativo com base no uid recebido.
    */
async function atualizarModoAppUsuarioPublico(req, res) {
  let reqs = await model.PublicUser.update(
    {
      motorista: req.body.motorista,
    },
    {
      where: {id: req.body.id},
    },
  );
  if (reqs) {
    res.send(JSON.stringify('Modo atualizado!'));
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

async function atualizarModoAppUsuarioPrivado(req, res) {
  let reqs = await model.PrivateUser.update(
    {
      motorista: req.body.motorista,
    },
    {
      where: {id: req.body.id},
    },
  );
  if (reqs) {
    res.send(JSON.stringify('Modo atualizado!'));
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

async function atualizarTokenUsuarioPublico(req, res) {
  let reqs = await model.PublicUser.update(
    {
      token: req.body.token,
    },
    {
      where: {id: req.body.id},
    },
  );
  if (reqs) {
    res.send(JSON.stringify('Token atualizado!'));
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

async function atualizarTokenUsuarioPrivado(req, res) {
  let reqs = await model.PrivateUser.update(
    {
      token: req.body.token,
    },
    {
      where: {id: req.body.id},
    },
  );
  if (reqs) {
    res.send(JSON.stringify('Token atualizado!'));
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

async function atualizarClassificacaoUsuarioPublico(req, res) {
  let reqs = await model.PublicUser.update(
    {
      classificacao: req.body.classificacao,
    },
    {
      where: {id: req.body.id},
    },
  );
  if (reqs) {
    res.send(JSON.stringify('Classificação atualizada!'));
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

async function atualizarClassificacaoUsuarioPrivado(req, res) {
  let reqs = await model.PrivateUser.update(
    {
      classificacao: req.body.classificacao,
    },
    {
      where: {id: req.body.id},
    },
  );
  if (reqs) {
    res.send(JSON.stringify('Classificação atualizada!'));
  } else {
    res.send(JSON.stringify('Falha'));
  }
}

module.exports = {
  cadastrarUsuarioPublico,
  cadastrarUsuarioPrivado,
  buscarUsuarioPublico,
  buscarUsuarioPrivado,
  buscarPorEmailUsuarioPublico,
  buscarPorEmailUsuarioPrivado,
  atualizarModoAppUsuarioPublico,
  atualizarModoAppUsuarioPrivado,
  atualizarTokenUsuarioPublico,
  atualizarTokenUsuarioPrivado,
  atualizarClassificacaoUsuarioPublico,
  atualizarClassificacaoUsuarioPrivado,
};

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
