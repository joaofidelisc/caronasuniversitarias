import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet, PermissionsAndroid, Dimensions, TextInput, AppState} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import config from '../../config';


const {width, height} = Dimensions.get('screen');

function Oferecer() {
  var [region, setRegion] = useState(null);  
  var [destination, setDestination] = useState(null);

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
          >
            <Marker
              coordinate={{ latitude : -21.593920 , longitude : -48.351474 }}
              onPress={()=>{console.log('pressionou no pin')}}
              // image={{uri: 'https://reactjs.org/logo-og.png'}}
              // image={{}}
            />
          </MapView>
        <GooglePlacesAutocomplete
          minLength={2}
          autoFocus={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log(details.geometry.location.lat);
            console.log(details.geometry.location.lng);
            // setDestination({
            //   latitude: details.geometry.location.lat,
            //   longitude: details.geometry.location.lng,
            //   latitudeDelta: 0.0922,
            //   longitudeDelta: 0.0421
            // })
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
        </View>
      </SafeAreaView>
    );
}

export default Oferecer;