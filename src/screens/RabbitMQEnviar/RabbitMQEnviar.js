import React from 'react';
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

function RabbitMQEnviar() {

  const sendData = async () => {
    console.log('Enviando informações de cadastro para fila!');
    try {
      let reqs = await fetch(
        `${serverConfig.urlRootNode}api/rabbit/enviarInfo/cadastroUsuario`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            id: '123456',
            nome: 'João Vitor',
            CPF: '123456789',
            data_nasc: '10/06/1998',
            num_cel: '16993764191',
            universidade: 'UFSCar',
            email: 'joao.fidelis@estudante.ufscar.br',
            placa_veiculo: 'RHR3B01',
            ano_veiculo: '2021',
            cor_veiculo: 'Branco',
            nome_veiculo: 'GOL',
            motorista: false,
          }),
        },
      );

      if (reqs.ok) {
        let res = await reqs.json();
        console.log('req:', res);
      } else {
        console.error(
          'Erro ao enviar informações de cadastro:',
          reqs.statusText,
        );
      }
    } catch (error) {
      console.error(
        'Erro inesperado ao enviar informações de cadastro:',
        error,
      );
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
          Enviar dados com RabbitMQ
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
            sendData();
          }}>
          <Text style={{color: 'white', fontSize: width * 0.05}}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default RabbitMQEnviar;
