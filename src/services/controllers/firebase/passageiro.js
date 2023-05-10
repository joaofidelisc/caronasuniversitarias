const { database } = require('firebase/database');



function buscarCarona(req, res){
    console.log('rodando buscar carona!');
    console.log('estado:', req.params.estado);
    console.log('cidade:', req.params.cidade);
    console.log('currentUser:', req.params.currentUser);
    const reference = database.ref(`SP/Bebedouro/Passageiros/SeTTDbcdR6dyaTpNPruCrqVn0qm1`); 
    // console.log('reference:', reference);
    // try{
    //   reference.on('value', function(snapshot){
    //     console.log('alterou!!');
    //   })
    // } catch(error){
    //   console.log('Error', error.code);
    // }
}

module.exports = {
  buscarCarona,
}