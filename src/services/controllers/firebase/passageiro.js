const admin = require('firebase-admin');

function buscarCarona(req, res) {
  console.log('entrando em buscar carona...');
  const estado = req.params.estado;
  const cidade = req.params.cidade;
  const currentUser = req.params.currentUser;
  console.log("estado:", estado, 'cidade:', cidade, 'currentUser:', currentUser);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept',
    'Connection': 'keep-alive',
  });

  const db = admin.database();
  const reference = db.ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
  try{
    console.log('try!');
    reference.on('value', function(snapshot){
      console.log('alterou');
      if(snapshot.child('ofertasCaronas').exists()){
        if (snapshot.val().ofertasCaronas != '' && snapshot.val().ofertasCaronas != null && snapshot.val().ofertasCaronas != undefined){
          console.log('opa, achou carona!');
          res.write('event: encontrouCarona\n');
          res.write('data: {"encontrouCarona": true}\n\n');
        } else{
          console.log('sem carona ainda');
          res.write('event: encontrouCarona\n');
          res.write('data: {"encontrouCarona": false}\n\n');
        }
        // return;
      }
    })
  } catch(error){
    console.log('Error', error.code);
  }
}

module.exports = {
  buscarCarona,
};
