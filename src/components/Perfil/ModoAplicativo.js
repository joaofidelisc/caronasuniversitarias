import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, PermissionsAndroid, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const {height,width} = Dimensions.get('screen')

function ModoAplicativo({navigation}){
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [modoApp, setModoApp] = useState('');


  const modoAtuacao = async()=>{
    const userID = auth().currentUser.uid;
    firestore().collection('Users').doc(userID).get().then(doc=>{
      if (doc && doc.exists){
        if (doc.data().nome_veiculo==""){
          console.log('NÃO TEM CADASTRO!');
        }
        if (doc.data().motorista == true){
          // await AsyncStorage.setItem('modoApp', 'passageiro');
          setModoApp('motorista');
          setMessage('passageiro');
          console.log('rodou!!')
        }else{
          setModoApp('passageiro');
          setMessage('motorista');
        }
      }
    })
  }
  
  const navegarParaPassageiro = async()=>{
    // await AsyncStorage.removeItem('modoApp');
    // await AsyncStorage.setItem('modoApp', 'passageiro');
    const userID = auth().currentUser.uid;
    try{
      await firestore().collection('Users').doc(userID).update({
        motorista: false
      })
    }catch(error){
      console.log('erro em navegarParaPassageiro');
    }
  }
  
  const navegarParaMotorista = async()=>{
    // await AsyncStorage.removeItem('modoApp');
    // await AsyncStorage.setItem('modoApp', 'motorista');
    const userID = auth().currentUser.uid;
    try{
      await firestore().collection('Users').doc(userID).update({
        motorista: true
      })
    }catch(error){
      console.log('erro em navegarParaMotorista');
    }    
  }

  useEffect(()=>{
    modoAtuacao();
  });

  // useEffect(()=>{
  //     const getModoApp = async()=>{
  //       let modoAppStorage = await AsyncStorage.getItem("modoApp");
  //       if (modoAppStorage == null && modoApp != ''){
  //         await AsyncStorage.setItem('modoApp', modoApp);  
  //       }
  //       console.log('modoAppStorage', modoAppStorage);
  //       console.log('modoApp', modoApp);
  //     }
  //     getModoApp();
  // },[modoApp]);
  
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
                RNRestart.Restart();
                console.log('navegar para passageiro!');
                // navigation.navigate("MenuPassageiro");
              }else{
                navegarParaMotorista();
                RNRestart.Restart();
                console.log('navegar para motorista!');
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
