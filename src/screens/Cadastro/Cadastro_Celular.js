import React from 'react';
import {View, Text, SafeAreaView, StatusBar} from 'react-native';

function Cadastro_Celular() {
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          backgroundColor: '#FFF',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'black'}}>Cadastro_Celular</Text>
      </View>
    </SafeAreaView>
  );
}

export default Cadastro_Celular;
