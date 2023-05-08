import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions} from 'react-native';
import Lottie from 'lottie-react-native';


import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import EstadoApp from '../../services/sqlite/EstadoApp';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {height, width} = Dimensions.get('screen')

function BuscandoCarona({navigation, route}) {
  const [token,setToken] = useState("");
  const [infoCarregadas, setInfoCarregadas] = useState(false);
  
  const [cidade, setCidade] = useState(null);
  const [estado, setEstado] = useState(null);
  const [nomeDestino, setNomeDestino] = useState(null);
  const [encontrouCarona, setEncontrouCarona] = useState('');
  const currentUser = auth().currentUser.uid;
  
  const localizacaoPassageiro = route.params?.localizacao;
  const destinoPassageiro = route.params?.destino;

  const [atualizouEstado, setAtualizouEstado] = useState(false);
  const voltouEstado = route.params?.voltouEstado;
  const exibeCancelarBusca = (voltouEstado == undefined)?(true):(false);
  const isFocused = useIsFocused();

  // const recusouCarona = route.params?.recusou;
  // const cidade = route.params?.cidade;
  // const estado = route.params?.estado;
  // const nomeDestino = route.params?.nomeDestino;
  
  function carregarInformacoes(){
    if (route.params?.cidade == undefined || route.params?.estado == undefined || route.params?.nomeDestino == undefined){
      //buscar do banco
      EstadoApp.findData(1).then(
        info => {
          console.log(info)
          setCidade(info.cidade);
          setEstado(info.estado);
          setNomeDestino(info.nomeDestino);
          setInfoCarregadas(true);
        }
      ).catch(err=> console.log(err));

    }else{
      console.log('info carregadas por default!');
      setCidade(route.params?.cidade);
      setEstado(route.params?.estado);
      setNomeDestino(route.params?.nomeDestino);
      setInfoCarregadas(true);
    }
  }

  function buscarCarona(){
    console.log('rodando buscar carona!');
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
    try{
      reference.on('value', function(snapshot){
        if(snapshot.child('ofertasCaronas').exists()){
          if (snapshot.val().ofertasCaronas != '' && snapshot.val().ofertasCaronas != null && snapshot.val().ofertasCaronas != undefined){
            setEncontrouCarona(true);
            console.log('Encontrou carona?:', encontrouCarona);
          } else{
            setEncontrouCarona(false);
          }
        }
      })
    } catch(error){
      console.log('Error', error.code);
    }
  }

  async function caronaEncontrada(){
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
    reference.off('value');
    // setAtualizouEstado(false);
    setEncontrouCarona(false);
    navigation.navigate('CaronaEncontrada', {cidade: cidade, estado: estado, nomeDestino: nomeDestino});
  }

  function cancelarBusca(){
    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
    reference.off('value');
    try{
      reference_passageiro.remove();
    }catch(error){
      console.log(error.code);
    }
    atualizaEstadoAtual();
    // setAtualizouEstado(false);
    setEncontrouCarona(false);
    navigation.navigate('Buscar');
  }

  //Verificação de permissão para envio de mensagens (geralmente no android a permissão é concedida por padrão)
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

  const getFCMToken = async() => {
    await messaging()
       .getToken()
       .then(token => {
         console.log('token=>>>', token); //armazenar token na string //esse token é o token do motorista;
         setToken(token)
       });
   };

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

  const atualizaEstadoAtual = async()=>{
    await AsyncStorage.removeItem('BuscandoCarona');
  }

 
  useFocusEffect(
    useCallback(()=>{
      const defineEstadoAtual = async()=>{
        await AsyncStorage.setItem('BuscandoCarona', 'true');
      }
      defineEstadoAtual().catch(console.error);    
    })
  );
  
  
  useFocusEffect(
    useCallback(()=>{
      console.log('Tela: BuscandoCarona');
      getFCMToken();
      requestPermission();
      armazenaToken();
    }, [token])
  );

  useFocusEffect(
    useCallback(()=>{
      if (infoCarregadas){
        buscarCarona();
      }else{
        console.log('é necessário carregar as informações');
        carregarInformacoes();
      }
    },[infoCarregadas])
  );

  
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
        <Text style={{fontSize:height*0.025, color:'#2f4f4f', fontWeight:'bold', marginVertical:'1%', marginTop: height*0.03, marginRight: height*0.01, marginLeft: height*0.01}}>
          Buscando caronas para você!{'\n'}Isso pode levar alguns minutos...
        </Text>
        
        <Lottie 
        style={{height:height*0.5, width:width}}
        source={require('../../assets/JSON/mapCell.json')} 
        autoPlay 
        loop />

        
        <Text style={{fontSize:height*0.022, color:'#c0c0c0', fontWeight:'normal', marginHorizontal:'5%', marginBottom: '4%'}}>
          Exibiremos uma lista de propostas assim que possível!
        </Text>
        {
          !encontrouCarona && 
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: '66%', height: '6.5%', alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.03}}
            onPress={cancelarBusca}
            // onPress={testeBanco}
            >
            <Text style={{color: 'white', fontWeight: '600', fontSize: height*0.019, lineHeight: 24, textAlign: 'center'}}>
              Cancelar busca
            </Text>
          </TouchableOpacity>
        }
        
        {
          encontrouCarona && 
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: '66%', height: '6.5%', alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.03}}
            onPress={caronaEncontrada}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: height*0.019, lineHeight: 24, textAlign: 'center'}}>
              Exibir lista
            </Text>
          </TouchableOpacity>
        }
      </View>
    </SafeAreaView>
  );
}

export default BuscandoCarona;