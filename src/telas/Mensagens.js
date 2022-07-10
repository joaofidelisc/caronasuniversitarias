import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';


function Mensagens() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Mensagens</Text>
        <StatusBar style="auto"/>
      </View>
    );
  }

export default Mensagens;