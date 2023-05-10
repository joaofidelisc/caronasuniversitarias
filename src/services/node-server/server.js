
const express = require('express');
var admin = require("firebase-admin");
var serviceAccount = require("../../../creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://caronasuniversitarias-c98eb-default-rtdb.firebaseio.com"
});

const routes_mysql = require('../routes/routes_mysql');
const routes_firebase = require('../routes/routes_firebase');
const db = require('../sequelize/index');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes_mysql);
app.use(routes_firebase);

db.sync(() => console.log('Banco de dados conectado!'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Servidor Rodando');
  console.log(`PORT: ${port}`);
});
