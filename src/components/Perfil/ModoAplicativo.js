import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, PermissionsAndroid, Dimensions} from 'react-native';
// import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNRestart from 'react-native-restart';
import EstadoApp from '../../services/sqlite/EstadoApp';
import database from '@react-native-firebase/database';

import serverConfig from '../../../config/config.json';

const {height,width} = Dimensions.get('screen')

function ModoAplicativo(){
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);

  const [message, setMessage] = useState('');
  const [modoApp, setModoApp] = useState('');
  const [infoCarregadas, setInfoCarregadas] = useState(false);
  const [cidade, setCidade] = useState(null);
  const [estado, setEstado] = useState(null);
  const [trocaLiberada, setTrocaLiberada] = useState(null);
  
  const userID = auth().currentUser.uid;

  function carregarInformacoes(){
    EstadoApp.findData(1).then(
      info =>{
        setCidade(info.cidade);
        setEstado(info.estado);
        setInfoCarregadas(true);
      }
    ).catch(err=> console.log(err));
  }

  // const trocaDeModoLiberada = async(modo)=>{
  //   const reference = database().ref(`${estado}/${cidade}/${modo}/${userID}`);
  //   try{  
  //     reference.once('value').then(snapshot=>{
  //       if (snapshot.exists()){
  //         setTrocaLiberada(false);
  //         // setModalAlert(true);
  //       }else{
  //         setTrocaLiberada(true);
  //       }
  //     })
  //   }catch(error){
  //     console.log(error);
  //   }
  // }

  //Nesse caso, não tem problema realizar a troca de modo sem verificar, pois a fila do RabbitMQ
  //não é durável, logo, um passageiro pode virar motorista sem persistir as informações no "banco de dados".
  const trocaDeModoLiberada = async(modo)=>{
    setTrocaLiberada(true);
  }

  // const modoAtuacao = async()=>{
  //   firestore().collection('Users').doc(userID).get().then(doc=>{
  //     if (doc && doc.exists){
  //       if (doc.data().motorista == true){
  //         setModoApp('motorista');
  //         setMessage('passageiro');
  //         trocaDeModoLiberada('Passageiros');
  //       }else{
  //         setModoApp('passageiro');
  //         setMessage('motorista');
  //         trocaDeModoLiberada('Motoristas');
  //       }
  //     }
  //   })
  // }
  

  const modoAtuacao = async()=>{
    let reqs = await fetch(serverConfig.urlRootNode+`buscarUsuario/${userID}`,{
      method: 'GET',
      mode: 'cors',
      headers:{
        'Accept':'application/json',
        'Content-type':'application/json'
      }
    });
    const res = await reqs.json();
    if (res != 'Falha'){
      if (res.motorista == true){
        setModoApp('motorista');
        setMessage('passageiro');
        trocaDeModoLiberada('Passageiros');
      }else{
        setModoApp('passageiro');
        setMessage('motorista');
        trocaDeModoLiberada('Motoristas');
      }
    }
  }

    //
    const atualizarModoApp = async(motorista)=>{
      console.log('atualizarModoApp');
         let reqs = await fetch(serverConfig.urlRootNode+'atualizarModoApp',{
          method: 'PUT',
          headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
          },
          body: JSON.stringify({
            id: userID,
            motorista:motorista
          })
        });
        // let res = await reqs.json();
        // console.log('req:', res);
        // console.log('passou!');
    }
    //


  const navegarParaPassageiro = async()=>{
    await trocaDeModoLiberada('Motoristas');
    console.log('troca liberada?', trocaLiberada);
    if (trocaLiberada){
      console.log('pode trocar!')
      try{
        await atualizarModoApp(false);
        // await firestore().collection('Users').doc(userID).update({
        //   motorista: false
        // })
        setModalVisible(!modalVisible);
        RNRestart.Restart();
      }catch(error){
        console.log('erro em navegarParaPassageiro');
      }
    }else{
      setModalVisible(!modalVisible);
      setModalAlert(true);
      
      console.log("não pode trocar!");
    }
  }
  
  const navegarParaMotorista = async()=>{
    await trocaDeModoLiberada('Passageiros');
    console.log('troca liberada?', trocaLiberada);
    if (trocaLiberada){
      try{
        // await firestore().collection('Users').doc(userID).update({
        //   motorista: true
        // })
        await atualizarModoApp(true);
        setModalVisible(!modalVisible);
        RNRestart.Restart(); 
      }catch(error){
        console.log('erro em navegarParaMotorista');
      }   
    }else{
      setModalVisible(!modalVisible);
      setModalAlert(true);
      console.log("não pode trocar!");
    }
  }

  useEffect(()=>{
    modoAtuacao();
  });

  useEffect(()=>{
    if (!infoCarregadas){
      carregarInformacoes();
    }
  })
  
  return (
    <SafeAreaView>
      <TouchableOpacity 
        style={{position: 'absolute', top:height*0.17, backgroundColor: '#FF5F55', width: width*0.5, height: height*0.05, borderWidth: 1, borderColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems:'center', alignSelf: 'center'}}
        onPress={()=>{
          setModalVisible(!modalVisible)
          console.log('modoApp:', modoApp);
        }}  
      >
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: width*0.04}}>Modo {modoApp}</Text>
      </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {setModalVisible(!modalVisible);}}
        >
          <TouchableOpacity 
            style={{position: 'absolute', top:height*0.223, backgroundColor: '#FF5F55', width: width*0.5, height: height*0.05, borderWidth: 1, borderColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems:'center', alignSelf: 'center'}}
            onPress={()=>{
              console.log('modo app!', message);
              if (message == 'passageiro'){
                navegarParaPassageiro();
                // setModalVisible(!modalVisible);
                // RNRestart.Restart();
              }else{
                navegarParaMotorista();
                // setModalVisible(!modalVisible);
                // RNRestart.Restart();
              }
            }}  
          >
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: width*0.04}}>Modo {message}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{position: 'absolute', top:height*0.273, backgroundColor: '#FF5F55', width: width*0.5, height: height*0.05, borderWidth: 1, borderColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems:'center', alignSelf: 'center'}}
            onPress={()=>{
              setModalVisible(!modalVisible)}}  
          >
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: width*0.04}}>Fechar</Text>
          </TouchableOpacity>
      </Modal>
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalAlert}
          onRequestClose={() => {setModalAlert(!modalAlert);}}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '50%', position: 'absolute', alignSelf: 'center'}}>
          <View style={styles.modalView}>
            <Text style={{color: 'black', textAlign: 'center', marginBottom: '5%', fontWeight:'600'}}>Ops...</Text>
            <Text style={{color: 'black', textAlign: 'center', marginBottom: '5%'}}>Finalize a viagem ou cancele a busca por carona/oferta antes de trocar de modo!</Text>
            <TouchableOpacity
              style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.04, borderRadius: 15, justifyContent: 'center'}}
              onPress={() => setModalAlert(!modalAlert)}
            >
              <Text style={styles.textStyle}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

export default ModoAplicativo;
