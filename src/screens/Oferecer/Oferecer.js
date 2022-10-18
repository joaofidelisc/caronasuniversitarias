import React, {useState, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet, PermissionsAndroid, Dimensions, Modal, TouchableOpacity, Image, ScrollView, BackHandler} from 'react-native';

import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import config from '../../config';
import Geocoder from 'react-native-geocoding';


const {width, height} = Dimensions.get('screen');

function Oferecer({route}) {
  const [region, setRegion] = useState(null);  //Coordenadsa atuais do motorista (latitude e longitude);
  
  const [modalVisible, setModalVisible] = useState(false); //Define se o modal é mostrado ou não;
  const [imageUser, setImageUser] = useState('');  //Define a url da imagem do possível caronista para cada caronista e para cada vez que é chamada a função buscaUsuario;
  const [nomeCaronista, setNomeCaronista] = useState(''); //Define o nome do caronista para cada caronista e para cada vez que é chamada a função buscaUsuario;
  const [nomeDestinoCaronista, setNomeDestinoCaronista] = useState(''); //Define o nome do destino para cada caronista e para cada vez que é chamada a função buscaUsuario;

  const [vetorCaronistas, setCaronistas] = useState([]); //Vetor de todos os caronistas atuais (com caronas aceitas e buscando carona);
  
  const [uidPassageiro, setUidPassageiro] = useState(''); //Contém apenas 1 uid armazenado (o uid do pin clicado no momento);

  const [passageiros, setPassageiros] = useState([]); //Vetor com todos os passageiros que aceitaram a carona do motorista corrente (motorista atual);

  const [caronaAceita, setCaronaAceita] = useState(false); //Checa se o motorista tem alguma carona aceita;

  const [numCaronasAceitas, setNumCaronasAceitas] = useState(0); //Controla o número de caronas que o motorista pode oferecer de acordo com o número de vagas disponíveis;

  const [exibirCaronistas, setExibirCaronistas] = useState(false); //Controla se os caronistas (pessoas que aceitaram a carona do motorista atual) serão exibidas na tela;
  const [buscandoPassageiro, setBuscandoPassageiro] = useState(false); //Controla se o motorista está buscando algum passageiro;
  const [oferecerMaisCaronas, setOferecerMaisCaronas] = useState(true); //Define se o motorista pode oferecer mais caronas ou não.


  const [existeBanco, setExisteBanco] = useState(false);

  //Informações do motorista
  const cidade = route.params?.cidade; 
  const estado = route.params?.estado;
  const destino = route.params?.destino;
  const vagasDisponiveis = route.params?.vagas;

  const currentUser = auth().currentUser.uid;


  //Função responsável por solicitar ao motorista para ligar sua localização.
  const localizacaoLigada = async()=>{
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
    }).catch((error) => {
        console.log(error.message); // error.message => "disabled"
    });
  }

  
  /*
    Função responsável por 'desenhar' os marcadores (caronistas) no mapa;
    A lógica empregada é iterar por todos os marcadores na primeira vez e caso tenha algum marcador a ser inserido, apenas inserimos; 
    caso um marcador mude de posição, ele é apenas atualizado e, caso um caronista desista de buscar carona, o marcador é removido.
  */
  
  function getCaronistasMarker(){
    let jaExiste = false;
    if (jaExiste == true){
      jaExiste = false;
    }
    let filhoRemovido = '';
    if (filhoRemovido != ''){
      filhoRemovido = '';
    }
    try{
      database().ref().child(`${estado}/${cidade}/Passageiros`).on('child_removed', function(snapshot){
        filhoRemovido = snapshot.key;
        vetorCaronistas.some(caronista=>{
          if (caronista.uid == filhoRemovido){
            vetorCaronistas.splice(vetorCaronistas.indexOf(caronaAceita), 1);
          }
        })
      })
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


  /*
    Função responsável por atualizar o estado (latitude e longitude) do motorista em tempo real;
    Atualiza no banco de dados essa posição.
  */
  function atualizaEstado(){
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
  
  /*
    Função responsável por definir um estado inicial para o motorista, ou seja, sua posição inicial ao iniciar o App;
    Quando o app é iniciado, é necessário verificar se o banco de dados para esse motorista já existe e, caso contrário, ele deve ser criado;
    O banco de dados nessa parte utilizado é em tempo real (Realtime Database).
  */
  function estadoInicial(){
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
   
    try{
      reference.once('value').then(function(snapshot){
        setExisteBanco(snapshot.exists());
      })
    }catch(error){
      console.log('erro em estadoInicial()');
    }

    if (!existeBanco){
      try{
        reference.set({
          latitudeMotorista: region.latitude,
          longitudeMotorista: region.longitude,
          caronasAceitas:'',
          ativo: true,
          nomeDestino: destino
        });
      }catch(error){
        console.log('atualizaEstado, ERRO:', error.code);
      }
    }
  }
  
  //Função responsável por obter a localização do motorista em tempo real.
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
      if (!existeBanco){
        console.log('NÃO EXISTE BANCO...');
        estadoInicial();
      }
      atualizaEstado();
    }catch(error){
      console.log(error.code);
    }
  }
  
  /*
    Função responsável por recuperar o url da foto do passageiro no banco de dados;
    A foto é exibida no modal e na lista de caronas aceitas.
  */
  const getFotoStorage = async(userUID)=>{
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
    return url;
  }
  

  /*
    Função responsável por retornar o nome do caronista.
  */
  const getNomeCaronista = async(userUID)=>{
    let nomeCaronista = '';
    try{
      firestore().collection('Users').doc(userUID).onSnapshot(documentSnapshot=>{
        setNomeCaronista(documentSnapshot.data().nome)
      });
      nomeCaronista = documentSnapshot.data().nome;
    }catch(error){
      console.log('erro em getNomeCaronista');
    }
    return nomeCaronista;
  }

  
  /* 
    Função responsável por obter o destino do caronista com base em seu UserID;
    Essa função é chamada apenas quando um marcador é pressionado.
  */
  const getDestinoCaronista =  async(userUID)=>{
    let destino = '';
    try{
      database().ref(`${estado}/${cidade}/Passageiros/${userUID}`).once('value').then(snapshot=>{
        setNomeDestinoCaronista(snapshot.val().nomeDestino);
      })
      destino = snapshot.val().nomeDestino;
    }catch(error){
      console.log(error.code);
    }
    return destino;
  }


  /*
    Função responsável por buscar e exibir o modal do usuário após o motorista clicar no pin do caronista;
    Busca o nome, foto e define o UID no hook para ser possível oferecer carona.
  */
  const buscaUsuario = async(userUID, caronaAceita)=>{
    if (caronaAceita != ''){
      if (caronaAceita.includes(currentUser)){
        console.log("o passageiro aceitou sua carona!");
      }
    }else{
      try{
        await getFotoStorage(userUID);
        await getNomeCaronista(userUID);
        await getDestinoCaronista(userUID);
      }catch(error){
        console.log('erro em buscaUsuario');
      }
      setUidPassageiro(userUID);
      setModalVisible(true);
      }
    }

 
  /*
    Função responsável por oferecer carona a um possível passageiro;
    Essa função, escreve no banco de dados do Passageiro em 'ofertasCaronas' o UID do motorista;
    A ideia é concatenar a string da caronas já existente em 'ofertasCaronas' do passageiro com o UID do motorista, mantendo assim, os demais motoristas oferecedores
    de carona.
  */
  function oferecerCarona(){
    let listaCaronas = '';
    setModalVisible(false);
    try{
      database().ref(`${estado}/${cidade}/Passageiros/${uidPassageiro}`).once('value').then(snapshot=>{
        listaCaronas = snapshot.val().ofertasCaronas;
        if (!listaCaronas.includes(currentUser)){
          if (listaCaronas == ''){
            listaCaronas = currentUser;
          }else{
            listaCaronas = listaCaronas.concat(', ',currentUser); 
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


  /*
    A função abaixo é responsável por criar e atualizar um vetor de caronistas que aceitaram a carona proposta, chamado de passageiros;
    A cada nova carona aceita, o vetor é atualizado.
  */
  const caronasAceitas = async()=>{
    let listaUIDsCaronas = '';
    let arrayUIDs = [];

    let jaExiste = false;
    if (jaExiste == false){
      jaExiste = true;
    }
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}/caronasAceitas`);
    try{
      reference.on('value', function(snapshot){
        if (snapshot.exists() && snapshot.val().caronasAceitas != undefined){
          listaUIDsCaronas = snapshot.val();
          listaUIDsCaronas != ''?setCaronaAceita(true):setCaronaAceita(false);
          arrayUIDs = listaUIDsCaronas.split(', ');
          console.log('arrayUIDS:', arrayUIDs);
          arrayUIDs.forEach(uid=>{
            console.log('\nuid:', uid);
          })
        }
      })
    }catch(error){
      console.log('erro em caronasAceitas');
    }
    // try{
    //   reference.on('value', function(snapshot){
    //     if (snapshot.exists() && snapshot.val().caronasAceitas != undefined){
    //       listaUIDsCaronas = snapshot.val().caronasAceitas;
    //       if (listaUIDsCaronas != ''){
    //         setCaronaAceita(true);
    //       }else{
    //         setCaronaAceita(false);
    //       }
    //     }
    //     arrayUIDs = listaUIDsCaronas.split(', ');
    //     arrayUIDs.forEach(uid=>{
    //       if (passageiros.length == 0){
    //         setNumCaronasAceitas(numCaronasAceitas+1);
    //         setPassageiros([{
    //           uid: uid,
    //         }])
    //       }else{
    //         passageiros.some(uidPassageiro=>{
    //           if (uidPassageiro.uid == uid){
    //             jaExiste = true;
    //           }
    //         })
    //         if (!jaExiste){
    //           setNumCaronasAceitas(caronasAceitas+1);
    //           setPassageiros([...passageiros, {
    //             uid: uid,
    //           }])
    //         }
    //       }
    //     })
    //   })
    // }catch(error){
    //   console.log('erro em caronasAceitas()');
    // }
  }

  /*
    A função abaixo é responsável por impedir que um passageiro dê carona a ele mesmo como motorista;
    Esse 'impedimento' é realizado, verificando o banco de dados dos passageiros e excluindo-o caso o motorista esteja incluso lá.
  */
  const excluiBancoMotoristaPassageiro = async()=>{
    const currentUser = auth().currentUser.uid;
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference.on('child_added', snapshot=>{
        reference.remove();
      })
    }catch(error){
      console.log('excluiBancoMotoristaPassageiro');
    }
  }


    
  /*
    A implementação dessa função não está concluída, mas a ideia é chamá-la sempre que for buscar um passageiro que aceitou uma carona do motorista corrente.
  */
  const buscarPassageiro = async()=>{
    console.log('Buscando passageiro...\n');
    // setBuscandoPassageiro(true);
  }


  useEffect(()=>{
    console.log('TELA: Oferecer');
    Geocoder.init(config.googleAPI, {language:'pt-BR'});
    estadoInicial();
    getMyLocation();
    getCaronistasMarker();
    caronasAceitas();
    BackHandler.addEventListener('hardwareBackPress', ()=>{
      return true
    })
  }, [vetorCaronistas, existeBanco])
  
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
            {/* {
              //utilizado para traçar a rota
              destination &&
              <MapViewDirections
                  origin={region}
                  destination={destination}
                  apikey={config.googleAPI}
                  strokeWidth={3}
                  strokeColor='#FF5F55'
                />
            } */}
          </MapView>
          {
            caronaAceita &&
            <TouchableOpacity 
              style={{position: 'absolute', bottom: 15, backgroundColor: '#FF5F55', width: 200, height: 47, borderRadius: 15, justifyContent: 'center'}}
              onPress={()=>{setExibirCaronistas(!exibirCaronistas)}}  
            >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 16, textAlign: 'center'}}>Exibir caronistas</Text>
            </TouchableOpacity>
          }
          {
            exibirCaronistas &&
            <ScrollView style={{position: 'absolute', bottom: 0, width: '95%', height:'40%', backgroundColor: 'white', borderRadius: 10, flex:1, borderColor: '#FF5F55', borderWidth: 5}}>
              <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, textAlign:'center', marginTop: 12}}>Caronas aceitas</Text>
              {
                passageiros.map(passageiro=>(
                  <View 
                    style={styles.viewCaronistas}
                    key={passageiro.uid}
                    >
                    <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, textAlign:'center'}}>Nome: {passageiro.uid}</Text>
                    <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, textAlign:'center'}}>Destino:</Text>
                    <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, textAlign:'center'}}>{passageiro.uid}</Text>
                    <Text>{passageiro.uid}</Text>
                  </View>
                ))
              }
             
              <TouchableOpacity 
              style={{bottom: 15, backgroundColor: '#FF5F55', width: 200, height: 47, borderRadius: 15, justifyContent: 'center', alignSelf: 'center', marginTop: 40}}
              onPress={()=>{setExibirCaronistas(!exibirCaronistas)}}  
              >
                <Text style={{color: 'white', fontWeight: '600', fontSize: 16, textAlign: 'center'}}>Fechar lista</Text>
              </TouchableOpacity>
            </ScrollView>
          }
       
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                  {
                    oferecerMaisCaronas &&
                    <>
                      <Image 
                        source={imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                      />
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
                      <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                          onPress={()=>{oferecerCarona()}}
                      >
                          <Text style={styles.textStyle}>Oferecer carona</Text>
                      </TouchableOpacity>
                     <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                          onPress={() => {
                            setModalVisible(!modalVisible)}}
                      >
                        <Text style={styles.textStyle}>Cancelar</Text>
                    </TouchableOpacity>
                    </>
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
  viewCaronistas:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 330, 
    height: 150, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    alignSelf:'center', 
    marginTop: 50,
    alignContent:'center'
  }
});

export default Oferecer;