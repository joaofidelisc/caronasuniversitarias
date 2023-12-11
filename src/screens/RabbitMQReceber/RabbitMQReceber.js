import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import serverConfig from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function RabbitMQReceber() {
  const [msg, setMsg] = useState('');

  const receiveData = async () => {
    try {
      let response = await fetch(
        `${serverConfig.urlRootNode}api/rabbit/consumirInfo/cadastroUsuario/123456`,
      );
      if (!response.ok) {
        throw new Error('Falha na requisição');
      }
      const data = await response.json();
      setMsg(JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao receber dados:', error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          height: '100%',
        }}>
        <Text style={{color: 'black', fontSize: width * 0.05}}>
          Recebendo dados com RabbitMQ
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#FF5F55',
            width: width * 0.5,
            height: height * 0.05,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: width * 0.04,
          }}
          onPress={() => {
            receiveData();
          }}>
          <Text style={{color: 'white', fontSize: width * 0.05}}>Receber</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: 'black',
            fontSize: width * 0.05,
            marginTop: height * 0.02,
          }}>
          Dados recebidos:{msg}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default RabbitMQReceber;
