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

import {setTimeout} from "timers/promises";


import { BackHandler, DeviceEventEmitter } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import config from '../../config';
import Geocoder from 'react-native-geocoding';


const {width, height} = Dimensions.get('screen');

function Oferecer() {
  const [region, setRegion] = useState(null);  
  const [destination, setDestination] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  //USADO NO MODAL
  // const [message, setMessage] = useState('');
  const [imageUser, setImageUser] = useState('');

  
  const [vetorCaronistas, setCaronistas] = useState([]);
  const [nomeCaronista, setNomeCaronista] = useState('');
  const [nomeDestinoCaronista, setNomeDestinoCaronista] = useState('');
  
  const [uidPassageiro, setUidPassageiro] = useState('');
  
  const [caronaAceita, setCaronaAceita] = useState(false);
  const [lotacaoAtingida, setLotacaoAtingida] = useState(false);
  const [oferecerMaisCaronas, setOferecerMaisCaronas] = useState(false);

  const [buscandoPassageiro, setBuscandoPassageiro] = useState(false);

  const [estadoInicialControle, setEstadoInicialControle] = useState(false);
  
  const cidade = 'Matão';
  const estado = 'SP';
  

  //Função responsável por solicitar ao usuário ligar sua localização;

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
        // console.log('Localização ligada!');
        // console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
    }).catch((error) => {
        console.log(error.message); // error.message => "disabled"
    });
  }

  
  //Função responsável por obter o destino do caronista com base em seu UserID;
  //Essa função é chamada apenas quando um marcador é pressionado;
  
  function getDestinoCaronista(userUID){
    try{
      database().ref(`${estado}/${cidade}/Passageiros/${userUID}`).once('value').then(snapshot=>{
        setNomeDestinoCaronista(snapshot.val().nomeDestino);
        // console.log('Destino:', nomeDestinoCaronista);
      })
    }catch(error){
      console.log(error.code);
    }
  }

  //Função responsável por 'desenhar' os marcadores (caronistas) no mapa;
  //A lógica empregada é iterar por todos os marcadores na primeira vez e caso tenha algum marcador a ser inserido, apenas inserimos; caso um marcador mude de posição, ele é apenas atualizado.
  
  function getCaronistasMarker(){
    let jaExiste = false;
    if (jaExiste == true){
      jaExiste = false;
    }
    try{
      database().ref().child(`${estado}/${cidade}/Passageiros`).on('value', function(snapshot){
        snapshot.forEach(function(userSnapshot){       
          if (vetorCaronistas.length == 0){
            setCaronistas([{
              latitude: userSnapshot.val().latitudePassageiro,
              longitude: userSnapshot.val().longitudePassageiro,
              uid: userSnapshot.key,  
              caronasAceitas: userSnapshot.val().caronasAceitas,        
              }
            ])
          }
          else{
            vetorCaronistas.some(caronista=>{
              if (caronista.uid === userSnapshot.key){
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].latitude = userSnapshot.val().latitudePassageiro;
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].longitude = userSnapshot.val().longitudePassageiro;
                jaExiste = true;
              }
            })
            if (!jaExiste){
              setCaronistas([...vetorCaronistas, {
                latitude: userSnapshot.val().latitudePassageiro,
                longitude: userSnapshot.val().longitudePassageiro,
                uid: userSnapshot.key,
                caronasAceitas: userSnapshot.val().caronasAceitas,      
                }
              ])
            }
          }
        })
      })
    }catch(error){
    }
  }


  //Função responsável por atualizar o estado do motorista em tempo real;
  //Atualiza no banco de dados essa posição.

  function atualizaEstado(){
   const currentUser = auth().currentUser.uid;
   const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
   try{
     reference.update({
       latitudeMotorista: region.latitude,
       longitudeMotorista: region.longitude,
       ativo: true,
      });
    }catch(error){
      console.log('atualizaEstado, ERRO:', error.code);
    }
  }
  
  //Função responsável por definir um estado inicial para o motorista, ou seja, sua posição inicial ao iniciar o App;
  //Quando o app é iniciado, é necessário ver se o banco de dados para esse motorista já existe e, caso contrário, ele deve ser criado;
  //O banco de dados nessa parte é utilizado em Realtime.

  function estadoInicial(){
    const currentUser = auth().currentUser.uid;

    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    try{
      reference.once('value').then(function(snapshot){
        setEstadoInicialControle(snapshot.exists());
      })
    }catch(error){
      console.log(error.code);
    }

  
    if (!estadoInicialControle){
      console.log('estadoInicial() rodando...');
      try{
        reference.set({
          latitudeMotorista: region.latitude,
          longitudeMotorista: region.longitude,
          caronasAceitas:'',
          ativo: true,
        });
      }catch(error){
        console.log('atualizaEstado, ERRO:', error.code);
      }
    }
  }
  
  //Função responsável apenas por obter a localização do motorista em tempo real;

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
  
  //Função responsável por recuperar a foto do passageiro no banco de dados;
  //Utilizada para exibir essa foto no Modal.

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
  
  
  /*Função responsável por buscar as informações do usuário, sendo essas: Destino, Foto de perfil e nome.
  Essas informações são exibidas no modal, quando pressionado o marcador (joinha) de carona;
  O modal é exibido em duas ocasiões:
  - quando o caronista não tem carona aceita e quero oferecer uma carona para ele;
  - quando o caronista aceita a minha carona proposta, o modal é exibido automaticamente;
  * nesse caso, temos que caronasAceitas do passageiro é == uidMotorista atual* 
  Importante: se caronaAceita for vazio ou igual ao UID do motorista, indica que o caronista não aceitou carona ou que o caronista aceitou a minha carona (caronaAceita == currentUser);
              caso contrário, o caronista aceitou a carona de outro motorista.
  */
 
 const buscaUsuario = async(userUID, caronaAceita)=>{
    const currentUser = auth().currentUser.uid;
    if (caronaAceita == '' || caronaAceita == currentUser){
      if (caronaAceita == currentUser){
        setCaronaAceita(true);
        setBuscandoPassageiro(false);
      }
      try{
          await recuperarFotoStorage(userUID);
          firestore().collection('Users').doc(userUID).onSnapshot(documentSnapshot=>{
            setNomeCaronista(documentSnapshot.data().nome)
        });
        getDestinoCaronista(userUID);
      }catch(error){
        console.log(error.code);
      }
      setUidPassageiro(userUID);
      setModalVisible(true);
    }
  }

 
  /*Função responsável por oferecer carona a um possível passageiro;
    Essa função, escreve no banco de dados do Passageiro em 'ofertasCaronas' o UID do motorista.
    A ideia é concatenar a string da caronas já existente em 'ofertasCaronas' do passageiro com o UID do motorista, mantendo assim, os demais motoristas oferecedores
    de carona.
  */

  function oferecerCarona(){
    let listaCaronas = '';
    setModalVisible(false);
    const uidMotorista = auth().currentUser.uid;
    try{
      database().ref(`${estado}/${cidade}/Passageiros/${uidPassageiro}`).once('value').then(snapshot=>{
        listaCaronas = snapshot.val().ofertasCaronas;
        if (!listaCaronas.includes(uidMotorista)){
          if (listaCaronas == ''){
            listaCaronas = uidMotorista;
          }else{
            listaCaronas = listaCaronas.concat(', ',uidMotorista); //faz um join com os elementos do vetor e depois concatena com o uidMotorista;
          }
        }        
        database().ref(`${estado}/${cidade}/Passageiros/${uidPassageiro}`).update({
          ofertasCaronas: listaCaronas
        });
      })
    }catch(error){
      console.log('Deu algum erro aqui :(');
    }
  }

  /*Essa função é responsável por verificar em tempo real as caronas aceitas pelos passageiros no banco do atual motorista;
  Ou seja, caso um passageiro aceite uma proposta de carona minha, aparecerá um modal na tela, ressaltando essa informação. 
  */

  function caronasAceitas(){
    const currentUser = auth().currentUser.uid;
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    console.log('caronasAceitas');
    try{
      reference.on('value', function(snapshot){
        if (snapshot.val().caronasAceitas != ''){
          setCaronaAceita(true);
          buscaUsuario(snapshot.val().caronasAceitas, currentUser);
        }
      })
    }catch(error){
      console.log('Error', error.code);
    }
  }


  /*A implementação dessa função não está finalizada, mas a ideia é chamá-la sempre que for buscar um passageiro que aceitou uma carona minha.
  */
  function buscarPassageiro(){
    console.log('Buscando passageiro...\n');
    // setModalVisible(!modalVisible);
    setCaronaAceita(false);
    setBuscandoPassageiro(true);
  }
  

  useEffect(()=>{
    console.log('TELA: Oferecer');
    Geocoder.init(config.googleAPI, {language:'pt-BR'});
    estadoInicial();
    getMyLocation();
    getCaronistasMarker();
    caronasAceitas();
  }, [vetorCaronistas])
  
  return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
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
                    buscaUsuario(passageiro.uid, passageiro.caronasAceitas);
                  }}
                  icon={passageiro.caronasAceitas==''?require('../../assets/icons/caronista.png'):require('../../assets/icons/carona_aceita.png')}
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
                  // onReady={result=>{
                  // }}
                />
            }
          </MapView>
       
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                  
                  {
                    caronaAceita && !buscandoPassageiro &&
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Carona aceita!</Text>
                  }
                  {
                    !buscandoPassageiro &&
                    <Image 
                      source={
                        imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                    />
                  }
                  {
                    !buscandoPassageiro &&
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                  }
                  {
                    !buscandoPassageiro &&
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
                  }
            
                   {
                    !caronaAceita && !buscandoPassageiro &&
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        onPress={()=>{oferecerCarona()}}
                    >
                        <Text style={styles.textStyle}>Oferecer carona</Text>
                    </TouchableOpacity>
                   }
                   {
                    caronaAceita && !buscandoPassageiro &&
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                        onPress={() => {buscarPassageiro()}}
                    >
                        <Text style={styles.textStyle}>Buscar passageiro(a)</Text>
                    </TouchableOpacity>
                   }
                   {
                    !caronaAceita && !buscandoPassageiro &&
                   <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                        onPress={() => {
                          setModalVisible(!modalVisible)}}
                    >
                        <Text style={styles.textStyle}>Cancelar</Text>
                    </TouchableOpacity>
                   }
                   {
                    buscandoPassageiro &&
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Informações de rota</Text>
                   }
                    {
                    buscandoPassageiro &&
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Pressione no ícone de mapa no canto inferior direito que você será redirecionado(a) para o aplicativo de rotas.</Text>
                   }
                   {
                    buscandoPassageiro &&
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          setBuscandoPassageiro(!buscandoPassageiro);
                        }}
                    >
                        <Text style={styles.textStyle}>Entendi</Text>
                    </TouchableOpacity>
                   }
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