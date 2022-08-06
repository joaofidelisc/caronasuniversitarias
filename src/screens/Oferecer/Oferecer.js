import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet, PermissionsAndroid, Dimensions, TextInput} from 'react-native';

import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('screen');

function Oferecer() {
  const [region, setRegion] = useState(null);  
  
  function getMyLocation(){
    Geolocation.getCurrentPosition(info=>{
      console.log("LATITUDE ", info.coords.latitude);
      console.log("LONGITUDE ", info.coords.longitude);
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
          />
        <TextInput
          style={{position: 'absolute', top: 90, width: 312, height: 38, backgroundColor:'white', borderRadius: 15, fontSize: 14, fontWeight:'600', lineHeight: 17, color:'rgba(83, 83, 83, 0.8)', textAlign:'center', borderWidth: 1, borderColor:'rgba(83, 83, 83, 0.8)'}}
          placeholderTextColor='rgba(83, 83, 83, 0.8)'
          placeholder='Digite o destino da sua viagem'

        />
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  map:{
    height: '100%',
    // backgroundColor: 'black',
  }
})

export default Oferecer;