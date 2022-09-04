import React, {useState, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet, PermissionsAndroid, Dimensions, TextInput, AppState, Modal, TouchableOpacity, Image} from 'react-native';

import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import { BackHandler, DeviceEventEmitter } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import config from '../../config';


const {width, height} = Dimensions.get('screen');

function Oferecer() {
  const mapEL = useRef(null);
  const [region, setRegion] = useState(null);  
  const [destination, setDestination] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [imageUser, setImageUser] = useState('');
  const [atualizarMarker, setAtualizarMarker] = useState(false);
  const [vetorCaronistas, setCaronistas] = useState([]);
  const [estaPresente, setEstaPresente] = useState(false);

  const [nomeCaronista, setNomeCaronista] = useState('');
  const [nomeDestinoCaronista, setNomeDestinoCaronista] = useState('');

  // const vetorCaronistas = [];

    const localizacaoLigada = async()=>{
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
        // getMyLocation();
        console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
    }).catch((error) => {
        console.log(error.message); // error.message => "disabled"
    });
  }


  // //leitura em tempo real funcionando!!
  // //não zerar vetor no começo, se o id existe (só atualizar), se não existir (atualizar);
  // function getCaronistasMarker(){
  //   try{
  //     database().ref().child('Passageiros').on('value', function(snapshot){
  //       snapshot.forEach(function(userSnapshot){
  //         let uidPassageiro = userSnapshot.key;
  //         let latitudePassageiro = userSnapshot.val().latitudePassageiro;
  //         let longitudePassageiro = userSnapshot.val().longitudePassageiro;
  //         vetorCaronistas.some(caronista=>{
  //           if (caronista.uid === uidPassageiro){
  //             console.log('Atualizando posição...\n');
  //             // vetorCaronistas[vetorCaronistas.indexOf(caronista)].latitude = latitudePassageiro;
  //             // vetorCaronistas[vetorCaronistas.indexOf(caronista)].longitude = longitudePassageiro
  //             // setEstaPresente(true);  
  //           }
  //         })
  //         if (!estaPresente){
  //           setCaronistas(
  //             [
  //               ...vetorCaronistas, {
  //                 uid: uidPassageiro,
  //                 latitude: latitudePassageiro,
  //                 longitude: longitudePassageiro,
  //               }
  //             ]  
  //             )
  //         }
  //           console.log('ATUALIZOU COORDENADAS!');
  //       })
  //       setEstaPresente(false);
  //     })
  //   }catch(error){
  //     console.log('ERRO', error.code);
  //   }
  // }

  function getDestinoCaronista(userUID){
    // database().ref(`Passageiros/NbFrgDf5K7WVkZGE3taldHdo5qI3`).once('value').then(snapshot=>{
    database().ref(`Passageiros/${userUID}`).once('value').then(snapshot=>{
      // console.log('Destino:', snapshot.val().nomeDestino);
      setNomeDestinoCaronista(snapshot.val().nomeDestino);
      console.log('Destino:', nomeDestinoCaronista);
    })
  }

  function getCaronistasMarker(){
    try{
      database().ref().child('Passageiros').on('value', function(snapshot){
        snapshot.forEach(function(userSnapshot){          
          if (vetorCaronistas.length == 0){
            setCaronistas([{
              latitude: userSnapshot.val().latitudePassageiro,
              longitude: userSnapshot.val().longitudePassageiro,
              uid: userSnapshot.key,          
              }
            ])
          }
          else{
            const estaPresente = vetorCaronistas.some(caronista=>{
              if (caronista.uid === userSnapshot.key){
                console.log('Atualizando posição...\n');
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].latitude = userSnapshot.val().latitudePassageiro;
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].longitude = userSnapshot.val().longitudePassageiro;
                return true;
              }
              return false;
            })
            if (!estaPresente){
              console.log('Não está presente!');
              setCaronistas([...vetorCaronistas, {
                latitude: userSnapshot.val().latitudePassageiro,
                longitude: userSnapshot.val().longitudePassageiro,
                uid: userSnapshot.key,          
                }
              ])
            }
          }
          console.log('VETOR:\n');
          console.log(vetorCaronistas);
        })
      })
    }catch(error){
      console.log('ERRO', error.code);
    }
  }

  //atualiza o estado do motorista
  function atualizaEstado(){
   const currentUser = auth().currentUser.uid;
   const reference = database().ref(`Motoristas/${currentUser}`);
   try{
    reference.set({
      latitudeMotorista: region.latitude,
      longitudeMotorista: region.longitude,
      ativo: true,
    }).then(()=> console.log('coordenadas enviadas!'));
   }catch(error){
    console.log('ERRO:', error.code);
   }
  }


  function getMyLocation(){
    try{
      Geolocation.getCurrentPosition(info=>{
        setRegion({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        })
      },
      ()=>{console.log('Atualizando...')}, {
        enableHighAccuracy:false,
        timeout:2000,
      })
      atualizaEstado();
    }catch(error){
      console.log(error.code);
    }
  }

  
  const recuperarFotoStorage = async(userUID)=>{
    const uidCaronista = userUID;
    var caminhoFirebase = uidCaronista.concat('Perfil');    
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
  
  const buscaUsuario = async(userUID)=>{
    // function buscaUsuario(userUID){
      try{
        await recuperarFotoStorage(userUID);
        firestore().collection('Users').doc(userUID).onSnapshot(documentSnapshot=>{
          setNomeCaronista(documentSnapshot.data().nome)
      });
      getDestinoCaronista(userUID);
    }catch(error){
      console.log(error.code);
    }
    setMessage('Usuário');
    setModalVisible(true);
  }
  
  useEffect(()=>{
    getMyLocation();
    getCaronistasMarker();
  }, [])
  
  return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          {/* <Text style={{color:'black'}}>Oferecer</Text> */}
          <MapView
            onMapReady={()=>{
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then(()=>{
                  console.log('Permissão aceita');  
                  localizacaoLigada();
                })
            }}
            style={{width:width, height:height, flex:1}}
            region={region}
            zoomEnabled={true}
            minZoomLevel={17}
            showsUserLocation={true}
            loadingEnabled={true}
            onRegionChange={getMyLocation}
            // ref={mapEL}
            initialRegion={{
              latitude: -21.983311,
              longitude: -47.883154,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {
              vetorCaronistas.map(passageiro=>(
                <Marker
                  key={passageiro.uid}
                  coordinate={{ latitude : passageiro.latitude , longitude : passageiro.longitude}}
                  onPress={()=>{
                    buscaUsuario(passageiro.uid);
                  }}
                  title={passageiro.uid}
                  // description={'Passageiro'}
                  // image={{uri: 'https://reactjs.org/logo-og.png'}}
                  // image={{}}
                />
              ))
            }          
            {
              destination &&
              <MapViewDirections
                  origin={region}
                  destination={destination}
                  apikey={config.googleAPI}
                  strokeWidth={3}
                  strokeColor='#FF5F55'
                  onReady={result=>{
                    // mapEL.current.
                    // console.log(result);
                  }}
                />
            }
          </MapView>
        <GooglePlacesAutocomplete
          minLength={2}
          autoFocus={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            // console.log(details.geometry.location.lat);
            // console.log(details.geometry.location.lng);
            setDestination({
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
              top: 90,                   
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
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Image 
                      source={
                        imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                    />
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
            
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        // onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Oferecer carona</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Cancelar</Text>
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

export default Oferecer;