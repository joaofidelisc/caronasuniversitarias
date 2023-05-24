const express = require('express');
const routes = express.Router();
const admin = require('firebase-admin');
var passengerFunctions = require('../controllers/firebase/passageiro.js');

// routes.get("/buscarCarona/:estado/:cidade/:currentUser", passengerFunctions.buscarCarona)
routes.get("/buscarCarona/:estado/:cidade/:currentUser", (req, res)=>{
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    'Connection': 'keep-alive',
  });
  const estado = req.params.estado;
  const cidade = req.params.cidade;
  const currentUser = req.params.currentUser;
  const db = admin.database();
  const reference = db.ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
  try{
    reference.on('value', function(snapshot){
      if(snapshot.child('ofertasCaronas').exists()){
        if (snapshot.val().ofertasCaronas != '' && snapshot.val().ofertasCaronas != null && snapshot.val().ofertasCaronas != undefined){
          res.write('event: encontrouCarona\n');
          res.write('data: {"encontrouCarona": true}\n\n');
        } else{
          res.write('event: encontrouCarona\n');
          res.write('data: {"encontrouCarona": false}\n\n');
        }
      }
    })
  } catch(error){
    console.log('Error', error.code);
  }
})

routes.get("/motoristaMeBuscando/:estado/:cidade/:currentUser/:uidMotorista/:motoristaAcaminho", (req, res)=>{
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Accept',
      'Connection': 'keep-alive',
    });
    const estado = req.params.estado;
    const cidade = req.params.cidade;
    const currentUser = req.params.currentUser;
    const uidMotorista = req.params.uidMotorista;
    const motoristaAcaminho = req.params.motoristaAcaminho;
    const db = admin.database();
    const reference = db.ref(`${estado}/${cidade}/Motoristas/${uidMotorista}/buscandoCaronista`);
    try{
        reference.on('value', function(snapshot){
            if (snapshot.exists()){
                if (snapshot.val().includes(currentUser) && !motoristaAcaminho){
                    res.write('event: motoristaMeBuscando\n');
                    res.write('data: {"motoristaAcaminho": true}\n\n');
                }
            }
        })
    } catch(error){
      console.log('Error', error.code);
    }
  })

module.exports = routes;