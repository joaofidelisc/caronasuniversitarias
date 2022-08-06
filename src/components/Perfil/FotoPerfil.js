import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, PermissionsAndroid} from 'react-native';


import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import estilos from '../../estilos/estilos';

import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

function FotoPerfil({navigation}){
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');

  const [alterar, setAlterar] = useState(false);
  const [imageUser, setImageUser] = useState('');
  
  const receberFoto = async()=>{
    setMessage('Atualizar foto do perfil')
    setModalVisible(true);
  }

  //envia a foto do usuário para o firebase (storage) com o formato uidPerfil
  const enviarFotoStorage = async(local)=>{
    const currentUser = await auth().currentUser.uid;
    var caminhoFirebase = currentUser.concat('Perfil');    
    const reference = storage().ref(caminhoFirebase);
    await reference.putFile(local);
  }
  
  const recuperarFotoStorage = async()=>{
    const currentUser = auth().currentUser.uid;
    var caminhoFirebase = currentUser.concat('Perfil');    
    var url = '';
    try{
      url = await storage().ref(caminhoFirebase).getDownloadURL();
      setImageUser(url); 
    } catch (error){
      if (error.code == 'storage/object-not-found'){
        url = await storage().ref('user_undefined.png').getDownloadURL(); 
        setImageUser(url); 
      }
    }
  }

  const pickImageFromGalery = async()=>{
    const options = {
      mediaType: 'photo',
    }
    const result = await launchImageLibrary(options);
    if (result?.assets){
      setAlterar(true);
      setImageUser(result.assets[0].uri);
      enviarFotoStorage(result.assets[0].uri);
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
    var result;
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
        // console.log("You can use the camera");
        result = await launchCamera(options);
        if (result?.assets){
          setAlterar(true);
          setImageUser(result.assets[0].uri);
          enviarFotoStorage(result.assets[0].uri);
          return
        }
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(()=>{
    if (alterar == false){
      recuperarFotoStorage();
    }
  })
  return (
    <SafeAreaView>
        <TouchableOpacity
          style={{position: 'absolute', top:30, alignSelf: 'center'}}
          onPress={receberFoto}  
        >
          <Image 
              source={
                imageUser!=''?{uri:imageUser}:null}
              style={{height:100, width: 100, borderRadius: 100}}  
          />
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

export default FotoPerfil;
