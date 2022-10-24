import React, {useEffect, useState, useRef} from 'react';
import {View, Text, SafeAreaView, StatusBar, Button, Image, Dimensions, TextInput, TouchableOpacity, Platform, Modal, StyleSheet} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


import Geocoder from 'react-native-geocoding';
import config from '../../config';

const {width, height} = Dimensions.get('screen');


export default function Buscar({navigation}) {

  const [localDestino, setLocalDestino] = useState(null); //Utilizado para armazenar as coordenadas de destino do caronista;
  const [nomeDestino, setNomeDestino] = useState(''); //Utilizado para armazenar o nome do destino que o caronista quer ir;
  const [localizacaoPassageiro, setlocalizacaoPassageiro] = useState(null); //Armazena as coordenadas do local atual do caronista;
  const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false); //Define se o usuário está com a localização ativa ou não;
  const [modalVisible, setModalVisible] = useState(false); //Utilizado para controle do modal que é exibido ao não preencher o local de destino.


  /*
    Função responsável por enviar a localização do passageiro(a) ao banco de dados, com sua cidade/estado corrente;
    Além disso, navega para a tela de 'Buscando Carona', passando as informações necessárias como parâmetro.
  */
  const enviarLocalizacaoPassageiro = async(latitude, longitude)=>{
    await AsyncStorage.setItem('buscandoCarona', 'true');
    const currentUser = auth().currentUser.uid;
    var response = await Geocoder.from(latitude, longitude);
    var filtro_cidade = response.results[0].address_components.filter(function(address_component){
      return address_component.types.includes("administrative_area_level_2");
    }); 

    var filtro_estado = response.results[0].address_components.filter(function(address_component){
      return address_component.types.includes("administrative_area_level_1");
    });
    
    var cidade = filtro_cidade[0].short_name; 
    var estado = filtro_estado[0].short_name;

    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference.set({
        latitudePassageiro: latitude,
        longitudePassageiro: longitude,
        latitudeDestino:localDestino.latitude,
        longitudeDestino:localDestino.longitude,
        nomeDestino: nomeDestino,
        ativo: true,
        ofertasCaronas:'',
        caronasAceitas:'',
      }).then(()=>console.log('coordenadas passageiro enviadas!'));
      navigation.navigate('Buscando_Carona', {cidade: cidade, estado: estado});
    }catch(error){
      console.log('ERRO:', error.code);
    }
  }


  /*
    Função responsável por obter o local atual do passageiro e definir esse no array localizaçãoPassageiro;
    Caso o usuário não tenha ligado a localização, é solicitado ao mesmo.
  */
  const getLocalPassageiro = async()=>{
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
        } catch(error){
          console.log(error.code); 
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

  /*
    Função responsável por solicitar ao usuário ligar a sua localização.
  */
  const ligarLocalizacao = async()=>{
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2 style='color: #0af13e'>Usar localização</h2><br/>Deseja permitir que o aplicativo <b>Caronas Universitárias</b> acesse a sua localização?<br/><br/>",
      ok: "Permitir",
      cancel: "Negar",
      enableHighAccuracy: true,
      showDialog: true, 
        openLocationServices: true, 
        preventOutSideTouch: false, 
        preventBackClick: false, 
        providerListener: false 
      }).then(function(success) {
        setLocalizacaoAtiva(true);
        estadoInicial();
      }).catch((error) => {
        setLocalizacaoAtiva(false);  
        console.log(error.message); 
      });
    }
  
  /*
    Função responsável por definir a localização atual do passageiro, na tentativa de definir um estado inicial;
    Caso o usuário se mova do local atual ao solicitar carona, a localização do mesmo é atualizada com getLocalPassageiro(), enviando o estado mais atualizado ao banco de dados.
  */
  const estadoInicial = async()=>{
    try{
      Geolocation.getCurrentPosition(info=>{
        setlocalizacaoPassageiro({
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


  /* 
    Função utilizada apenas para teste da tela Oferecer.js;
    Um caronista é inserido no banco de Passageiros para teste das funções da tela.
  */
  const insereBanco = async()=>{
    const reference = database().ref(`SP/Matão/Passageiros/sqmtE3QOReXfNemiKDZWup00HYo1`);
    try{
      reference.set({
        latitudePassageiro: -21.59371,
        longitudePassageiro: -21.4835263,
        latitudeDestino: -21.60082,
        longitudeDestino: -48.35736,
        nomeDestino: 'Tenda Atacado',
        ativo: true,
        ofertasCaronas:'',
        caronasAceitas:'',
      });
    }catch(error){
      console.log('atualizaEstado, ERRO:', error.code);
    }
  }

  /* 
    Função utilizada para impedir que um passageiro dê carona a si mesmo como motorista;
    Quando o banco de Motoristas é criado com o uid do passageiro, ele é automaticamente deletado.
  */
  const excluiBancoPassageiroMotorista = async(estado, cidade, currentUser)=>{
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    try{
      reference.on('value', snapshot=>{
        if (snapshot.exists()){
          reference.remove();
        }
      })
    }catch(error){
      console.log('excluiBancoMotoristaPassageiro');
    }
  }


  useEffect(()=>{
    console.log('TELA: Buscar');
    Geocoder.init(config.googleAPI, {language:'pt-BR'});
    ligarLocalizacao();    
    // excluiBancoPassageiroMotorista(); //Essa função deve ser chamada aqui;
  }, [])
  
  
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%',}}>

      <Image source={
        require('../../assets/images/buscar-carona.png')} 
        style={{height:350, width: 350, position: 'absolute', top: 260, alignSelf: 'center'}}  
      />
      <Text style={{fontSize:20, color:'#2f4f4f', paddingHorizontal:70, fontWeight:'bold', position: 'absolute', top: 65}}>Para onde pretende ir?</Text>
      <Text style={{fontSize:15, color:'#c0c0c0', paddingHorizontal:70, fontWeight:'normal', marginVertical:15, position: 'absolute', top: 170, fontWeight: '600'}}>Ex: Universidade federal de São Carlos</Text>
      {
        localizacaoPassageiro &&
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
            onChangeText: (nomeDestino) =>{
              setNomeDestino(nomeDestino)
            }
          }}
          
          query={{
            key: config.googleAPI,
            language: 'pt-br',
            components: 'country:br',
            location: `${localizacaoPassageiro.latitude}, ${localizacaoPassageiro.longitude}`,
            radius: "15000", //Define um raio de 15km em torno da localização atual do passageiro dos locais que devem ser exibidos na pesquisa;
            strictbounds: true
          }}
    
          GooglePlacesSearchQuery={{
            rankby: 'distance',
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
      }
      
      <View style={{marginVertical:50}}>
      <TouchableOpacity
        style={{position: 'absolute', backgroundColor: '#FF5F55', top: 260, width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}        
        onPress={getLocalPassageiro}
        // onPress={insereBanco} //Função para teste na tela Oferecer.js
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
  }
});