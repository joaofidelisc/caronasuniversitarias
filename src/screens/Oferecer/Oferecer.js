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
  //por que usar isso?
  const mapEL = useRef(null);
  const [region, setRegion] = useState(null);  
  const [destination, setDestination] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  //USADO NO MODAL
  const [message, setMessage] = useState('');
  const [imageUser, setImageUser] = useState('');
  
  const [vetorCaronistas, setCaronistas] = useState([]);
  
  const [nomeCaronista, setNomeCaronista] = useState('');
  const [nomeDestinoCaronista, setNomeDestinoCaronista] = useState('');
  
  const [uidPassageiro, setUidPassageiro] = useState('');
  
  const [lotacaoAtingida, setLotacaoAtingida] = useState(false);
  const [caronaAceita, setCaronaAceita] = useState(false);
  const [oferecerMaisCaronas, setOferecerMaisCaronas] = useState(false);

  const [buscandoPassageiro, setBuscandoPassageiro] = useState(false);

  const [estadoInicialControle, setEstadoInicialControle] = useState(false);
  
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');

  // const cidade = '';
  // const estado = '';
  
    // const reverseGeocoding = async()=>{
    //   var cidade = (await Geocoder.from(-21.98186, -47.88460)).results[0].address_components[1].short_name;
    //   var estado = (await Geocoder.from(-21.98186, -47.88460)).results[0].address_components[3].short_name;      setCidade(cidade);
    // }

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


  function getDestinoCaronista(userUID){
    try{
      database().ref(`${estado}/${cidade}/Passageiros/${userUID}`).once('value').then(snapshot=>{
        setNomeDestinoCaronista(snapshot.val().nomeDestino);
        console.log('Destino:', nomeDestinoCaronista);
      })
    }catch(error){
      console.log(error.code);
    }
  }

  // function getCaronistasMarker(){
  //   var reference = database().ref('Passageiros');
  //   // console.log('Vetor caronas:');
  //   // console.log(vetorCaronistas);
  //   reference.on('child_added', function(data){
  //     // console.log('usuario adicionado(a):', data.key);
  //     setCaronistas([...vetorCaronistas, {
  //       latitude: data.val().latitudePassageiro,
  //       longitude: data.val().longitudePassageiro,
  //       uid: data.key,          
  //       }
  //     ])
      
  //   })
  // }



  // function getCaronistasMarker(){
  //   var reference = database().ref('Passageiros');
  //   try{
  //     if (vetorCaronistas.length == 0){
  //       database().ref().child('Passageiros').once('value', function(snapshot){
  //         snapshot.forEach(function(userSnapshot){
  //           setCaronistas([...vetorCaronistas, {
  //             latitude: userSnapshot.val().latitudePassageiro,
  //             longitude: userSnapshot.val().longitudePassageiro,
  //             uid: userSnapshot.key,          
  //             }
  //           ])
  //         })
  //       })
  //     }else{
  //       reference.on('child_added', function(data){
  //         setCaronistas([...vetorCaronistas, {
  //           latitude: data.val().latitudePassageiro,
  //           longitude: data.val().longitudePassageiro,
  //           uid: data.key,          
  //           }
  //         ])
  //       })
  //     }
  //   }catch(error){
  //     console.log('Deu erro aqui!');
  //   }
  //   console.log('VETOR:', vetorCaronistas);
  // }

  function getCaronistasMarker(){
  // const getCaronistasMarker = async() => {
    // var bd = database().ref('Passageiros');
    let jaExiste = false;
    if (jaExiste == true){
      jaExiste = false;
    }
    try{
      // bd.on('child_changed', function(data){
      //   console.log('Atualizou!!!!!');
      //   console.log('Titulo:', data.key);
      // })

      database().ref().child(`${estado}/${cidade}/Passageiros`).on('value', function(snapshot){
        snapshot.forEach(function(userSnapshot){
          // console.log('USER UID:', userSnapshot.key);          
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
                console.log('Atualizando posição...\n');
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].latitude = userSnapshot.val().latitudePassageiro;
                vetorCaronistas[vetorCaronistas.indexOf(caronista)].longitude = userSnapshot.val().longitudePassageiro;
                jaExiste = true;
              }
            })
            if (!jaExiste){
              console.log('Não está presente!');
              setCaronistas([...vetorCaronistas, {
                latitude: userSnapshot.val().latitudePassageiro,
                longitude: userSnapshot.val().longitudePassageiro,
                uid: userSnapshot.key,
                caronasAceitas: userSnapshot.val().caronasAceitas,      
                }
              ])
            }
          }
          // await setTimeout(50);
          // console.log('VETOR OFERECER:\n');
          // console.log(vetorCaronistas);
          // await setTimeout(5000);
        })
      })
    }catch(error){
      // console.log('ERRO', error.code);
    }
  }

  //atualiza o estado do motorista

  function atualizaEstado(){
   const currentUser = auth().currentUser.uid;
   const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
   try{
     reference.update({
       latitudeMotorista: region.latitude,
       longitudeMotorista: region.longitude,
       ativo: true,
      });
      // }).then(()=> console.log('coordenadas enviadas!'));
    }catch(error){
      console.log('atualizaEstado, ERRO:', error.code);
    }
  }
  
  async function localizacaoReversa(latitude, longitude){
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
    console.log('cidade dentro de geocoder:', cidade);
    console.log('estado dentro de geocoder:', estado);
    
    setCidade(filtro_cidade[0].short_name);
    setEstado(filtro_estado[0].short_name);

    //aqui eu busco entender se o banco de motoristas para aquele motorista no estado/cidade já existe;
    //se não existe, eu crio ele
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
        // }).then(()=> console.log('coordenadas enviadas!'));
      }catch(error){
        console.log('atualizaEstado, ERRO:', error.code);
      }
    }
  }

  function estadoInicial(){
    try{
      Geolocation.getCurrentPosition(info=>{
        localizacaoReversa(info.coords.latitude, info.coords.longitude);
      },
      ()=>{console.log('Atualizando...')}, {
        enableHighAccuracy:false,
        timeout:2000,
      })
    }catch(error){
      console.log(error.code);
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
  
  //terminar de implementar aqui
  //exibe o modal em duas ocasiões:
  //1º quando o caronista não tem carona aceita;
  //2º quando o caronista aceita uma carona, exibe o modal automaticamente, caronasAceitas do passaigeiro == uidMotorista
  const buscaUsuario = async(userUID, caronaAceita)=>{
    // console.log('você clicou no usuário:', userUID);
    // console.log('')
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${userUID}`);
    if (caronaAceita == '' || caronaAceita == true){
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
      setMessage('Usuário');
      setModalVisible(true);
    }else{
      try{
        reference.once('value', function(snapshot){
          // console.log(snapshot.val());
          if (snapshot.val().caronasAceitas != ''){
            console.log('Carona aceita. Motorista UID:', snapshot.val().caronasAceitas);
          }
          // console.log('Passando por aqui!');
          //IMPLEMENTAR AQUI APÓS DÚVIDAS
        })
      }catch(error){
        console.log(error.code);
      }
      console.log('Esse passageiro já tem uma carona aceita!');
    }  
  }

  //O MOTORISTA PODE OFERECER QUANTAS CARONAS PRO PASSAGEIRO?
  //A CADA QUANTO TEMPO?

  
  function oferecerCarona(){
    // console.log('UID Passageiro:', uidPassageiro);
    let vetorCaronas = [];
    setModalVisible(false);
    
    const uidMotorista = auth().currentUser.uid;
    try{
      database().ref(`${estado}/${cidade}/Passageiros/${uidPassageiro}`).once('value').then(snapshot=>{
        vetorCaronas.push(snapshot.val().ofertasCaronas);
        if (!vetorCaronas.includes(uidMotorista)){
          vetorCaronas.push(uidMotorista);
        }
        console.log('VETOR DE CARONAS:', vetorCaronas);
      })
      database().ref(`${estado}/${cidade}/Passageiros/${uidPassageiro}`).update({
        ofertasCaronas: uidMotorista
      });
    }catch(error){
      console.log('Deu algum erro aqui :(');
    }
  }

  //verifica as caronasAceitas no banco de motoristas
  //ESSA FUNÇÃO FAZ APARECER O MODAL NA TELA QUANDO O CARONISTA ACEITA UMA PROPOSTA DE CARONA DO MOTORISTA
  function caronasAceitas(){
    const currentUser = auth().currentUser.uid;
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    
    // console.log(reference); 
    try{
      if (!reference.toString().includes('null')){ //MUDAR A LÓGICA AQUI
        reference.on('value', function(snapshot){
          if (snapshot.val().caronasAceitas != ''){
            setCaronaAceita(true);
            buscaUsuario(snapshot.val().caronasAceitas, true);
          } else{
            // console.log('Aguardando aceitar...');
          }
        })
      }
    } catch(error){
      console.log('Error', error.code);
    }
  }

  function buscarPassageiro(){
    console.log('Buscando passageiro...\n');
    // setModalVisible(!modalVisible);
    setCaronaAceita(false);
    setBuscandoPassageiro(true);
  }
  
  //remover minha localização como passageiro do banco, pra não ser possível oferecer carona pra mim mesmo
  useEffect(()=>{
    console.log('TELA: Oferecer');
    Geocoder.init(config.googleAPI, {language:'pt-BR'});
    // reverseGeocoding();
    estadoInicial();
    getMyLocation();
    getCaronistasMarker();
    caronasAceitas();
  }, [vetorCaronistas])
  
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
                    buscaUsuario(passageiro.uid, passageiro.caronasAceitas);
                  }}
                  title={passageiro.uid}
                  icon={passageiro.caronasAceitas==''?require('../../assets/icons/caronista.png'):require('../../assets/icons/carona_aceita.png')}
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
        {/* <GooglePlacesAutocomplete
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
        /> */}
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
                        // onPress={() => setModalVisible(!modalVisible)}
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