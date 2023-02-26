import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';
// import EventSource from "react-native-sse";
import EventSource from 'react-native-event-source';

import serverConfig from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function RabbitMQReceber() {
  const [msg, setMsg] = useState('');    
  
  const receiveMessageRabbit = async()=>{
      await fetch(`${serverConfig.urlRootNode}api/rabbit/obter_mensagem`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao receber mensagem: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('-------------------------------------------------\n\n');
        console.log('Tela Receber');  
        console.log('STATUS:', data.mensagem);
        // setMsg(data.mensagem);
        console.log('-------------------------------------------------\n\n');
      })
      .catch(error => {
        console.error(error);
      });
  
  
  }
  
  const receiveMessage = async()=>{
    console.log('--------------------------------\n');
    console.log('Function receiveMessage...');    
    try{
      // const events = new EventSource('http://192.168.15.165:8000/eventos');
      const events = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obter_mensagem`);
        
      events.addEventListener('chatmessage', (event)=>{
        console.log('opa, nova mensagem!');
        console.log(`Nova mensagem: ${event.data}`);
      })
      
    }catch(error){
      console.log(error);
    }
  }

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'black', fontSize: width*0.05}}>Recebendo dados com RabbitMQ</Text>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={()=>{
              receiveMessage();
              // receiveMessage2();
              // receiveMessageRabbit();
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