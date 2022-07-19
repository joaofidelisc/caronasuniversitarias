import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';

function Entrada({navigation}){
  return (
    <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
        <Image source={
            require('../../assets/images/driver-car.png')} 
            style={{height:357, width: '100%', marginTop: -175}}  
            />
        <Text style={styles.txtCaronas}>
            Caronas Universitárias, o{'\n'}
            seu app universitário!
        </Text>
        <TouchableOpacity 
            style={styles.btnCadastrar}
            onPress={()=>navigation.navigate('Cadastro_1')}
            >
            <Text style={styles.txtBtnCadastrar}>Cadastre-se</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={()=>navigation.navigate('Login')}
            >
            <Text style={styles.txtBtnEntrar}>Entrar</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

export default Entrada;

const styles = StyleSheet.create({
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