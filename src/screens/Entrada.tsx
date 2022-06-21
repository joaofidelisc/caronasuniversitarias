import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { RootStackParamList } from '../types/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type EntradaScreenProps = NativeStackScreenProps<RootStackParamList, 'Entrada'>;

const Entrada: React.FC<EntradaScreenProps> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.retangulo}>
      </View>
      <Text style={styles.txtCaronas}>
        Caronas Universitárias, o{'\n'}
        seu app universitário!
      </Text>
      <TouchableOpacity 
        style={styles.btnCadastrar}
        onPress={()=>props.navigation.push('Cadastro_1')}
        >
        <Text style={styles.txtBtnCadastrar}>Cadastre-se</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={()=>props.navigation.push('Login')}
      >
        <Text style={styles.txtBtnEntrar}>Entrar</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default Entrada;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCadastrar:{
    backgroundColor: '#FF5F55',
    borderRadius: 12,
    padding: 10,
    width: 315,
    height: 39,
  },
  txtBtnCadastrar:{
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
  txtBtnEntrar:{
    paddingTop: 37,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    color: '#FF5F55',
    alignItems:'center',
    textAlign: 'center',
  },
  txtCaronas: {
    color: '#06444C',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 37,
    paddingBottom: 37,
  },
  retangulo:{
    backgroundColor: 'gray',
    width:'100%',
    height: 357,
    marginTop:-175,
  }
});