const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port: 3306,
  database : 'caronasuniversitarias'
});

// Iniciando o app.
const app = express();

 try{ 
    // Criando uma rota GET que retorna os dados da tabela usuários.
    app.get('/users', function (req, res) {
    // Conectando ao banco.
    connection.connect(function (err) {
      
    // Executando a query MySQL (selecionar todos os dados da tabela usuário).
     connection.query('SELECT * FROM users', function (error, results, fields) { //select name, cpf From user - uso especifico
      // Caso ocorra algum erro, não irá executar corretamente.if (error) throw error;
      // Pegando a 'resposta' do servidor pra nossa requisição. Ou seja, aqui ele vai mandar nossos dados.
      res.send(results)
      console.log("Conexão com o servidor iniciada! - Pegando dados da tabela " + results)
    });
  });
});
}catch(err){
  console.log('Erro: ' + err + results);
}
// Iniciando o servidor//port .
app.listen(3000, () => {
 console.log('Vai no navegador e entra em http://localhost:3000/users pra ver os usuários cadastrados. OBS: A porta pode ser alterada!');
});
