import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';

type Cadastro_2ScreenProps = NativeStackScreenProps<RootStackParamList, 'Cadastro_2'>;

const Cadastro_2: React.FC<Cadastro_2ScreenProps> = (props) =>{
  return (
    <View style={styles.container}>
        <Text> Segunda tela de cadastro - implementar</Text>
        <StatusBar style="auto" />
    </View>
  );
}

export default Cadastro_2;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});