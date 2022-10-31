import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, PermissionsAndroid, Dimensions} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';

const {height,width} = Dimensions.get('screen')

function ModoAplicativo(){
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [modoApp, setModoApp] = useState('');

  const modoAtuacao = async()=>{
    const userID = auth().currentUser.uid;
    firestore().collection('Users').doc(userID).get().then(doc=>{
      if (doc && doc.exists){
        if (doc.data().motorista == true){
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



  useEffect(()=>{
    modoAtuacao();
  });
  
  return (
    <SafeAreaView>
      <TouchableOpacity 
        style={{position: 'absolute', top:height*0.17, backgroundColor: '#FF5F55', width: width*0.5, height: height*0.05, borderWidth: 1, borderColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems:'center', alignSelf: 'center'}}
        onPress={()=>{setModalVisible(!modalVisible)}}  
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
            // onPress={()=>{setModalVisible(!modalVisible)}}  
          >
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: width*0.04}}>Modo {message}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{position: 'absolute', top:height*0.273, backgroundColor: '#FF5F55', width: width*0.5, height: height*0.05, borderWidth: 1, borderColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems:'center', alignSelf: 'center'}}
            onPress={()=>{setModalVisible(!modalVisible)}}  
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
