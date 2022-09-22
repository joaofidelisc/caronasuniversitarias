import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Modal, StyleSheet} from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';



function ConfirmarSolicitacao({navigation, route}) {

  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');
  
  
  const vetorCaronistas = [];
  
  const nomeDestino = route.params?.nomeDestino;
  const localDestino = route.params?.localDestino;
  const cidade = route.params?.cidade; 
  const estado = route.params?.estado;

  

  // function testandoBD(){
  //   const currenteUser = 'sqmtE3QOReXfNemiKDZWup00HYo1';
  //   const reference = database().ref(`Passageiros/${currenteUser}`);
  //   try{
  //     reference.set({
  //       latitudePassageiro:-21.98561,
  //       longitudePassageiro:-47.895,
  //       latitudeDestino:'',
  //       longitudeDestino:'',
  //       nomeDestino:'',
  //       ativo:true,
  //     }).then(()=>console.log('coordenadas passageiro enviadas!'));
  //   }catch(error){
  //     console.log('ERRO', error.code);
  //   }
  // }

  // function atualizaCaronistas(){
  //   try{
  //     database().ref().child('Passageiros').on('value', function(snapshot){
  //       snapshot.forEach(function(userSnapshot){          
  //         if (vetorCaronistas.length == 0){
  //           vetorCaronistas.push({
  //             latitude: userSnapshot.val().latitudePassageiro,
  //             longitude: userSnapshot.val().longitudePassageiro,
  //             uid: userSnapshot.key,
  //           })
  //         } else{
  //           const estaPresente = vetorCaronistas.some(caronista=>{
  //             if (caronista.uid === userSnapshot.key){
  //               vetorCaronistas[vetorCaronistas.indexOf(caronista)].latitude = userSnapshot.val().latitudePassageiro;
  //               vetorCaronistas[vetorCaronistas.indexOf(caronista)].longitude = userSnapshot.val().longitudePassageiro;
  //               return true;
  //             }
  //             return false;
  //           })
  //           if (!estaPresente){
  //             vetorCaronistas.push({
  //               latitude: userSnapshot.val().latitudePassageiro,
  //               longitude: userSnapshot.val().longitudePassageiro,
  //               uid: userSnapshot.key,
  //             })
  //           }
  //         }
  //         console.log('Vetor atualizado:\n');
  //         console.log(vetorCaronistas);
  //       })
  //     })
  //   }catch(error){
  //     console.log('ERRO', error.code);
  //   }
  // }

    function enviarDestinoPassageiro(){
    const currentUser = auth().currentUser.uid;
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
      try{
        reference.update({
          // latitudeDestino:localDestino.latitude,
          latitudeDestino:localDestino.latitude,
          longitudeDestino:localDestino.longitude,
          nomeDestino: nomeDestino,
          ativo: true,
        }).then(()=>console.log('Destino enviado!'));
      }catch(error){
        console.log('ERRO:', error.code);
      }
    }

    function buscarCarona(){
      setModalVisible(!modalVisible);
      enviarDestinoPassageiro();
      navigation.navigate('Buscando_Carona', {estado: estado, cidade: cidade});
      //enviar para banco de dados as informações de carona!
    }

    useEffect(()=>{
      console.log('Confirmar solicitação!');
    }, [])

  return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
            <Text style={{color:'#06444C', position: 'absolute', top:350, fontWeight:'700', fontSize: 18, lineHeight:24, textAlign:'center'}}>Confirme as informações da sua viagem</Text>
            <Image source={
              require('../../assets/images/confirmar_destino.png')} 
              style={{height:400, width: 400, position: 'absolute', top: 0, alignSelf: 'center'}}  
            />
            <Text style={{color:'#06444C', position: 'absolute', top:390, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Destino:</Text>
            <Text style={{color:'#06444C', position: 'absolute', top:420, fontWeight:'600', fontSize: 14, lineHeight:24, textAlign:'center'}}>{nomeDestino}</Text>
        
            <TouchableOpacity
              style={{position: 'absolute', backgroundColor: '#FF5F55', top: 500, width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
              onPress={()=>{setModalVisible(true)}}
            >
                <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
                  Confirmar
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{position: 'absolute', backgroundColor: '#FF5F55', top: 580, width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
              onPress={()=>navigation.navigate('Buscar')}
            >
                <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
                  Alterar informações
                </Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
            >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15, fontWeight:'600'}}>Informações importantes</Text>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>Após pressionar o botão 'Buscar Carona', aguarde no local que você está.{'\n\n'} Facilite o caminho do motorista até você!</Text>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        // onPress={() => setModalVisible(!modalVisible)}
                        onPress={buscarCarona}
                    >
                        <Text style={styles.textStyle}>Buscar carona</Text>
                    </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  btnFechar:{
    position: 'absolute',
    width: 14,
    height: 29,
    left: 22,
    top: 20,
  },
  txtBtnFechar:{
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 29,
    alignItems: 'center',
    color: '#FF5F55',
  },
});


export default ConfirmarSolicitacao;