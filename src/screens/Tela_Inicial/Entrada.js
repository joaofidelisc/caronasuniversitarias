import React, {useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'

function Entrada({navigation}){
  // https://www.youtube.com/watch?v=MvepxO0qssA
  //https://instamobile.io/react-native-tutorials/asyncstorage-example-react-native/

  // const SignInToken = async() =>{
  //   // auth().signInWithCustomToken(AsyncStorage.getItem("TOKEN"));
  //   // navigation.navigate("MenuPrincipal");
  // }

  // useEffect(()=>{
  //   AsyncStorage.getItem("TOKEN").then((token)=>{
  //     // SignInToken();
  //   })
  // })

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
            onPress={()=>navigation.navigate('Cadastro_Inicio')}
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