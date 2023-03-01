import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';

import serverConfig from '../../../config/config.json';
import amqp from 'amqplib';


const {width, height} = Dimensions.get('screen');
// const Buffer = require('buffer').Buffer;


function RabbitMQEnviar() {
  const [coordenadas, setCoordenadas] = useState([]);      
  
  
  const enviarInfoMotorista = async()=>{
    console.log('Testando função enviarInfoMotorista!');
    let reqs = await fetch('http://192.168.15.165:8000/api/rabbit/enviarInfo/motorista',{
        method: 'POST',
        headers:{
          'Accept':'application/json',
          'Content-type':'application/json'
        },
        body: JSON.stringify({
          uid: 'daushdasudhsa',
          estado: 'SP',
          cidade: 'São Carlos',
          ativo: true,
          buscandoCaronista: "",
          caronasAceitas: "",
          caronistasAbordo: "",
          latitudeMotorista: -21.985245,
          longitudeMotorista: -47.895199,
          nomeDestino: "Centro, São Carlos - SP, Brasil"
        })
    });

    let res = await reqs.json();
    console.log('req:', res);
}


  const sendMessageRabbit = async()=>{
    fetch('http://192.168.15.165:8000/api/rabbit/enviar_mensagem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mensagem: 'JOÃO VITOR' })
    })
    .then(response => response.json())
    .then(data => {
      console.log('-------------------------------------------------\n\n');
      console.log('STATUS:', data.status);
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
          <Text style={{color:'black', fontSize: width*0.05}}>Enviar dados com RabbitMQ</Text>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={()=>{
                // sendMessageRabbit();
                enviarInfoMotorista();
              }}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default RabbitMQEnviar