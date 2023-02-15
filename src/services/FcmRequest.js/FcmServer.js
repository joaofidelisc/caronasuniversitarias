const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const credentials = require('../../../android/app/google-services.json')

// Inicialize o Firebase com suas credenciais
firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  databaseURL: ""
  });
  

app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("bem vindo-a");
})
app.post('/sendNotification', (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const token = req.body.token;
  res.send(title, body, token);
  // Criar a mensagem de notificação
  
  const message = {
    token: 'passar aqui o token',
    notification: {
      title: 'Notification Title',
      body: 'Notification Body'
    }
  };

  // Enviar a mensagem de notificação
  firebase.messaging().send(message)
    .then(response => {
      res.status(200).send({ message: 'Notification sent successfully' });
    })
    .catch(error => {
      res.status(500).send({ error: error });
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}/`);
});