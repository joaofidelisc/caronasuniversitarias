import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';

import configBD from '../../../config/config.json';
import amqp from 'amqplib';


const {width, height} = Dimensions.get('screen');
// const Buffer = require('buffer').Buffer;


function RabbitMQEnviar() {
  const [coordenadas, setCoordenadas] = useState([]);      
  
  
  const sendMessage = async(coordenada)=>{
    try{
        console.log('sendMessage -> entrou!');
        console.log('TESTE!!!!');
        const conn = await amqp.connect('amqp://192.168.15.165');
        console.log('Conn:', conn);
        const channel = await conn.createChannel();
        const queue = 'coordenadas';

        await channel.assertQueue(queue, {
            durable:false
        });
        /*
        // channel.sendToQueue(queue, Buffer.from(coordenada));
        // console.log(`A mensagem ${coordenada} foi enviada para a fila ${queue}`);
        
        // setTimeout(async() =>{
            //     await conn.close();
            //     process.exit(0);
            // }, 500);
            */
    }catch(err){
        console.log(err);
    }
  }
       
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'black', fontSize: width*0.05}}>Enviar dados com RabbitMQ</Text>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={()=>{
                sendMessage('123456');                
            }}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default RabbitMQEnviar