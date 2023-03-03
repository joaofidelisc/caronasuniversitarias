const express = require('express');
const routes = require('../routes/routes.js');
const db = require('../sequelize/index.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const rabbitRoutes = require('../rabbitMQ/routesRabbit.js');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);
app.use('/api/rabbit', rabbitRoutes);

db.sync(() => console.log('Banco de dados conectado!'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Servidor Rodando');
  console.log(`PORT: ${port}`);
});
