import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('screen');

function Erro() {
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
        <Text
          style={{
            color: '#06444C',
            fontWeight: '800',
            fontSize: height * 0.025,
            lineHeight: 24,
            textAlign: 'left',
          }}>
          Ops...Algum erro ocorreu
        </Text>
        {console.log('width:', width, 'height:', height)}
        <Image
          source={require('../../assets/images/erro.png')}
          style={{
            height: height * 0.5,
            width: width * 0.9,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            color: '#06444C',
            fontWeight: '800',
            fontSize: height * 0.025,
            lineHeight: 24,
            textAlign: 'left',
          }}>
          Tente fechar o app e abrí-lo novamente!
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Erro;
