import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';
// import EventSource from "react-native-sse";
import EventSource from 'react-native-event-source';

import serverConfig from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function RabbitMQReceber() {
  const [msg, setMsg] = useState('');    
  const [vetorCaronistas, setCaronistas] = useState([]);

  function getCaronistasMarker(data){
    console.log('getCaronistasMarker!');
    console.log('latitude:', data.latitudePassageiro);
    console.log('longitude:', data.longitudePassageiro);
    console.log('uid:', data.uid);
    console.log('caronasAceitas:', data.caronasAceitas);
    
    const index = vetorCaronistas.findIndex(obj => obj.uid === data.uid);
    if (index >= 0){
      vetorCaronistas[index].latitude = data.latitudePassageiro;
      vetorCaronistas[index].longitude = data.longitudePassagero;
    }else{
      setCaronistas([...vetorCaronistas, {
        latitude: data.latitudePassageiro,
        longitude: data.longitudePassageiro,
        uid: data.uid,
        caronasAceitas: data.caronasAceitas
      }])
    }

  }

  const receberInfoMotorista = ()=>{
      console.log('receberInfoMotorista');
      try{
        const events = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obterInfo/motorista/SP/Sao_Carlos`);
        events.addEventListener('getInfoMotorista', (event)=>{
          console.log('Atualização informações:\n');
          // console.log(`Usuário: ${event.data}`);
        })
        
      }catch(error){
        console.log(error);
      }
  }

  const receberInfoPassageiro = ()=>{
    console.log('receberInfoPassageiro');
    try{
      const events = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obterInfo/passageiro/SP/Sao_Carlos`);
      events.addEventListener('getInfoPassageiro', (event)=>{
        console.log('Atualização informações:\n');
        let objPassageiro = JSON.parse(event.data);
        getCaronistasMarker(objPassageiro);
      })
      
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    console.log('...............................\n')
    console.log('Atualização vetor caronistas...\n');
    console.log(vetorCaronistas);
    console.log('...............................\n')
  }, [vetorCaronistas])
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'black', fontSize: width*0.05}}>Recebendo dados com RabbitMQ</Text>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={()=>{
              // receberInfoMotorista();
              receberInfoPassageiro();
            }}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Receber</Text>
          </TouchableOpacity>
          <Text style={{color:'black', fontSize: width*0.05, marginTop: height*0.02}}>Dados recebidos:{msg}</Text>
        </View>
      </SafeAreaView>
    );
}

export default RabbitMQReceber