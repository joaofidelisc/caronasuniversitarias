import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions} from 'react-native';
import Lottie from 'lottie-react-native';


import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const {height, width} = Dimensions.get('screen')

function BuscandoCarona({navigation, route}) {
  const [encontrouCarona, setEncontrouCarona] = useState(''); //Utilizado para definir se o caronista encontrou alguma carona ou não;
  const [token, setToken] = useState(''); //Utilizado como token para disparar as notificações;
  const [tokenEnviado, setTokenEnviado] = useState(false);
  
  const currentUser = auth().currentUser.uid;
  const cidade = route.params?.cidade;
  const estado = route.params?.estado;

  /* 
    Função responsável por ler do banco de dados em tempo real e verificar se o caronista possui alguma oferta de carona;
    Caso possua, o Hook encontrouCarona é definido como verdadeiro e o botão de exibir lista de caronas é exibido.
  */
  const buscarCarona = ()=>{
    const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
    try{
      reference.on('value', function(snapshot){
        if(snapshot.child('ofertasCaronas').exists()){
          if (snapshot.val().ofertasCaronas != '' && snapshot.val().ofertasCaronas != null && snapshot.val().ofertasCaronas != undefined){
            setEncontrouCarona(true);
          } else{
            setEncontrouCarona(false);
          }
        }
      })
    } catch(error){
      console.log('Error', error.code);
    }
  }


  /* 
    Função responsável para navegar até a tela de Carona Encontrada.
  */
  const navigateToCaronaEncontrada = async()=>{  
    // await AsyncStorage.removeItem('buscandoCarona');
    // await AsyncStorage.setItem('CaronaEncontrada', 'true');;
    navigation.navigate('CaronaEncontrada', {cidade: cidade, estado: estado});
  }

  
  /* 
    Função responsável por cancelar a busca da carona atual;
    Remove o banco de passageiros (consequentemente removendo o pin do marker para o motorista).
  */
  const cancelarBusca = async()=>{
    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference_passageiro.remove();
    }catch(error){
      console.log(error.code);
    }
    navigation.navigate('Buscar');
  }

  /* 
    Função responsável por verificar a permissão para envio de mensagens (geralmente no android a permissão é concedida por padrão).
  */
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

  /* 
    Função responsável por obter o token do dispositivo para as notificações e armazená-lo no Hook token.
  */
  const getFCMToken = async() => {
    if (token == ''){
      await messaging()
         .getToken()
         .then(token => {
           setToken(token);
      });
    }
  };


  /*
   Função responsável por armazenar o token no banco de dados;
   É importante ressaltar que a cada vez que o aplicativo é reinstalado o token muda, sendo necessário atualizá-lo no banco.
  */
  const armazenaToken = async()=>{
    let docRef = firestore().collection('Users').doc(currentUser);
    if (!tokenEnviado){
      try{
        docRef.get().then((doc)=>{
          if (doc.exists){
            docRef.update({
              token: token
            })
            setToken(true);
          }
        })
      }catch(error){
        console.log('erro em armazenaToken');
      }
    }
  }

  /* 
    Ao ser renderizada esta tela, é necessário buscar por possíveis ofertas de carona.
  */
  useEffect(()=>{
    console.log('Tela: BuscandoCarona');
    buscarCarona();
  })


  useEffect(()=>{
    requestPermission();
    getFCMToken();
    armazenaToken();
  }, [token])

  
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
        <Text style={{fontSize:height*0.03, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10, marginTop: height*0.03}}>
          Buscando caronas para você. Isso pode levar alguns minutos...
        </Text>
        
        <Lottie 
        style={{height:height*0.5, width:width}}
        source={require('../../assets/JSON/mapCell.json')} 
        autoPlay 
        loop />

        
        <Text style={{fontSize:height*0.025, color:'#c0c0c0', paddingHorizontal:10, fontWeight:'normal',marginVertical:35 }}>
          Exibiremos uma lista de propostas assim que possível!
        </Text>
        {
          !encontrouCarona && 
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.03}}
            onPress={cancelarBusca}
            >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Cancelar busca
            </Text>
          </TouchableOpacity>
        }
        
        {
          encontrouCarona && 
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.03}}
            onPress={navigateToCaronaEncontrada}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Exibir lista
            </Text>
          </TouchableOpacity>
        }
      </View>
    </SafeAreaView>
  );
}

export default BuscandoCarona;