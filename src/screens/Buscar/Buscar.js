import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Button, Image, Dimensions, TextInput, TouchableOpacity, Platform} from 'react-native';

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
  const [localizacaoPassageiro, setlocalizacaoPassageiro] = useState(null);
  const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false);


//itera por todos os documentos
function testarBanco(){
  let db = database().ref();
  let usersRef = db.child('Motoristas')
  usersRef.once("value").then(function(snapshot) {
    snapshot.forEach(function(userSnapshot) {
      console.log(userSnapshot.key);
      console.log(userSnapshot.val()); 
      // console.log(userSnapshot.child("points").val());
    });
  });
}


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

  function getLocalPassageiro(){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(()=>{
        ligarLocalizacao();
      })
    if (localizacaoAtiva == true){
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
        //falta passar destino do passageiro com coordenadas
        navigation.navigate('Buscando_Carona', {localizacao: localizacaoPassageiro, destino: localDestino})
      } catch(error){
        console.log(error.code); //tratamento de excecao
      }
      console.log('deu bom\n');
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


  // useEffect(()=>{
  //   ligarLocalizacao();
  // })


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
          setLocalDestino({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          })
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
        // onPress={()=>navigation.navigate('Buscando_Carona', {destino: destino, nomeDestino: nomeDestino})}
        // onPress={requestLocationPermission}
        // onPress={getLocalPassageiro}
        onPress={testarBanco}
        // onPress={ligarLocalizacao}
      >
        <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
          Buscar Carona
        </Text>
      </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

