import React, {useState, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet, PermissionsAndroid, Dimensions, Modal, TouchableOpacity, Image, ScrollView, BackHandler, Linking, Platform} from 'react-native';

import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import { StackActions } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import config from '../../config';
import Geocoder from 'react-native-geocoding';

import notifee, { AndroidColor } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import NotificationService from '../Notificacoes/PushNotifications';
import { AndroidImportance } from '@notifee/react-native';


const {width, height} = Dimensions.get('screen');

function Oferecer({route, navigation}) {
  const [region, setRegion] = useState(null);  //Coordenadsa atuais do motorista (latitude e longitude);
  
  const [modalVisible, setModalVisible] = useState(false); //Define se o modal é mostrado ou não;
  const [imageUser, setImageUser] = useState('');  //Define a url da imagem do possível caronista para cada caronista e para cada vez que é chamada a função buscaUsuario;
  const [nomeCaronista, setNomeCaronista] = useState(''); //Define o nome do caronista para cada caronista e para cada vez que é chamada a função buscaUsuario;
  const [nomeDestinoCaronista, setNomeDestinoCaronista] = useState(''); //Define o nome do destino para cada caronista e para cada vez que é chamada a função buscaUsuario;
  const [latitudePassageiro, setLatitudePassageiro] = useState('');
  const [longitudePassageiro, setLongitudePassageiro] = useState('');
  const [alertaVagas, setAlertaVagas] = useState(true);
  const [alertaVagasDisponiveis, setAlertaVagasDisponiveis] = useState(false);
  const [alertaViagem, setAlertaViagem] = useState(false);
  const [vetorCaronistas, setCaronistas] = useState([]); //Vetor de todos os caronistas atuais (com caronas aceitas e buscando carona);
  const [uidPassageiro, setUidPassageiro] = useState(''); //Contém apenas 1 uid armazenado (o uid do pin clicado no momento);

  const [passageiros, setPassageiros] = useState([]); //Vetor com todos os uids dos passageiros que aceitaram a carona do motorista corrente (motorista atual);

  const [existeCaronaAceita, setExisteCaronaAceita] = useState(false); //Checa se o motorista tem alguma carona aceita;

  const [numCaronasAceitas, setNumCaronasAceitas] = useState(0); //Controla o número de caronas que o motorista pode oferecer de acordo com o número de vagas disponíveis;
  const [uidPassageiroEmbarque, setUIDPassageiroEmbarque] = useState(null);

  const [oferecerMaisCaronas, setOferecerMaisCaronas] = useState(true); //Define se o motorista pode oferecer mais caronas ou não.
  const [exibeModalOferecer, setExibeModalOferecer] = useState(true);
  const [existePassageiroAbordo, setExistePassageiroAbordo] = useState(false);
  const [passageirosAbordo, setPassageirosAbordo] = useState(0);
  const [existeBanco, setExisteBanco] = useState(''); //Controla se o banco de dados existe ou deve ser criado (antes de ser atualizado).
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
      //tratar aqui:
      //dá problema quando eu aperto em encerrar viagem na tela de ViagemEmandamento
      // database().ref().child(`${estado}/${cidade}/Passageiros`).on('child_removed', function(snapshot){
      //   filhoRemovido = snapshot.key;
      //   vetorCaronistas.some(caronista=>{
      //     if (caronista.uid == filhoRemovido){
      //       vetorCaronistas.splice(vetorCaronistas.indexOf(caronaAceita), 1);
      //     }
      //   })
      // })
      database().ref().child(`${estado}/${cidade}/Passageiros`).on('value', function(snapshot){
        if (snapshot.exists()){
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
        }
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
          nomeDestino: destino,
          buscandoCaronista: '',
          caronistasAbordo: '',
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
    OBS: tentar implementar essa função com get do firestore.
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

  const getClassificacaoCaronista = async(caronistaUID)=>{
    let classificacaoAtual = 0;
    const reference_caronista = firestore().collection('Users').doc(caronistaUID);
    try{
      await reference_caronista.get().then((reference)=>{
        if (reference.exists){
          classificacaoAtual = reference.data().classificacao;
          if (classificacaoAtual == undefined){
            classificacaoAtual = 0;
          }
          return parseFloat(classificacaoAtual.toFixed(2));
        }
      })
    }catch(error){
      console.log('erro em recuperaClassificacaoMotorista');
    }
    return parseFloat(classificacaoAtual.toFixed(2));
  }

  /*
    Função responsável por buscar e exibir o modal do usuário após o motorista clicar no pin do caronista;
    Busca o nome, foto e define o UID no hook para ser possível oferecer carona.
  */
  const getDadosUsuario = async(userUID, caronaAceita, latitude, longitude)=>{
    if (exibeModalOferecer == false){
      setExibeModalOferecer(true);
    }
    if (caronaAceita != ''){
      if (caronaAceita.includes(currentUser)){
        await getFotoStorage(userUID);
        await getNomeCaronista(userUID);
        await getDestinoCaronista(userUID);
        setLatitudePassageiro(latitude);
        setLongitudePassageiro(longitude);
        setExibeModalOferecer(false);
        setModalVisible(true);
        console.log("o passageiro aceitou sua carona!");
      }
    }else{
      if (exibeModalOferecer){
        try{
          await getFotoStorage(userUID);
          await getNomeCaronista(userUID);
          await getDestinoCaronista(userUID);
        }catch(error){
          console.log('erro em getDadosUsuario');
        }
        setUidPassageiro(userUID);
        setModalVisible(true);
        }
      }
    }

 
  /*
    Função responsável por oferecer carona a um possível passageiro;
    Essa função, escreve no banco de dados do Passageiro em 'ofertasCaronas' o UID do motorista;
    A ideia é concatenar a string da caronas já existente em 'ofertasCaronas' do passageiro com o UID do motorista, mantendo assim, os demais motoristas oferecedores
    de carona.
  */
  function oferecerCarona(){
    let tituloNotificacao = 'Opa! Um motorista te ofereceu carona!';
    let mensagemNotificacao = 'Encontramos uma carona para você!';
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
          sendNotification(uidPassageiro, tituloNotificacao, mensagemNotificacao);
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
    let uidsPassageiros = '';
    let arrayUIDsPassageiros = [];
    let jaExiste = false;
    if (jaExiste == true){
      jaExiste = false;
    }
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}/caronasAceitas`);
    if (existeBanco){
      try{
        reference.on('value', function(snapshot){
          if (snapshot.exists()){
            uidsPassageiros = snapshot.val();
            arrayUIDsPassageiros = uidsPassageiros.split(', ');
            console.log('------------------------------------------------');
            console.log('FUNÇÃO caronasAceitas()');
            console.log('TELA OFERECER CARONA\n\n\n\n');
            console.log('uidsPassageiros:', uidsPassageiros);
            console.log('arrayUIDsPassageiros:', arrayUIDsPassageiros);
            console.log('------------------------------------------------');
            if (arrayUIDsPassageiros[0] != '' && arrayUIDsPassageiros[0] != undefined && vagasDisponiveis>numCaronasAceitas){
              setExisteCaronaAceita(true);
              setNumCaronasAceitas(arrayUIDsPassageiros.length);
              if (!passageiros.includes(arrayUIDsPassageiros[arrayUIDsPassageiros.length-1])){
                setPassageiros([...passageiros, arrayUIDsPassageiros[arrayUIDsPassageiros.length-1]]);
              }
            }else{
              if (vagasDisponiveis == numCaronasAceitas && oferecerMaisCaronas){
                setOferecerMaisCaronas(false);
                setModalVisible(!modalVisible);
              }
            }
          }
        })
      }catch(error){
        console.log('erro em caronasAceitas -> função');
      }
    }
  }


  /*
    A função abaixo é responsável por impedir que um passageiro dê carona a ele mesmo como motorista;
    Esse 'impedimento' é realizado, verificando o banco de dados dos passageiros e excluindo-o caso o motorista esteja incluso lá.
  */
  const excluiBancoMotoristaPassageiro = async()=>{
    // const currentUser = auth().currentUser.uid;
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference.on('child_added', snapshot=>{
        reference.remove();
      })
    }catch(error){
      console.log('excluiBancoMotoristaPassageiro');
    }
  }
  

  
  const rotaPassageiro = async (latitude, longitude, nome, uidCaronista) => {
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    //
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = nome;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    //
    try{
      reference.update({
        buscandoCaronista: uidCaronista,
      })
      buscarPassageiro(latitude, longitude, nome, uidCaronista);
    }catch(error){
      console.log('erro em rotaPassageiro');
    }
    Linking.openURL(url);
  }

  const distanciaPassageiroMotorista = async(latitude, longitude)=>{
    const latitudePassageiro = latitude;
    const longitudePassageiro = longitude;
    const latitudeMotorista = region.latitude;
    const longitudeMotorista = region.longitude;
    let distancia = 0;
    var deg2rad = function (deg) { return deg * (Math.PI / 180); },
    R = 6371,
    dLat = deg2rad(latitudePassageiro - latitudeMotorista),
    dLng = deg2rad(longitudePassageiro - longitudeMotorista),
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(deg2rad(latitudeMotorista))
        * Math.cos(deg2rad(latitudeMotorista))
        * Math.sin(dLng / 2) * Math.sin(dLng / 2),
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distancia = ((R * c *1000).toFixed());
    return distancia;
  }
  
  const buscarPassageiro = async(latitude, longitude, nome, uidCaronista)=>{
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    let distPassageiroMotorista = await distanciaPassageiroMotorista(latitude, longitude);
    let tituloNotificacao = '';
    let mensagemNotificacao = '';    
    reference.once('value', function(snapshot){
      reference.update({
        buscandoCaronista: uidCaronista
    })
      if (distPassageiroMotorista < 6 && !snapshot.val().caronistasAbordo.includes(uidCaronista)){
        setUIDPassageiroEmbarque(uidCaronista);
        tituloNotificacao = 'Seu motorista chegou!';
        mensagemNotificacao = 'Embarque no veículo.';
        // mensagem = 'Seu motorista chegou!';
        sendNotification(uidCaronista, tituloNotificacao, mensagemNotificacao);
        setModalVisible(false);
      }
      })
    }
    
    const embarquePassageiro = async(uidPassageiro)=>{
      setUIDPassageiroEmbarque(null);
      setPassageirosAbordo(passageirosAbordo+1);
      setExistePassageiroAbordo(true);
      let listaPassageirosAbordo = '';
      let listaPassageirosAtualizada = '';
      const reference_passageiro = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
      reference_passageiro.once('value', function(snapshot){
        listaPassageirosAbordo = snapshot.val().caronistasAbordo;
        if (!listaPassageirosAbordo.includes(uidPassageiro)){
          if (listaPassageirosAbordo == ''){
            listaPassageirosAtualizada = uidPassageiro;
          }else{
            listaPassageirosAtualizada = listaPassageirosAbordo.concat(', ',uidPassageiro);
          }     
        }
        reference_passageiro.update({
          caronistasAbordo: listaPassageirosAtualizada,
          buscandoCaronista: '',
        });
        passageiros.splice(passageiros.indexOf(uidPassageiro), 1);
        //falta remover do array de caronistas?
      })
  }


  const iniciarViagem = async()=>{
    console.log('iniciando viagem...');
    console.log('passageiros a bordo:', passageirosAbordo);
    if (passageirosAbordo < vagasDisponiveis){
      setAlertaViagem(true)
    }else{
      navigation.navigate('ViagemMotorista', {currentUser: currentUser, cidade: cidade, estado: estado});
    }
  }

  const desistirDaOferta = async()=>{
    console.log('desistindo de oferecer carona...');
    const referece_motorista = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    let caronasAceitas = '';
    try{
      referece_motorista.once('value').then(snapshot=>{
        caronasAceitas = snapshot.val().caronasAceitas;
        if (caronasAceitas == '' || caronasAceitas == undefined){
          referece_motorista.remove();
          navigation.navigate('ConfigurarCarona');
        }else{
        }
        // console.log('caronasAceitas: ',snapshot.val().caronasAceitas);
      })
    }catch(error){
      console.log('erro em desistirDaOferta');
    }
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
  }, [vetorCaronistas, existeBanco, numCaronasAceitas, existePassageiroAbordo]);

  //Notificações


  //Hook para setar o token em string que será posteriormente utilizada 
  //** ALTERAR ** O token que está sendo salvo é o do próprio usuário, mas tal token só deve ser salvo no banco
  //A string de token usada para as notificações deve ser a do passageiro/motorista que está interagindo com o usuário atual
  const [token,setToken] = useState("")

  useEffect(() => {
    getFCMToken();
    requestPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', JSON.stringify(remoteMessage));
      DisplayNotification(remoteMessage);
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    armazenaToken(); //
    return unsubscribe;
  }, [token]);

  const getFCMToken = async() => {
   await messaging()
      .getToken()
      .then(token => {
        console.log('token=>>>', token); //armazenar token na string //esse token é o token do motorista;
        setToken(token)
      });
  };

  //Verificação de permissão para envio de mensagens (geralmente no android a permissão é concedida por padrão)
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

  async function DisplayNotification(remoteMessage) {
    //Função para criar canal de notificações com o notifee
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Canal oferecer',
      importance: AndroidImportance.HIGH,
    });

    // Notifee muda a interface da notificação. Mude aqui para alterar a notificação única
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        largeIcon: 'https://img.icons8.com/plasticine/344/car--v1.png',
        color: '#E8210C',
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      },
    });
  }
  
  //função envio de notificação simples. Deve-se determinar o título da notificação, corpo e passar o token de destino
  const sendNotification = async (uidPassageiro, tituloNotificacao, mensagemNotificacao) => {
    let docRef = firestore().collection('Users').doc(uidPassageiro);
    try{
      docRef.get().then((doc)=>{
        if (doc.exists){
          if (doc.data().token != undefined){
            let notificationData = {
              title: tituloNotificacao,
              body: mensagemNotificacao,
              token:
                doc.data().token
            };
            //chama a função sendSingleDeviceNotification do servidor de notificações (NotificationService), importado no ínicio (PushNotifications.js)
            NotificationService.sendSingleDeviceNotification(notificationData);
          }
          // console.log('token armazenado:', doc.data().token);
        }
      })
    }catch(error){
      console.log('erro em armazenaToken');
    }
  };


  //enviar notificação para o motorista????
  const armazenaToken = async()=>{
    let docRef = firestore().collection('Users').doc(currentUser);
    try{
      docRef.get().then((doc)=>{
        if (doc.exists){
          // if (doc.data().token == undefined || doc.data().token == ''){
          docRef.update({
            token: token
          })
          // }
          console.log('token armazenado:', doc.data().token);
        }
      })
    }catch(error){
      console.log('erro em armazenaToken');
    }
  }


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
              oferecerMaisCaronas &&
              vetorCaronistas.map(caronista=>(
                <Marker
                  key={caronista.uid}
                  coordinate={{ latitude : caronista.latitude , longitude : caronista.longitude}}
                  tappable={caronista.caronasAceitas.includes(currentUser)?true:false}
                  onPress={()=>{
                    getDadosUsuario(caronista.uid, caronista.caronasAceitas, caronista.latitude, caronista.longitude);
                  }}
                  
                  icon={
                    caronista.caronasAceitas==''?require('../../assets/icons/caronista.png'):caronista.caronasAceitas.includes(currentUser)?require('../../assets/icons/carona_aceita.png'):require('../../assets/icons/caronista-nao-clicavel.png')
                  }
                />
              ))
            }
            {
              !oferecerMaisCaronas &&
              vetorCaronistas.map(caronista=>(
                passageiros.includes(caronista.uid)?
                <Marker
                  key={caronista.uid}
                  coordinate={{ latitude : caronista.latitude , longitude : caronista.longitude}}
                  onPress={()=>{
                    getDadosUsuario(caronista.uid, caronista.caronasAceitas, caronista.latitude, caronista.longitude);
                  }}
                  
                  icon={require('../../assets/icons/carona_aceita.png')}
                />:null
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
            uidPassageiroEmbarque &&
            <View style={[styles.viewCaronistas, {position: 'absolute', bottom: 10, height: 120, justifyContent: 'center', borderBottomColor: '#FF5F55', borderBottomWidth: 1}]}>
              <TouchableOpacity
                style={{backgroundColor: '#FF5F55', width: 240, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
                onPress={()=>{
                  embarquePassageiro(uidPassageiroEmbarque);
                  // setUIDPassageiroEmbarque(null);
                }}
              >
                <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                  Passageiro(a) a bordo
                </Text>
              </TouchableOpacity>
              <Text style={{color:'#06444C', fontWeight: '600', fontSize: 12, lineHeight: 24, textAlign: 'center'}}>
                  Você chegou até o seu passageiro!{'\n'}Pressione no botão acima para embarcá-lo.
              </Text>
            </View>
          }
          {
            existePassageiroAbordo &&
            <View style={[styles.viewCaronistas, {position: 'absolute', bottom: 10, height: 120, justifyContent: 'center', borderBottomColor: '#FF5F55', borderBottomWidth: 1}]}>
              <TouchableOpacity
                style={{backgroundColor: '#FF5F55', width: 240, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
                onPress={()=>{
                  iniciarViagem();
                }}
              >
                <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                  Iniciar viagem
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{backgroundColor: '#FF5F55', width: 240, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
                onPress={()=>{
                  // armazenaToken()
                  sendNotification();
                }}
              >
                <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                  Teste token
                </Text>
              </TouchableOpacity> */}
              <Text style={{color:'#06444C', fontWeight: '600', fontSize: 12, lineHeight: 24, textAlign: 'center'}}>
                  Pronto para iniciar a viagem...{'\n'}Pressione no botão acima para começar.
              </Text>
            </View>
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
                    oferecerMaisCaronas && exibeModalOferecer &&
                    <>
                      <Image 
                        source={imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                      />
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
                      {/* escrever a classificação do caronista */}
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Classificação</Text>
                      <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                          onPress={()=>{oferecerCarona()}}
                          // onPressOut={sendNotification}
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
                  {
                    !oferecerMaisCaronas && alertaVagas &&
                    <>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '700'}}>Você atingiu o número máximo de caronistas!</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>
                        Para buscar um(a) passageiro(a), pressione uma vez no ícone em verde e clique em buscar passageiro(a).
                      </Text>
                      <TouchableOpacity
                            style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                            onPress={() => {
                              setModalVisible(!modalVisible);
                              setAlertaVagas(!alertaVagas);
                            }}
                        >
                          <Text style={styles.textStyle}>Entendi</Text>
                      </TouchableOpacity>
                    </>
                  }
                  {
                    !exibeModalOferecer &&
                    <>
                      <Image 
                        source={imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                      />
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
                      <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                          onPress={()=>{rotaPassageiro(latitudePassageiro, longitudePassageiro, nomeCaronista, uidPassageiro)}}
                      >
                          <Text style={styles.textStyle}>Buscar passageiro(a)</Text>
                      </TouchableOpacity>
                    <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                          }}
                      >
                        <Text style={styles.textStyle}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                  }
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={alertaViagem}
            onRequestClose={() => {setAlertaViagem(!alertaViagem)}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 260, alignSelf: 'center'}}>
              <View style={styles.modalView}>
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '700'}}>Ainda tem vagas no seu veículo...</Text>
                    <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>
                      Tem certeza que deseja iniciar a viagem mesmo não tendo preenchido todas as vagas?
                    </Text>
                    <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                          onPress={() => {
                            setAlertaViagem(!alertaViagem);
                            navigation.navigate('ViagemMotorista', {currentUser: currentUser, cidade: cidade, estado: estado});
                          }}
                      >
                        <Text style={styles.textStyle}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                          onPress={() => {
                            setAlertaViagem(!alertaViagem)
                          }}
                      >
                        <Text style={styles.textStyle}>Não</Text>
                    </TouchableOpacity>
                </View>
                </View>
          </Modal>
          <TouchableOpacity
              style={{backgroundColor: 'white', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', position: 'absolute', top: 10, left: 10, borderWidth: 1, borderColor: '#FF5F55'}}
              onPress={desistirDaOferta}
          >
             <Icon name="arrow-left" size={30} color="#FF5F55" style={{alignSelf:'center'}}/>
          </TouchableOpacity>
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
  viewCaronistas:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
    width: 330,
    backgroundColor: 'white', 
    borderRadius: 15, 
    alignSelf:'center', 
    marginTop: 50,
    alignContent:'center'
  }
});

export default Oferecer;