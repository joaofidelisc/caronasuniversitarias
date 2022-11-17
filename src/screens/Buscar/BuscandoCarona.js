import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions} from 'react-native';
import Lottie from 'lottie-react-native';


import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import EstadoApp from '../../services/sqlite/EstadoApp';


const {height, width} = Dimensions.get('screen')

function BuscandoCarona({navigation, route}) {
  const [token,setToken] = useState("");
  const localizacaoPassageiro = route.params?.localizacao;
  const destinoPassageiro = route.params?.destino;



  const [encontrouCarona, setEncontrouCarona] = useState('');
  const currentUser = auth().currentUser.uid;

  // const recusouCarona = route.params?.recusou;
  const cidade = route.params?.cidade;
  const estado = route.params?.estado;
  const nomeDestino = route.params?.nomeDestino;

  function buscarCarona(){
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
          // console.log('TELA DE BUSCANDO CARONA:');
          // console.log('token armazenado:', doc.data().token);
        }
      })
    }catch(error){
      console.log('erro em armazenaToken');
    }
  }

  const atualizaEstadoAtual = async()=>{
    await AsyncStorage.removeItem('BuscandoCarona');
  }

  useEffect(()=>{
    const defineEstadoAtual = async()=>{
      await AsyncStorage.setItem('BuscandoCarona', 'true');
    }
    const atualizarDados = async()=>{
      await EstadoApp.updateData(cidade, estado);
    }
    defineEstadoAtual().catch(console.error);
    atualizarDados().catch(console.error);
    
    let teste = EstadoApp.getData();
    console.log('-------------------------------------------');
    console.log('testeEEEE:', teste.cidade);
    console.log('testeEEEE:', teste.estado);
    console.log(EstadoApp.getData());
    // const [city, state] = EstadoApp.getData();
    // console.log('city:', city, 'state:', state);
    console.log('-------------------------------------------');
  }, []);


  useEffect(()=>{
    console.log('Tela: BuscandoCarona');
    getFCMToken();
    requestPermission();
    armazenaToken();
    buscarCarona();
  }, [token])

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

        
        <Text style={{fontSize:height*0.022, color:'#c0c0c0', paddingHorizontal:10, fontWeight:'normal',marginVertical:'9%', marginHorizontal:'5%' }}>
          Exibiremos uma lista de propostas assim que possível!
        </Text>
        {
          !encontrouCarona && 
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: '66%', height: '6.5%', alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.03}}
            onPress={cancelarBusca}
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