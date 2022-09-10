import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Button, Image, Dimensions, TextInput, TouchableOpacity, Platform, Modal, StyleSheet} from 'react-native';

import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


import config from '../../config';
import { onChange } from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');


export default function Buscar({navigation}) {


  const [localDestino, setLocalDestino] = useState(null);
  const [nomeDestino, setNomeDestino] = useState('');
  const [localizacaoPassageiro, setlocalizacaoPassageiro] = useState(null);
  const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false);
  // const [objPassageiro, setObjPassageiro] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');

//itera por todos os documentos
// function testarBanco(){  
//   setObjPassageiro([]); //reseta objPassageiro
//   var numPassageiros = 0;
//   let db = database().ref();
//   let usersRef = db.child('Passageiros');
//   usersRef.once("value").then(function(snapshot) {
//     snapshot.forEach(function(userSnapshot) {
//       let uidPassageiro = userSnapshot.key;
//       let latitudePassageiro = userSnapshot.val().latitudePassageiro;
//       let longitudePassageiro = userSnapshot.val().longitudePassageiro;
//       setObjPassageiro(
//         [
//           ...objPassageiro, {
//             uid: uidPassageiro,
//             latitude: latitudePassageiro,
//             longitude: longitudePassageiro,
//           }
//         ]  
//         )
//         // numPassageiros+=1;
//       });
//     });
//   setObjPassageiro([]); //reseta objPassageiro
//   console.log('Obj:\n');
//   console.log(objPassageiro);
  
//   //PASSAR PARA O MARKER ATUALIZADO;
//   // console.log('TESTANDO MAP:\n');
//   // objPassageiro.map(passageiro=>(
//   //   console.log(passageiro.uid)
//   // ))
// }

// function getCaronistas(){
//   let db = database().ref();
//   let usersRef = db.child('Motoristas')
//   usersRef.once("value").then(function(snapshot) {
//     snapshot.forEach(function(userSnapshot) {
//       console.log(userSnapshot.key);
//       console.log(userSnapshot.val()); 
//       // console.log(userSnapshot.child("points").val());
//     });
//   });
// }

  function enviarLocalizacaoPassageiro(latitude, longitude){
    const currentUser = auth().currentUser.uid;
    const reference = database().ref(`Passageiros/${currentUser}`);
    try{
      reference.set({
        latitudePassageiro: latitude,
        longitudePassageiro: longitude,
        latitudeDestino:'',
        longitudeDestino:'',
        nomeDestino:'',
        ativo: true,
      }).then(()=>console.log('coordenadas passageiro enviadas!'));
    }catch(error){
      console.log('ERRO:', error.code);
    }
  }


  //TERMINAR DE IMPLEMENTAR E TESTAR
  function getLocalPassageiro(){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(()=>{
        ligarLocalizacao();
      })
    if (localizacaoAtiva == true){
      if (nomeDestino != ''){
        try{
          Geolocation.getCurrentPosition(info=>{
            setlocalizacaoPassageiro({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            })
            enviarLocalizacaoPassageiro(info.coords.latitude, info.coords.longitude);
          },
          ()=>{
            console.log('erro')}, {
            enableHighAccuracy:false,
            timeout:2000,
          })
          navigation.navigate('ConfirmarSolicitacao', {nomeDestino: nomeDestino, localDestino: localDestino})
        } catch(error){
          console.log(error.code); //tratamento de excecao
        }
        console.log('deu bom\n');
      }
      else{
        setModalVisible(true);
      }
    } else{
      console.log('localizacao desativada');
    }
  }

  //implementando
  const ligarLocalizacao = async()=>{
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2 style='color: #0af13e'>Usar localização</h2><br/>Deseja permitir que o aplicativo <b>Caronas Universitárias</b> acesse a sua localização?<br/><br/>",
        ok: "Permitir",
        cancel: "Negar",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
        preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
        providerListener: false // true ==> Trigger locationProviderStatusChange listener when the location state changes
    }).then(function(success) {
        setLocalizacaoAtiva(true);
        console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
    }).catch((error) => {
        setLocalizacaoAtiva(false);  
      console.log(error.message); // error.message => "disabled"
    });
  }


  useEffect(()=>{
    console.log('Buscar');
    ligarLocalizacao();
  })


  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%',}}>

      <Image source={
        require('../../assets/images/buscar-carona.png')} 
        style={{height:350, width: 350, position: 'absolute', top: 260, alignSelf: 'center'}}  
      />
      <Text style={{fontSize:20, color:'#2f4f4f', paddingHorizontal:70, fontWeight:'bold', position: 'absolute', top: 65}}>Para onde pretende ir?</Text>
      <Text style={{fontSize:15, color:'#c0c0c0', paddingHorizontal:70, fontWeight:'normal', marginVertical:15, position: 'absolute', top: 170, fontWeight: '600'}}>Ex: Universidade fereral de São Carlos</Text>

      <GooglePlacesAutocomplete
        minLength={2}
        autoFocus={false}
        fetchDetails={true}
        onPress={(data, details = null) => {
          setNomeDestino(data.description);
          setLocalDestino({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          })
        }}
        textInputProps={{
          onChangeText: (nomeDestino) =>{setNomeDestino(nomeDestino)}
        }}
        query={{
          key: config.googleAPI,
          language: 'pt-br',
        }}
        styles={{
          container: {
            position:'absolute',
            alignItems: 'center',
            top: 120,                   
            width: width,
            justifyContent: 'center',
          },
          textInputContainer: {
            width: 312,
            height: 50,
            borderColor: 'rgba(83, 83, 83, 0.8)',
            borderWidth:2,
            borderRadius: 8,
            backgroundColor: 'white',
          },
          textInput:{
            color: 'black',
          },
          description: {
            color: 'black'
          },
          listView: {
            elevation: 1,
            height: 100,
            width: 312
          },
        }}
      />
      
      <View style={{marginVertical:50}}>
      <TouchableOpacity
        style={{position: 'absolute', backgroundColor: '#FF5F55', top: 260, width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
        
        // onPress={()=>navigation.navigate('ConfirmarSolicitacao', {nomeDestino: nomeDestino, localDestino: localDestino})}
        onPress={getLocalPassageiro}
        // onPress={()=>{setModalVisible(true)}}
      >
        <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
          Buscar Carona
        </Text>
      </TouchableOpacity>
      </View>
      <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
            >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15, fontWeight:'600'}}>Informações incompletas</Text>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>Preencha o local de destino antes de prosseguir para a próxima etapa!</Text>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        onPress={() => setModalVisible(!modalVisible)}
                        // onPress={buscarCarona}
                    >
                        <Text style={styles.textStyle}>Entendi</Text>
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