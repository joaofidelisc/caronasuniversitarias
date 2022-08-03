import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, PermissionsAndroid} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import storage from '@react-native-firebase/storage';

import estilos from '../../estilos/estilos';
/*
  tentar inserir dados no firestore usando o UID, fica mais fácil depois pra fazer as operações de CRUD - João;
*/

function Perfil_Conta({navigation}){
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const [imageUser, setImageUser] = useState('../../assets/icons/user_undefined.png');
  
  //falta implementar aqui
  const signOutGoogle = async() =>{
    GoogleSignin.signOut().then(()=>{
      console.log('saiu');
    }).catch(error =>{
      // console.log(error.code);
      setWarning('Algum erro ocorreu.');
      setModalVisible(true);
    })
  }
  const receberFoto = async()=>{
    setMessage('Atualizar foto do perfil')
    setModalVisible(true);
  }
  
  const pickImageFromGalery = async()=>{
    const options = {
      mediaType: 'photo',
    }
    const result = await launchImageLibrary(options);
    if (result?.assets){
      setImageUser(result.assets[0].uri);
      console.log(imageUser);
      console.log(typeof(imageUser));
      return
    }
    //tratar excecao
  }

  const pickImageFromCamera = async()=>{
    const options = {
      mediaType: 'photo',
      saveToPhotos: false,
      cameraType: 'front',
      quality: 1, //qualiadade da imagem de 0 a 1
    }
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        result = await launchCamera(options);
        if (result?.assets){
          setImageUser(result.assets[0].uri);
          console.log(imageUser);
          console.log(typeof(imageUser));
          return
        }
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const testeStorage = async()=>{

    console.log('testando storage...');
    const reference = storage().ref('Perfil.jpg');
    const url = await storage().ref('Perfil.jpg').getDownloadURL();
    console.log(url);
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
        {/* <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}> */}
          <View style={[estilos.styleOne, {flex:0, backgroundColor:'white', height: '100%'}]}>
            <View style={estilos.retangulo}>
              <Text style={estilos.Style2}>Perfil</Text>
              <TouchableOpacity 
                style={{position: 'absolute', top:30, alignSelf: 'center'}}
                onPress={receberFoto}  
              >
                <Image 
                  source={ 
                  require('../../assets/icons/user_undefined.png')} 
                  style={{height:100, width: 100}}  
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{position: 'absolute', top:30, alignSelf: 'center'}}
                onPress={receberFoto}  
              >
                <Image 
                    source={{uri:imageUser}}
                    style={{height:100, width: 100, borderRadius: 100}}  
                />
              </TouchableOpacity>
            </View>
            <Text style={{position: 'absolute', left: 25, top: 200, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Avaliação</Text>
              <Text style={{position: 'absolute', left: 40, top: 230, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Avaliações</Text>
              <Text style={{position: 'absolute', left: 40, top: 260, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Feedback</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 290, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Preferências</Text>
              <Text style={{position: 'absolute', left: 40, top: 320, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Alterar senha</Text>
              <Text style={{position: 'absolute', left: 40, top: 350, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Notificações</Text>
              <Text style={{position: 'absolute', left: 40, top: 380, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Endereço</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 410, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
              <Text style={{position: 'absolute', left: 40, top: 440, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Métodos de pagamento</Text>
              <Text style={{position: 'absolute', left: 40, top: 470, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 500, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Sobre</Text>
              <Text style={{position: 'absolute', left: 40, top: 530, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Ajuda</Text>
              <Text style={{position: 'absolute', left: 40, top: 560, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Termos de uso</Text>
              <Text style={{position: 'absolute', left: 40, top: 590, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Licença</Text>      
            <TouchableOpacity 
              style={[estilos.TouchbleOpct1, {top:620}]}
              onPress={testeStorage}
            >
              <Text style={estilos.Text14}>Teste Storage</Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
            >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: -10, left:210, alignSelf: 'center'}}>
                    <Text style={{color: 'white', textAlign: 'center', marginBottom: 5, fontSize:12, fontWeight: '500'}}>{message}</Text>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 120, height: 30, borderRadius: 15, justifyContent: 'center', borderColor:'white', borderWidth:1}}
                        onPress={pickImageFromGalery}
                    >
                        <Text style={styles.textStyle}>+ Carregar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 120, height: 30, borderRadius: 15, justifyContent: 'center', borderColor:'white', borderWidth:1, marginTop:5}}
                        onPress={pickImageFromCamera}
                    >
                        <Text style={styles.textStyle}>Tirar foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 120, height: 30, borderRadius: 15, justifyContent: 'center', marginTop: 5, borderColor:'white', borderWidth:1}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Confirmar</Text>
                    </TouchableOpacity>
            </View>
          </Modal>
          </View>
    {/* </View> */}
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

export default Perfil_Conta;
