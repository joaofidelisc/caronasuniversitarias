import React, {useState, useEffect, useRef} from 'react';
import {View, Text, SafeAreaView, StatusBar, StyleSheet, PermissionsAndroid, Dimensions, Modal, TouchableOpacity, Image, ScrollView, BackHandler, Linking, Platform} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import storage from '@react-native-firebase/storage';
import database, {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import config from '../../config/index.json';
import Geocoder from 'react-native-geocoding';

import notifee, { AndroidColor } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import NotificationService from '../Notificacoes/PushNotifications';
import { AndroidImportance } from '@notifee/react-native';
import EstadoApp from '../../services/sqlite/EstadoApp';


const {width, height} = Dimensions.get('screen');

function Oferecer({route, navigation}) {
    const [region, setRegion] = useState(null);  //Coordenadsa atuais do motorista (latitude e longitude);
    const [modalVisible, setModalVisible] = useState(false); //Define se o modal é mostrado ou não;
    const [imageUser, setImageUser] = useState('');  //Define a url da imagem do possível caronista para cada caronista e para cada vez que é chamada a função buscaUsuario;
    const [nomeCaronista, setNomeCaronista] = useState(''); //Define o nome do caronista para cada caronista e para cada vez que é chamada a função buscaUsuario;
    const [nomeDestinoCaronista, setNomeDestinoCaronista] = useState(''); //Define o nome do destino para cada caronista e para cada vez que é chamada a função buscaUsuario;
    const [classificacaoCaronista, setClassificacaoCaronista] = useState(''); //Define a classificação de cada caronista para cada vez que é chamada a função buscaUsuario;
    const [vetorCaronistas, setCaronistas] = useState([]); //Vetor de todos os caronistas atuais (com caronas aceitas e buscando carona);
    const [uidPassageiro, setUidPassageiro] = useState(''); //Contém apenas 1 uid armazenado (o uid do pin clicado no momento);
    const [latitudePassageiro, setLatitudePassageiro] = useState(''); //Passado como parâmetro na função RotaPassageiro(), para calcular a distância entre o motorista/caronista;
    const [longitudePassageiro, setLongitudePassageiro] = useState(''); //Passado como parâmetro na função RotaPassageiro(), para calcular a distância entre o motorista/caronista;
    const [numCaronasAceitas, setNumCaronasAceitas] = useState(0); //Controla o número de caronas que o motorista pode oferecer de acordo com o número de vagas disponíveis;
    const [oferecerMaisCaronas, setOferecerMaisCaronas] = useState(true); //Define se o motorista pode oferecer mais caronas ou não;
    const [existeBanco, setExisteBanco] = useState(''); //Controla se o banco de dados existe ou deve ser criado (antes de ser atualizado);
    const [alertaVagas, setAlertaVagas] = useState(true); //Define se o modal com o alerta de número máximo de vagas é exibido;
    const [alertaViagem, setAlertaViagem] = useState(false);  //Quando o motorista quer iniciar a viagem com menos vagas do que ofertou, é exibido um modal de alerta dizendo que ainda há vagas disponíveis;
    const [embarcarPassageiro, setEmbarcarPassageiro] = useState(null); //Implica que o motorista chegou ao passageiro e este pode embarcar no veículo (a mensagem passageiro(a) a bordo é exibida);
    const [exibeModalOferecer, setExibeModalOferecer] = useState(true); //Controla se o modal com o texto de oferecer carona para o caronista é exibido ou não;
    const [existePassageiroAbordo, setExistePassageiroAbordo] = useState(false); //Se existe algum passageiro a bordo, o botão de iniciar viagem é exibido;
    const [numPassageirosABordo, setNumPassageirosABordo] = useState(0); //Controla o número de passageiros que estão a bordo do veículo;
    const [ofertasAceitas, setOfertasAceitas] = useState([]); ////Vetor com todos os uids dos passageiros que aceitaram a carona do motorista corrente (motorista atual);
    const [arrayOfertasAceitas, setArrayOfertasAceitas] = useState([]);
    const [modalBuscarPassageiro, setModalBuscarPassageiro] = useState(false);
    const [cancelarOferta, setCancelarOferta] = useState(true);
    const [passageiros, setPassageiros] = useState([]);
    const [faltaPassageiros, setFaltaPassageiros] = useState(false);
    const [definiuEstado, setDefiniuEstado] = useState(false);
    const [infoCarregadas, setInfoCarregadas] = useState(false);

    const [token, setToken] = useState(""); //Armazena o token atual obtido do dispositivo do usuário.
    //Informações do motorista e banco de dados
    const currentUser = auth().currentUser.uid;
    
    const [cidade, setCidade] = useState(null);
    const [estado, setEstado] = useState(null);
    const [destino, setDestino] = useState(null);
    const [vagasDisponiveis, setVagasDisponiveis] = useState(null);
    
    // const cidade = route.params?.cidade; 
    // const estado = route.params?.estado;
    // const destino = route.params?.destino;
    // const vagasDisponiveis = route.params?.vagas;

    function carregarInformacoes(){
      if (route.params?.cidade == undefined || route.params?.estado == undefined || route.params?.destino == undefined){
        //buscar do banco
        EstadoApp.findData(1).then(
          info => {
            console.log(info)
            setCidade(info.cidade);
            setEstado(info.estado);
            setDestino(info.nomeDestino);
            setVagasDisponiveis(info.numVagas);
            setInfoCarregadas(true);
          }
        ).catch(err=> console.log(err));
  
      }else{
        console.log('info carregadas por default!');
        setCidade(route.params?.cidade);
        setEstado(route.params?.estado);
        setDestino(route.params?.nomeDestino);
        setVagasDisponiveis(route.params?.vagas);
        setInfoCarregadas(true);
      }
    }

    /*
      Função responsável por solicitar ao motorista para ligar sua localização.
    */
    const localizacaoLigada = async()=>{
      console.log("OFERECER!!!!!!!!!!!!! - localizacaoLigada");
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
    console.log("OFERECER!!!!!!!!!!!!! - getCaronistasMarker");
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
        setCaronistas(vetorCaronistas.filter((uid)=>(uid.uid != snapshot.key)));
      })
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
  console.log("OFERECER!!!!!!!!!!!!! - atualizaEstado");
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
    console.log("OFERECER!!!!!!!!!!!!! - estadoInicial");
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    if (!existeBanco){
      try{
        reference.once('value').then(function(snapshot){
          setExisteBanco(snapshot.exists());
        })
      }catch(error){
        console.log('erro em estadoInicial()');
      }
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
  

  /*
    Função responsável por obter a localização do motorista em tempo real.
  */
  function getMyLocation(){
    console.log("OFERECER!!!!!!!!!!!!! - getMyLocation");
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
    console.log("OFERECER!!!!!!!!!!!!! - getFotoStorage");
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
    console.log("OFERECER!!!!!!!!!!!!! - getNomeCaronista");
    try{
      await firestore().collection('Users').doc(userUID).get().then((doc)=>{
        if (doc.exists){
          setNomeCaronista(doc.data().nome);
        }
      })
    }catch(error){
      console.log('erro em getNomeCaronista');
    }
  }

  
  /* 
    Função responsável por obter o destino do caronista com base em seu UserID;
    Essa função é chamada apenas quando um marcador é pressionado.
  */
  const getDestinoCaronista =  async(userUID)=>{
    console.log("OFERECER!!!!!!!!!!!!! - getDestinoCaronista");
    try{
      await database().ref(`${estado}/${cidade}/Passageiros/${userUID}`).once('value').then(snapshot=>{
        setNomeDestinoCaronista(snapshot.val().nomeDestino);
      })
    }catch(error){
      console.log(error.code);
    }
  }

  /*
    Função responsável por recuperar a classificação do caronista.
  */
  const getClassificacaoCaronista = async(caronistaUID)=>{
    console.log("OFERECER!!!!!!!!!!!!! - getClassificacaoCaronista");
    let classificacaoAtual = 0;
    let classificacaoAtualizada = 0;
    const reference_caronista = firestore().collection('Users').doc(caronistaUID);
    try{
      await reference_caronista.get().then((reference)=>{
        if (reference.exists){
          classificacaoAtual = reference.data().classificacao;
          if (classificacaoAtual == undefined){
            classificacaoAtual = 0;
            setClassificacaoCaronista(classificacaoAtual);
          }
          classificacaoAtualizada = parseFloat(classificacaoAtual.toFixed(2)); 
          setClassificacaoCaronista(classificacaoAtualizada);
        }
      })
    }catch(error){
      console.log('erro em recuperaClassificacaoMotorista');
    }
  }


  /*
    Função responsável por buscar e exibir o modal do usuário após o motorista clicar no pin do caronista;
    Busca o nome, foto de perfil, destino e classificação e define o UID no hook para ser possível oferecer carona.
  */
  const getDadosUsuario = async(userUID, caronaAceita, latitude, longitude)=>{
    console.log("OFERECER!!!!!!!!!!!!! - getDadosUsuario");
    if (exibeModalOferecer == false){
      setExibeModalOferecer(true);
    }
    if (caronaAceita != ''){
      if (caronaAceita.includes(currentUser)){
        await getFotoStorage(userUID);
        await getNomeCaronista(userUID);
        await getDestinoCaronista(userUID);
        await getClassificacaoCaronista(userUID);
        setLatitudePassageiro(latitude);
        setLongitudePassageiro(longitude);
        setExibeModalOferecer(false);
        setModalBuscarPassageiro(true);
        // setModalVisible(true);
        console.log("o passageiro aceitou sua carona!");
      }
    }else{
      if (exibeModalOferecer){
        try{
          await getFotoStorage(userUID);
          await getNomeCaronista(userUID);
          await getDestinoCaronista(userUID);
          await getClassificacaoCaronista(userUID);
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
    console.log("OFERECER!!!!!!!!!!!!! - oferecerCarona");
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
  // const caronasAceitas = async()=>{
  //   console.log("OFERECER!!!!!!!!!!!!! - caronasAceitas");
  //   let uidsPassageiros = '';
  //   let arrayUIDsPassageiros = [];
  //   let jaExiste = false;
  //   if (jaExiste == true){
  //     jaExiste = false;
  //   }
  //   const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}/caronasAceitas`);
  //   if (existeBanco){
    //     try{
  //       reference.on('value', function(snapshot){
    //         if (snapshot.exists()){
  //           uidsPassageiros = snapshot.val();
  //           arrayUIDsPassageiros = uidsPassageiros.split(', ');
  //           if (arrayUIDsPassageiros[0] != '' && arrayUIDsPassageiros[0] != undefined && vagasDisponiveis>numCaronasAceitas){
  //             setNumCaronasAceitas(arrayUIDsPassageiros.length);
  //             if (!ofertasAceitas.includes(arrayUIDsPassageiros[arrayUIDsPassageiros.length-1])){
  //               setOfertasAceitas([...ofertasAceitas, arrayUIDsPassageiros[arrayUIDsPassageiros.length-1]]);
  //             }
  //           }else{
    //             if (vagasDisponiveis == numCaronasAceitas && oferecerMaisCaronas){
  //               setOferecerMaisCaronas(false);
  //               setModalVisible(!modalVisible);
  //             }
  //           }
  //         }
  //       })
  //     }catch(error){
    //       console.log('erro em caronasAceitas -> função');
    //     }
    //   }
    // }
    
    const caronasAceitas = async()=>{
      let strUIDs = '';
      let arrayUIDs = [];
      const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}/caronasAceitas`);
      if (oferecerMaisCaronas){
        reference.on('value', function(snapshot){
          if (snapshot.val() != '' && snapshot.val() != undefined){
            if (vagasDisponiveis>numCaronasAceitas){
              if (!ofertasAceitas.includes(snapshot.val())){
                strUIDs = snapshot.val();
                arrayUIDs = strUIDs.split(', ');
                setArrayOfertasAceitas(arrayUIDs);
                setOfertasAceitas(snapshot.val());
                setNumCaronasAceitas(arrayUIDs.length);
                if (cancelarOferta){
                  setCancelarOferta(false);
                }
              }else if (vagasDisponiveis == numCaronasAceitas){
                console.log('vagas esgotadas!');
              }
            }else{
              setOferecerMaisCaronas(false);
              setExibeModalOferecer(false);
              setModalVisible(!modalVisible);
            }
          }else{
            //complementar essa função aqui;
            //não vai acontecer essa situação, mas quando zerar o vetor de caronasAceitas?
            setNumCaronasAceitas(0);
          }
        })  
      }
    }


  /*
    A função abaixo é responsável por impedir que um passageiro dê carona a ele mesmo como motorista;
    Esse 'impedimento' é realizado, verificando o banco de dados dos passageiros e excluindo-o caso o motorista esteja incluso lá.
  */
  const excluiBancoMotoristaPassageiro = async()=>{
    console.log("OFERECER!!!!!!!!!!!!! - excluiBancoMotoristaPassageiro");
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
  

  /*
    Função responsável por realizar uma chamada externa a algum aplicativo de rotas disponível no dispositivo do usuário;
    Após realizada essa chamada, é passado o nome e coordenadas do passageiro.
  */
  const rotaPassageiro = async (latitude, longitude, nome, uidCaronista) => {
    console.log("OFERECER!!!!!!!!!!!!! - rotaPassageiro");
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
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


  /*
    Função responsável por calcular a distância entre o passageiro e o motorista (em metros).
  */
  const distanciaPassageiroMotorista = async(latitude, longitude)=>{
    console.log("OFERECER!!!!!!!!!!!!!");
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
  

  /*
    Função responsável por analisar a distância entre o motorista e o caronista e determinar se o motorista chegou até o passageiro ou não;
    Ao chegar no passageiro, é possível embarcá-lo, pressionando no botão passageiro(a) a bordo.
  */
  const buscarPassageiro = async(latitude, longitude, nome, uidCaronista)=>{
    console.log("OFERECER!!!!!!!!!!!!!");
    const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    let distPassageiroMotorista = await distanciaPassageiroMotorista(latitude, longitude);
    let tituloNotificacao = '';
    let mensagemNotificacao = '';    
    reference.once('value', function(snapshot){
      reference.update({
        buscandoCaronista: uidCaronista
    })
      if (distPassageiroMotorista < 6 && !snapshot.val().caronistasAbordo.includes(uidCaronista)){
        setEmbarcarPassageiro(uidCaronista);
        tituloNotificacao = 'Seu motorista chegou!';
        mensagemNotificacao = 'Embarque no veículo';
        sendNotification(uidCaronista, tituloNotificacao, mensagemNotificacao);
        setModalVisible(false);
      }
      })
    }
    

    /*
      Função responsável por iniciar a viagem do passageiro e atualizar os caronistas a bordo no carro do motorista.
    */
    const embarquePassageiro = async(uidPassageiro)=>{
      console.log("OFERECER!!!!!!!!!!!!! - embarquePassageiro");
      setEmbarcarPassageiro(null);
      setNumPassageirosABordo(numPassageirosABordo+1);
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
        // setCaronistas(vetorCaronistas.filter((uid)=>(uid.uid != uidPassageiro)));
        setPassageiros([...passageiros, uidPassageiro]);
        setArrayOfertasAceitas(arrayOfertasAceitas.filter((uid)=>(uid != uidPassageiro)));
      })
  }


  /*
    Função responsável por iniciar a viagem do motorista e navegar para a próxima tela de viagem em andamento;
  */
  const iniciarViagem = async()=>{
    console.log("OFERECER!!!!!!!!!!!!! - iniciarViagem");
    if(numCaronasAceitas>numPassageirosABordo){
      console.log('você não buscou todos os seus passageiros!!!');
      navigation.navigate('ViagemMotorista', {cidade: cidade, estado: estado});
      // setFaltaPassageiros(true);
      //descomentar a linha de cima - comentei apenas para teste
    }else{
      if (numCaronasAceitas < vagasDisponiveis){
        setAlertaViagem(true);
      }else{
        navigation.navigate('ViagemMotorista', {cidade: cidade, estado: estado});
      }
    }
  }
  

  /*
    Função responsável para voltar a tela de configurar carona;
    Implica que o motorista desistiu de oferecer carona.
  */
  const desistirDaOferta = async()=>{
    console.log("OFERECER!!!!!!!!!!!!! - desistirDaOferta");
    console.log('desistindo de oferecer carona...');
    const referece_motorista = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
    let caronasAceitas = '';
    try{
      referece_motorista.once('value').then(snapshot=>{
        caronasAceitas = snapshot.val().caronasAceitas;
        if (caronasAceitas == '' || caronasAceitas == undefined){
          referece_motorista.remove();
          navigation.navigate('ConfigurarCarona'); //só consigo navegar para a tela inicial se o número de caronas aceitas é vazio;
        }else{
          //como tratar o cancelamento de carona?
          //motorista só pode cancelar a oferta se não tiver nenhuma carona aceita!
        }
      })
    }catch(error){
      console.log('erro em desistirDaOferta');
    }
  }


  /*
    Função responsável por obter o token atual do usuário (o qual será utilizado nas notificações);
    Além de obter o token, ele é armazendo no hook token para ser salvo (ou atualizado) posteriormente, no banco de dados.
  */
  const getFCMToken = async() => {
    await messaging()
       .getToken()
       .then(token => {
         console.log('token=>>>', token); //armazenar token na string //esse token é o token do motorista;
         setToken(token)
    });
  }
 

   /*
     Verificação de permissão para envio de mensagens (geralmente no android a permissão é concedida por padrão)
   */
   const requestPermission = async () => {
     const authStatus = await messaging().requestPermission();
   }
   
   /*
    Função utilizada para criar o canal de notificações com o notifee.
   */
   async function DisplayNotification(remoteMessage) {
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
        //  largeIcon: 'https://img.icons8.com/plasticine/344/car--v1.png',
         color: '#E8210C',
         importance: AndroidImportance.HIGH,
         smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
       },
     });
   }


   /*
     Função responsável por obter o token do passageiro armazenado no banco de dados e enviar a notificação de carona encontrada ou motorista está chegando.
   */
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
         }
       })
     }catch(error){
       console.log('erro em armazenaToken');
     }
   };
 
   
   /*
    Função responsável por atualizar o token armazenado no hook no banco de dados do motorista.
    Dúvida: devemos enviar notificação para o motorista?
   */
   const armazenaToken = async()=>{
     let docRef = firestore().collection('Users').doc(currentUser);
     try{
       docRef.get().then((doc)=>{
         if (doc.exists){
           docRef.update({
             token: token
           })
         }
       })
     }catch(error){
       console.log('erro em armazenaToken');
     }
   }

   useEffect(()=>{
      const defineEstadoAtual = async()=>{
        console.log('rodando defineEstado...');
        await AsyncStorage.setItem('Oferecer', 'true');
      }
      if (!definiuEstado){
        defineEstadoAtual().catch(console.error);
      }
  }, []);
 
  useEffect(()=>{
    console.log('TELA: Oferecer');
    console.log('vagas ofertas:', vagasDisponiveis);
    console.log('vagas ocupadas:', numCaronasAceitas);
    Geocoder.init(config.googleAPI, {language:'pt-BR'});
    if (infoCarregadas){
      estadoInicial();
    }else{
      carregarInformacoes();
    }
  }, [infoCarregadas]);

  useEffect(()=>{
    if (infoCarregadas){
      getMyLocation();
      getCaronistasMarker();
    }else{
      carregarInformacoes();
    }
    BackHandler.addEventListener('hardwareBackPress', ()=>{
      return true
    })
  }, [vetorCaronistas, existeBanco, infoCarregadas]);

  
  useEffect(()=>{
    if (infoCarregadas){
      caronasAceitas();
    }else{
      carregarInformacoes();
    }
  }, [ofertasAceitas, numCaronasAceitas, infoCarregadas]);

  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      DisplayNotification(remoteMessage);
    });
    if (infoCarregadas){
      getFCMToken();
      requestPermission();
      armazenaToken(); //
      return unsubscribe;
    }else{
      carregarInformacoes();
    }
  }, [token]);


  // useEffect(()=>{
  //   const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
  //   if (numPassageirosABordo == 0){
  //     reference.onDisconnect().remove();
  //   }else{
  //     reference.onDisconnect().cancel();
  //   }
  // })

  return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <MapView
            onMapReady={()=>{
              console.log('carregou!!!!');
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then(()=>{
                  console.log('Permissão aceita');  
                  localizacaoLigada();
                })
            }}
            provider={PROVIDER_GOOGLE}
            style={{width:width, height:height, flex:1}}
            region={region}
            zoomEnabled={true}
            minZoomLevel={17}
            showsUserLocation={true}
            loadingEnabled={false}
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
                !passageiros.includes(caronista.uid)?
                <Marker
                  key={caronista.uid}
                  coordinate={{ latitude : caronista.latitude , longitude : caronista.longitude}}
                  tappable={caronista.caronasAceitas.includes(currentUser)?true:false}
                  onPress={()=>{
                    getDadosUsuario(caronista.uid, caronista.caronasAceitas, caronista.latitude, caronista.longitude);
                  }}  
                  // icon={
                  //   caronista.caronasAceitas==''?require('../../assets/icons/caronista.png'):caronista.caronasAceitas.includes(currentUser)?require('../../assets/icons/carona_aceita.png'):require('../../assets/icons/caronista-nao-clicavel.png')
                  // }
                >
                  <Image
                    source={
                      caronista.caronasAceitas==''?require('../../assets/icons/caronista.png'):caronista.caronasAceitas.includes(currentUser)?require('../../assets/icons/carona_aceita.png'):require('../../assets/icons/caronista-nao-clicavel.png')
                    }
                    style={{width: width*0.0742, height: width*0.0742}}
                    resizeMode="center"
                  />
                </Marker>:null
              ))
            }
            {
              !oferecerMaisCaronas &&
              vetorCaronistas.map(caronista=>(
                arrayOfertasAceitas.includes(caronista.uid)?
                <Marker
                  key={caronista.uid}
                  coordinate={{ latitude : caronista.latitude , longitude : caronista.longitude}}
                  onPress={()=>{
                    getDadosUsuario(caronista.uid, caronista.caronasAceitas, caronista.latitude, caronista.longitude);
                  }}
                  // icon={require('../../assets/icons/carona_aceita.png')}
                >
                  <Image
                    source={
                      require('../../assets/icons/carona_aceita.png')
                    }
                    style={{width: width*0.0742, height: width*0.0742}}
                    resizeMode="contain"
                  />
                </Marker>:null
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
            embarcarPassageiro &&
            <View style={[styles.viewCaronistas, {position: 'absolute', bottom: 10, height: '28%', justifyContent: 'center', borderBottomColor: '#FF5F55', borderBottomWidth: 1}]}>
              <Text style={{color:'#06444C', fontWeight: '600', fontSize: height*0.015, lineHeight: 24, textAlign: 'center'}}>
                  Passageiro(a) próximo!{'\n'}Assim que ele estiver no carro, pressione no botão abaixo.
              </Text>
              <TouchableOpacity
                style={{backgroundColor: '#FF5F55', width: '75%', height:'22%', alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', top:'5%'}}
                onPress={()=>{
                  embarquePassageiro(embarcarPassageiro);
                }}
              >
                <Text style={{color: 'white', fontWeight: '600', fontSize: height*0.019, lineHeight: 24, textAlign: 'center'}}>
                  Passageiro(a) a bordo
                </Text>
              </TouchableOpacity>
            </View>
          }
          {
            existePassageiroAbordo &&
            <View style={[styles.viewCaronistas, {position: 'absolute', bottom: 10, height: '28%', justifyContent: 'center', borderBottomColor: '#FF5F55', borderBottomWidth: 1}]}>
              <Text style={{color:'#06444C', fontWeight: '600', fontSize: height*0.015, lineHeight: 24, textAlign: 'center'}}>
                  Pronto para iniciar a viagem...{'\n'}Pressione no botão abaixo para começar.
              </Text>
              <TouchableOpacity
                style={{backgroundColor: '#FF5F55', width: '75%', height: '22%', alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', top:'5%'}}
                onPress={()=>{
                  iniciarViagem();
                }}
              >
                <Text style={{color: 'white', fontWeight: '600', fontSize: height*0.019, lineHeight: 24, textAlign: 'center'}}>
                  Iniciar viagem
                </Text>
              </TouchableOpacity>
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
                      {/* <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                          onPress={()=>{

                            console.log('teste');
                            console.log('oferecerMaisCaronas:', oferecerMaisCaronas);
                            console.log('exibeModalOferecer:', exibeModalOferecer);
                            console.log('alertaVagas:', alertaVagas)
                          }}
                          // onPressOut={sendNotification}
                      >
                          <Text style={styles.textStyle}>TESTE</Text>
                      </TouchableOpacity> */}
                  {
                    oferecerMaisCaronas && exibeModalOferecer &&
                    <>
                      <Image 
                        source={imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                      />
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
                      <View style={{flexDirection:'row', justifyContent:'center'}}>
                        <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{classificacaoCaronista}</Text>
                        <Icon name="star" size={18} color="#06444C" style={{marginLeft:'1%'}}/>
                      </View>
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
                            navigation.navigate('ViagemMotorista', {cidade: cidade, estado: estado});
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
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalBuscarPassageiro}
            onRequestClose={() => {setModalBuscarPassageiro(!modalBuscarPassageiro)}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 260, alignSelf: 'center'}}>
              <View style={styles.modalView}>
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
                          onPress={()=>{
                            rotaPassageiro(latitudePassageiro, longitudePassageiro, nomeCaronista, uidPassageiro)
                            setModalBuscarPassageiro(false)
                          }}
                      >
                          <Text style={styles.textStyle}>Buscar passageiro(a)</Text>
                      </TouchableOpacity>
                    <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                          onPress={() => {
                            setModalBuscarPassageiro(false);
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
            visible={faltaPassageiros}
            onRequestClose={() => {setFaltaPassageiros(!faltaPassageiros)}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 260, alignSelf: 'center'}}>
              <View style={styles.modalView}>
              <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '700'}}>Você não buscou todos os seus passageiros...</Text>
                  <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>
                    Busque os passageiros que aceitaram a sua carona para iniciar a viagem.
                  </Text>
                  <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                        onPress={() => {
                          setFaltaPassageiros(!faltaPassageiros);
                        }}
                    >
                      <Text style={styles.textStyle}>Entendi</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {
            cancelarOferta &&
            <TouchableOpacity
                style={{backgroundColor: 'white', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', position: 'absolute', top: 10, left: 10, borderWidth: 1, borderColor: '#FF5F55'}}
                onPress={desistirDaOferta}
            >
              <Icon name="arrow-left" size={30} color="#FF5F55" style={{alignSelf:'center'}}/>
            </TouchableOpacity>
          }
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