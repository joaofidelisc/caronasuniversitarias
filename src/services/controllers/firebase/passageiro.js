
// const database = require('@react-native-firebase/database');

function buscarCarona(estado, cidade, currentUser){
    console.log('rodando buscar carona!');
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
    try{
      reference.on('value', function(snapshot){
        console.log('alterou!!');
        if(snapshot.child('ofertasCaronas').exists()){
          if (snapshot.val().ofertasCaronas != '' && snapshot.val().ofertasCaronas != null && snapshot.val().ofertasCaronas != undefined){
            console.log('Encontrou carona!!');
            // setEncontrouCarona(true);
          } else{
            // setEncontrouCarona(false);
            console.log('não encontrou carona :(');
          }
        }
      })
    } catch(error){
      console.log('Error', error.code);
    }
}

module.exports = {
  buscarCarona,
}