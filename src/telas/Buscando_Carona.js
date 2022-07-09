import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

function Buscando_Carona() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Buscando_Carona</Text>
        <StatusBar style="auto"/>
      </View>
    );
  }

export default Buscando_Carona;