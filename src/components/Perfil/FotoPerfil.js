import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, PermissionsAndroid, Dimensions} from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { useCallback } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';


const {height,width} = Dimensions.get('screen')

function FotoPerfil({navigation}){
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');


  const [alterar, setAlterar] = useState(false);
  const [atualizouImagem, setAtualizouImagem] = useState(false);

  const [recuperouImagem, setRecuperouImagem] = useState(false);

  const [oldImageUser, setOldImageUser] = useState('');
  const [imageUser, setImageUser] = useState('');
  
  const isFocused = useIsFocused();

  const receberFoto = async()=>{
    setMessage('Atualizar foto do perfil')
    setModalVisible(true);
  }

  //envia a foto do usuário para o firebase (storage) com o formato uidPerfil
  const enviarFotoStorage = async(local)=>{
    const currentUser = auth().currentUser.uid;
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
        // url = await storage().ref('user_undefined.png').getDownloadURL(); 
        setImageUser(''); 
      }
    }
    setRecuperouImagem(true);
  }

  const pickImageFromGalery = async()=>{
    const options = {
      mediaType: 'photo',
    }
    const result = await launchImageLibrary(options);
    if (result?.assets){
      setAlterar(true);
      setImageUser(result.assets[0].uri);
      return;
    }else{
      return null;
    }
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
          title: "O aplicativo requer permissão para a camêra",
          message:
            "O aplicativo precisa de permissão para acessar a câmera " +
            "para que você consiga tirar fotos.",
          buttonNeutral: "Perguntar depois",
          buttonNegative: "Cancelar",
          buttonPositive: "Permitir"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        result = await launchCamera(options);
        if (result?.assets){
          setAlterar(true);
          setImageUser(result.assets[0].uri);
          
          return;
        }
      } else {
        console.log("Camera permission denied");
        return null;
      }
    } catch (err) {
      console.warn(err);
    }
  }


  useFocusEffect(
    useCallback(()=>{
      console.log('atualizando foto...');
      if (!recuperouImagem || atualizouImagem){
        recuperarFotoStorage();
      }
    }, [atualizouImagem])
  );


  return (
    <SafeAreaView>
        <TouchableOpacity
          style={{position: 'absolute', top:height*0.05, alignSelf: 'center'}}
          onPress={receberFoto}  
        >
          {
            imageUser != '' ?
            <Image 
                source={
                {uri:imageUser}}
                style={{height:height*0.1, width: height*0.1, borderRadius: 100}}  
            />:            
            <Icon name="user-circle"size={height*0.1} color = 'white'/>
          }
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {setModalVisible(!modalVisible);}}
        >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',  position: 'absolute', top: '2%', left:'60%', alignSelf: 'center'}}>
                <Text style={{color: 'white', textAlign: 'center', marginBottom: 5, fontSize:12, fontWeight: '500'}}>{message}</Text>
                <TouchableOpacity
                    style={{backgroundColor:'#FF5F55', width: '85%', height: '25%', borderRadius: 15, justifyContent: 'center', borderColor:'white', borderWidth:1}}
                    onPress={pickImageFromGalery}
                >
                    <Text style={styles.textStyle}>+ Carregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{backgroundColor:'#FF5F55', width: '85%', height: '25%', borderRadius: 15, justifyContent: 'center', borderColor:'white', borderWidth:1, marginTop:5}}
                    onPress={pickImageFromCamera}
                >
                    <Text style={styles.textStyle}>Tirar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{backgroundColor:'#FF5F55', width: '85%', height: '25%', borderRadius: 15, justifyContent: 'center', marginTop: 5, borderColor:'white', borderWidth:1}}
                    onPress={()=>{
                      if (alterar){
                        enviarFotoStorage(imageUser);
                        setAtualizouImagem(true);
                        setAlterar(false);
                      }
                      setModalVisible(!modalVisible);
                    }}
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
