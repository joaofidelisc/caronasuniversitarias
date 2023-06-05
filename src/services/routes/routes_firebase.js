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
    });
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


routes.get("/viagemTerminou/:estado/:cidade/:currentUser/:uidMotorista", (req, res)=>{
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    'Connection': 'keep-alive',
  });

  const { estado, cidade, currentUser, uidMotorista } = req.params;
  console.log('estado:', estado, 'cidade:', cidade, 'currentUser:', currentUser, 'uidMotorista');
  const db = admin.database();
  const reference = db.ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
  const reference_motorista = db.ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);

  try {
    reference_motorista.once('value', function(snapshot){
      if (snapshot.exists()){
        res.write('event: viagemTerminou\n');
        res.write('data: {"viagemTerminou": false}\n\n');
      } else {
        res.write('event: viagemTerminou\n');
        res.write('data: {"viagemTerminou": true}\n\n');
      }
    })
  } catch(error) {
    console.log(error);
  }

  try {
    reference.on('value', function(snapshot){
      console.log('finalizar2');
      if(snapshot.child('viagemTerminou').exists()){
        if (snapshot.val().viagemTerminou != false && snapshot.val().viagemTerminou != undefined){
          res.write('event: viagemTerminou\n');
          res.write('data: {"viagemTerminou": true}\n\n');
        } 
      }
    })
  } catch(error) {
    console.log('Error', error.code);
  }
});

routes.get("/getCaronistasMarker/:estado/:cidade", (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    'Connection': 'keep-alive',
  });

  let jaExiste = false;
  if (jaExiste == true){
    jaExiste = false;
  }
  let filhoRemovido = '';
  if (filhoRemovido != ''){
    filhoRemovido = '';
  }

  const { estado, cidade } = req.params;

  const db = admin.database();
  const reference = db.ref().child(`${estado}/${cidade}/Passageiros`); 

  try {
    reference.on('child_removed', function(snapshot){
      setCaronistas(vetorCaronistas.filter((uid)=>(uid.uid != snapshot.key)));
    })
    reference.on('value', function(snapshot){
      if (snapshot.exists()){
        snapshot.forEach(function(userSnapshot){       
          if (vetorCaronistas.length == 0){
            setCaronistas([{
              latitude: userSnapshot.val().latitudePassageiro,
              longitude: userSnapshot.val().longitudePassageiro,
              uid: userSnapshot.key,  
              caronasAceitas: userSnapshot.val().caronasAceitas,        
              }
            ])
          }
          else{
            vetorCaronistas.some(caronista=>{
              if (caronista.uid === userSnapshot.key){
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].latitude = userSnapshot.val().latitudePassageiro;
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].longitude = userSnapshot.val().longitudePassageiro;
                jaExiste = true;
              }
            })
            if (!jaExiste){
              setCaronistas([...vetorCaronistas, {
                latitude: userSnapshot.val().latitudePassageiro,
                longitude: userSnapshot.val().longitudePassageiro,
                uid: userSnapshot.key,
                caronasAceitas: userSnapshot.val().caronasAceitas,      
                }
              ])
            }
          }
        })
      }
    })
}catch(error){
  console.log(error);
}
});

routes.get("/caronasAceitas/:estado/:cidade/:currentUser", (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    'Connection': 'keep-alive',
  });

  const { estado,
          cidade, 
          currentUser, 
          oferecerMaisCaronas,
          vagasDisponiveis,
          numCaronasAceitas,
          ofertasAceitas,
          cancelarOferta,
          modalVisible,
        } = req.params;

  let strUIDs = '';
  let arrayUIDs = [];

  const db = admin.database();
  const reference = db.ref(`${estado}/${cidade}/Motoristas/${currentUser}/caronasAceitas`); 
  if (oferecerMaisCaronas){
    reference.on('value', function(snapshot){
      if (snapshot.val() != '' && snapshot.val() != undefined){
        if (vagasDisponiveis>numCaronasAceitas){
          if (!ofertasAceitas.includes(snapshot.val())){
            strUIDs = snapshot.val();
            arrayUIDs = strUIDs.split(', ');
            res.write('event: caronasAceitas\n');
            data = {
              "arrayOfertasAceitas": arrayUIDs,
              "ofertasAceitas": snapshot.val(),
              "numCaronasAceitas": arrayUIDs.length,
            }
            res.send(data);
            if (cancelarOferta){
              res.write('event: caronasAceitas\n');
              res.write('data: {"cancelarOferta": false}\n\n');
            }
          }else if (vagasDisponiveis == numCaronasAceitas){
            console.log('vagas esgotadas!');
          }
        }else{
          res.write('event: caronasAceitas\n');
          data = {
            "oferererMaisCaronas":false,
            "exibeModalOferecer": false,
            "modalVisible": !modalVisible,
          }
          res.send(data);
        }
      }else{
        //complementar essa função aqui;
        //não vai acontecer essa situação, mas quando zerar o vetor de caronasAceitas?
        data ={
          "numCaronasAceitas": 0,
        }
        res.write('event: caronasAceitas\n');
        res.send(data);
      }
    })  
  }
  
});

//linha 293 e 294

routes.get("/caronistasMarker/:estado/:cidade/:vetorCaronistas", (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    'Connection': 'keep-alive',
  });

  const { estado,
          cidade, 
          vetorCaronistas,
        } = req.params;

  let jaExiste = false;
  if (jaExiste == true){
      jaExiste = false;
  }
  let filhoRemovido = '';
  if (filhoRemovido != ''){
    filhoRemovido = '';
  }

  const db = admin.database();
  const reference = db.ref().child(`${estado}/${cidade}/Passageiros`);
  try{
    reference.on('child_removed', function(snapshot){
      vetorCaronistas = vetorCaronistas.filter((uid)=>(uid.uid != snapshot.key));
      data = { vetorCaronistas };
      res.write('event: getCaronistasMarker\n');
      res.send(data);
    })
    reference.on('value', function(snapshot){
      if (snapshot.exists()){
        snapshot.forEach(function(userSnapshot){       
          if (vetorCaronistas.length == 0){
            data = {
              latitudePassageiro: userSnapshot.val().latitudePassageiro,
              longitudePassageiro: userSnapshot.val().longitudePassageiro,
              uid: userSnapshot.key,  
              caronasAceitas: userSnapshot.val().caronasAceitas, 
            }
            res.write('event: getCaronistasMarker\n');
            res.send(data);
          }
          else{
            vetorCaronistas.some(caronista=>{
              if (caronista.uid === userSnapshot.key){
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].latitude = userSnapshot.val().latitudePassageiro;
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].longitude = userSnapshot.val().longitudePassageiro;
                jaExiste = true;
              }
            })
            if (!jaExiste){
              data = {
                latitudePassageiro: userSnapshot.val().latitudePassageiro,
                longitudePassageiro: userSnapshot.val().longitudePassageiro,
                uid: userSnapshot.key,
                caronasAceitas: userSnapshot.val().caronasAceitas, 
              }
              res.write('event: getCaronistasMarker\n');
              res.send(data);
            }
          }
        })
      }
    })
  } catch(erro){
    console.log(erro);
  }
});

module.exports = routes;