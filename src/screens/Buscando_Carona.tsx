import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';

type Buscando_CaronaScreenProps = NativeStackScreenProps<RootStackParamList, 'Buscando_Carona'>;

const Buscando_Carona: React.FC<Buscando_CaronaScreenProps> = (props) =>{
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Text>Buscando carona...</Text>
        <StatusBar style="auto" />
      </View>
    );
}

export default Buscando_Carona;
