import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';

import configBD from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function RabbitMQReceber() {
  // const [coordenadas, setCoordenadas] = useState(null);  
  const [msg, setMsg] = useState('');    
  
  const receiveMessage = async()=>{
  //  let reqs = await fetch('http://192.168.15.165:8000/api/rabbit/receber_mensagem',{
  //         method: 'GET',
  //         mode: 'cors',
  //         headers:{
  //           'Accept':'application/json',
  //           'Content-type':'application/json'
  //         }
  //     });
  //     console.log('recebendoMensagem:');
  //     console.log('reqs:', reqs); 
    await fetch('http://192.168.15.165:8000/api/rabbit/obter_mensagem')
    .then(response => {
      // console.log('teste!!!!');
      if (!response.ok) {
        throw new Error(`Erro ao receber mensagem: ${response.status}`);
      }
      // setMsg(response.json());
      // console.log('resposta:', response.json());
      return response.json();
    })
    .then(data => {
      console.log('-------------------------------------------------\n\n');
      console.log('Tela Receber');
      
      // console.log('printando mensagem!!!');
      console.log('STATUS:', data.mensagem);
      setMsg(data.mensagem);
      console.log('-------------------------------------------------\n\n');
    })
    .catch(error => {
      console.error(error);
    });


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