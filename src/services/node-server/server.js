

const express = require('express');
const routes = require('./src/services/routes/routes');
const db = require('./src/services/sequelize/index');

const bodyParser=require('body-parser');
const cors = require('cors');

const app = express();

//ignorar o cors quando for subir pro servidor
//ou aceitar requisições de server diferentes - fazer essa configuração;
app.use(cors());


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(routes);

db.sync(()=>console.log('Banco de dados conectado!'));

let port = process.env.PORT || 8000;

app.listen(8000, (req, res)=>{
    console.log('Servidor Rodando');
    console.log('PORT:', port);
});

