import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import serverConfig from '../../../config/config.json';
import amqp from 'amqplib';

const {width, height} = Dimensions.get('screen');
// const Buffer = require('buffer').Buffer;

function RabbitMQEnviar() {
  const [coordenadas, setCoordenadas] = useState([]);

  const enviarInfoMotorista = async () => {
    console.log('Testando função enviarInfoMotorista!');
    let reqs = await fetch(
      `${serverConfig.urlRootNode}api/rabbit/enviarInfo/motorista`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid: 'daushdasudhsa',
          estado: 'SP',
          cidade: 'São Carlos',
          ativo: true,
          buscandoCaronista: '',
          caronasAceitas: '',
          caronistasAbordo: '',
          latitudeMotorista: -21.985245,
          longitudeMotorista: -47.895199,
          nomeDestino: 'Centro, São Carlos - SP, Brasil',
        }),
      },
    );

    let res = await reqs.json();
    console.log('req:', res);
  };

  const enviarInfoPassageiro = async () => {
    console.log('Testando função enviarInfoPassageiro');
    let reqs = await fetch(
      `${serverConfig.urlRootNode}api/rabbit/enviarInfo/passageiro`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          uid: '0VtQXRifF8PdbcKCrthdOtlnah12',
          estado: 'SP',
          cidade: 'São Carlos',
          ativo: true,
          caronasAceitas: '',
          latitudeDestino: -22.0094691,
          latitudePassageiro: -21.9852354,
          longitudeDestino: -47.891227,
          longitudePassageiro: -47.8952023,
          nomeDestino: 'Kamzu, São Carlos - SP, Brasil',
          ofertasCaronas: '',
        }),
      },
    );

    let res = await reqs.json();
    console.log('req:', res);
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
            enviarInfoMotorista();
            // enviarInfoPassageiro();
          }}>
          <Text style={{color: 'white', fontSize: width * 0.05}}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default RabbitMQEnviar;
