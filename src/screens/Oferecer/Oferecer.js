import React, {useState, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet, PermissionsAndroid, Dimensions, TextInput, AppState, Modal, TouchableOpacity, Image} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import config from '../../config';


const {width, height} = Dimensions.get('screen');

function Oferecer() {
  const mapEL = useRef(null);
  const [region, setRegion] = useState(null);  
  const [destination, setDestination] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [imageUser, setImageUser] = useState('');


  function atualizaEstado(){
   const currentUser = auth().currentUser.uid;
   var caminhoCoordMotorista = currentUser.concat('User');
   const reference = database().ref(caminhoCoordMotorista);
   try{
    reference.set({
      latitude: region.latitude,
      longitude: region.longitude,
      ativo: true,
    }).then(()=> console.log('coordenadas enviadas!'));
   }catch(error){
    console.log('ERRO:', error.code);
   }
  }

  function getMyLocation(){
    Geolocation.getCurrentPosition(info=>{
      setRegion({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })
    },
    ()=>{console.log('erro')}, {
      enableHighAccuracy:true,
      timeout:2000,
    })
    atualizaEstado();
  }
  
  useEffect(()=>{
    getMyLocation();
  }, [])
  
  const buscaUsuario = async()=>{
    try{
      const url = await storage().ref('user_undefined.png').getDownloadURL(); 
      setImageUser(url); 
    }catch(error){
      console.log(error.code);
    }
    setMessage('Usuário');
    setModalVisible(true);
  }

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
                  console.log('Permissão aceita')
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
            <Marker
              coordinate={{ latitude : -21.98526 , longitude : -47.89466}}
              onPress={buscaUsuario}
              // image={{uri: 'https://reactjs.org/logo-og.png'}}
              // image={{}}
            />
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
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>João Vitor Fidelis Cardozo</Text>
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: Kartódromo</Text>
            
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