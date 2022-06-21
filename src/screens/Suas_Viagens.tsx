import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function Suas_Viagens() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Suas Viagens</Text>
      <StatusBar style="auto" />
    </View>
  );
}
