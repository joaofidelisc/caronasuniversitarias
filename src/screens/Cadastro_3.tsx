import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';

type Cadastro_3ScreenProps = NativeStackScreenProps<RootStackParamList, 'Cadastro_3'>;

const Cadastro_3: React.FC<Cadastro_3ScreenProps> = (props) =>{
  return (
    <View style={styles.container}>
        <Text> Segunda tela de cadastro - implementar</Text>
        <StatusBar style="auto" />
    </View>
  );
}

export default Cadastro_3;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});