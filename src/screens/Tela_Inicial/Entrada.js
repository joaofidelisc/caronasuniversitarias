import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions, BackHandler } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

const {height,width}=Dimensions.get('window')

function Entrada({navigation}){
  const [falhaLogin, setFalhaLogin] = useState(false);

  const redirecionamentoLogin = async(email)=>{  
    // let buscandoCarona = await AsyncStorage.getItem("buscandoCarona");
    // let CaronaEncontrada = await AsyncStorage.getItem("CaronaEncontrada");
    // let AguardandoMotorista = await AsyncStorage.getItem("AguardandoMotorista");
    // let ViagemEmAndamento = await AsyncStorage.getItem("ViagemEmAndamento");
    // let Classificacao = await AsyncStorage.getItem("Classificacao");

    try{
      firestore().collection('Users').where('email', '==', email).get().then(querySnapshot=>{
        const valor = querySnapshot.docs;
        if (valor == ""){
          navigation.navigate("Como_Comecar", {email: email});
        }
        else{
          // if (buscandoCarona != null){
          //   navigation.navigate("Buscando_Carona");
          // }else if (CaronaEncontrada != null){
          //   navigation.navigate("CaronaEncontrada");
          // }else if (AguardandoMotorista != null){
          //   navigation.navigate("AguardandoMotorista");
          // }else if (ViagemEmAndamento != null){
          //   navigation.navigate("ViagemEmAndamento");
          // }else if (Classificacao != null){
          //   navigation.navigate("Classificacao");
          // }else{
          // }
          navigation.navigate("MenuPrincipal");
        }
      })
    }catch(error){
      setFalhaLogin(true);
      console.log('erro no redirecionamento');
    }   
  }
  
  const SignInToken = async() =>{
    let token = await AsyncStorage.getItem("token");
    let email = await AsyncStorage.getItem('email');
    let password = await AsyncStorage.getItem('password');
    if (email == null){
      setFalhaLogin(true);
    }
    try{
      if (token != null){
        auth().signInWithCustomToken(token);
        await redirecionamentoLogin(email);
      } else if (email != null && password != null){
        auth().signInWithEmailAndPassword(email, password);
        await redirecionamentoLogin(email);
      }
    }catch(error){
      if (error.code == 'auth/missing-identifier'){
        console.log('missing identifier!');
      }
      console.log('erro no login automático');
      setFalhaLogin(true);
    }
  }

  //travar o botão voltar para evitar repetição indesejada da splash screen
  useEffect(()=> {
    SignInToken();
    BackHandler.addEventListener('hardwareBackPress', ()=>{
      return true
    })
  }, [falhaLogin]); 

  return (
    <SafeAreaView>
        {
          falhaLogin && <>
          <StatusBar barStyle={'light-content'} />
            <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: height *0.3, width: width}}>
            <Image source={
                require('../../assets/images/driver-car.png')} 
                style={{height:height*0.5 , width: width, marginTop: 0, backgroundColor:'white'}}  
                />
            </View> 
            <View Style={{width: width, backgroundColor:'white'}}>
            <Text style={{textAlign:'center',
                    fontSize: height*0.038, 
                    backgroundColor: 'white', 
                    height: height *0.3, 
                    width: width,
                    fontWeight: 'bold',
                    color: '#06444C',
                    lineHeight:height*0.055,
                    marginTop: height*0.06
                  }}>
                Caronas Universitárias, o{'\n'}
                seu app universitário!
            </Text> 
            </View>
            <View style={{height: height, 
              width: width, backgroundColor:'#ffffff',}}>
          
            <View Style={{height: height*0.04, 
              width: width, backgroundColor:'#ffffff',
              justifyContent: 'center', 
              alignItems: 'center'}}>

            <TouchableOpacity 
                style={styles.btnCadastrar}
                onPress={()=>navigation.navigate('Cadastro_Inicio')}
                >
                <Text style={{textAlign:'center', 
                fontSize:height*0.026,
                fontWeight:'bold', 
                color:"white", 
                alignItems:'center'
              }}>
                Cadastre-se</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=>navigation.navigate('Login')}
                style={{alignSelf:'center'}}
                >
                <Text style={styles.txtBtnEntrar}>Entrar</Text>
            </TouchableOpacity>
              </View>
            </View>
        </>
        }
    </SafeAreaView>
  );
}

export default Entrada;

const styles = StyleSheet.create({
  btnCadastrar:{
      backgroundColor: '#FF5F55',
      borderRadius: width*0.05,
      padding: 10,
      width: width *0.85,
      height: height*0.064,
      alignItems:'center',
      alignSelf:'center'
    },
    txtBtnCadastrar:{
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 10,
      color: 'white',
    },
    txtBtnEntrar:{
      paddingTop: height*0.0005,
      fontSize: height*0.02,
      fontWeight: '700',
      lineHeight: height*0.2,
      color: '#FF5F55',
      alignItems:'center',
      textAlign: 'center',
    },
    txtCaronas: {
      color: '#06444C',
      fontWeight: '700',
      fontSize: 24,
      lineHeight: height - 570,
      textAlign: 'center',
      alignItems: 'center',
      paddingTop: height - 550,
      paddingBottom: height - 560,
    },
    retangulo:{
      backgroundColor: 'gray',
      width:'100%',
      height: height - 200,
      marginTop:-175,
    }
  });