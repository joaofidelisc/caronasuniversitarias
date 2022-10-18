import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import config from '../../config';

const {width, height} = Dimensions.get('screen');

function ConfigurarCarona({navigation}) {
    const [vagas, setVagas] = useState(1);
    const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false);
    const [localizacaoMotorista, setlocalizacaoMotorista] = useState(null);
    const [nomeDestino, setNomeDestino] = useState('');
    
    
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
          estadoInicial();
          // console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
        }).catch((error) => {
          setLocalizacaoAtiva(false);  
          console.log(error.message); // error.message => "disabled"
        });
    }

    const estadoInicial = async()=>{
      if (localizacaoAtiva == true){
        try{
          Geolocation.getCurrentPosition(info=>{
            setlocalizacaoMotorista({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            })
          },
          ()=>{
            console.log('erro')}, {
              enableHighAccuracy:false,
              timeout:2000,
            })
          } catch(error){
            console.log(error.code); 
          }
      }
    }
  
    async function defineCidadeEstado(){
      var response = await Geocoder.from(localizacaoMotorista.latitude, localizacaoMotorista.longitude);
      var filtro_cidade = response.results[0].address_components.filter(function(address_component){
        return address_component.types.includes("administrative_area_level_2");
      }); 

      var filtro_estado = response.results[0].address_components.filter(function(address_component){
        return address_component.types.includes("administrative_area_level_1");
      });

      navigation.navigate('OferecerCarona', {cidade:filtro_cidade[0].short_name, estado:filtro_estado[0].short_name, destino:nomeDestino, vagas:vagas})
    }


    useEffect(()=>{
      Geocoder.init(config.googleAPI, {language:'pt-BR'});
      ligarLocalizacao();
      console.log('localizacaoMotorista', localizacaoMotorista);
    }, [localizacaoAtiva])

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', fontWeight:'800', fontSize: 20, lineHeight:24, textAlign:'left', marginBottom: 16, marginTop: 30}}>Algumas perguntas importantes...</Text>
          <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, lineHeight:24, textAlign:'left'}}>Qual o seu destino final?</Text>
          <Image source={
            require('../../assets/images/duvidas-oferecer.png')} 
            style={{height:350, width: 350, alignSelf:'center', position: 'absolute', top: 190}}  
          />
          {
             localizacaoMotorista &&
             <GooglePlacesAutocomplete
               minLength={2}
               autoFocus={false}
               fetchDetails={true}
               onPress={(data, details = null) => {
                 setNomeDestino(data.description);
               }}
               textInputProps={{
                 onChangeText: (nomeDestino) =>{
                   setNomeDestino(nomeDestino)
                 }
               }}
               
               query={{
                 key: config.googleAPI,
                 language: 'pt-br',
                 components: 'country:br',
                 location: `${localizacaoMotorista.latitude}, ${localizacaoMotorista.longitude}`, //alterar aqui para coordenadas atuais
                 radius: "15000", //15km
                 strictbounds: true
               }}
         
               GooglePlacesSearchQuery={{
                 rankby: 'distance',
               }}
               styles={{
                 container: {
                  //  position: 'absolute', 
                   alignItems: 'center',
                  //  top: 120,
                   width: width,
                   marginTop: 16,
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
                   width: 312,
                 },
               }}
             />
          }
      
          <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, lineHeight:24, textAlign:'center', position: 'absolute', top: 530}}>Quantas vagas você tem disponível em seu carro?</Text>
          <View style={{flexDirection:'row', marginTop: 16, marginBottom: 16, position:'absolute', top: 550}}>
          <TouchableOpacity 
              style={{backgroundColor: '#FF5F55', width: 50, height: 30, borderRadius: 15, justifyContent: 'center', alignSelf:'center'}}
              onPress={()=>{
                if (vagas>1){
                  setVagas(vagas-1)}
                }
              }  
            >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 22, lineHeight: 24, textAlign: 'center'}}>-</Text>
            </TouchableOpacity>

            <Text style={{color: '#06444C', fontWeight: '600', fontSize: 16, lineHeight: 24, marginLeft: 10, marginRight: 10, alignSelf: 'center'}}>Vagas: {vagas}</Text>
            
            <TouchableOpacity 
              style={{backgroundColor: '#FF5F55', width: 50, height: 30, borderRadius: 15, justifyContent: 'center', alignSelf:'center'}}
              onPress={()=>{
                if (vagas<4){
                  setVagas(vagas+1)}
                }
              }  
            >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 22, lineHeight: 24, textAlign: 'center', alignSelf:'center'}}>+</Text>
            </TouchableOpacity>
            
            
        
          </View>
          
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 260, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', position: 'absolute', top: 620}}
            onPress={defineCidadeEstado}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Avançar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default ConfigurarCarona;