import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { firebase } from '@react-native-firebase/auth'
import RotaEntrada from '../../routes/app.public.routes';

import estilos from '../../estilos/estilos';

import firestore from '@react-native-firebase/firestore';


function Perfil_Detalhes({navigation, route}){
  const RecuperarDados = async()=>{
    console.log('teste');
    firestore().collection('Passageiro').where('email', '==', 'joao.fidelis@estudante.ufscar.br').get().then(querySnapshot => {
      console.log('Total users: ', querySnapshot.size);
      querySnapshot.forEach(documentSnapshot =>{
        console.log('User ID', documentSnapshot.id, documentSnapshot.data());
      });
    });
  }
  
  //falta implementar aqui
  const signOutGoogle = async() =>{
    GoogleSignin.signOut().then(()=>{
    console.log('saiu');
    }).catch(error =>{
      // console.log(error.code);
      setWarning('Algum erro ocorreu.');
      setModalVisible(true);
    })
  }
  
  const logout = async()=>{
    if(GoogleSignin.isSignedIn){
      signOutGoogle();
    }else{
      auth().currentUser.signOut;
    }
  }


  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={[estilos.styleOne, {flex:0, backgroundColor: 'white', height: '100%'}]}>
        <View style={estilos.retangulo}>
          <Text style={estilos.Style2}>Perfil</Text>
          {/* <Image source={{uri: profile.picture}} */}
          {/* style={estilos.imgPerfil}/> */}
          {/* <Text style={estilos.textoUsuario}>{profile.name}</Text> */}
        </View>
        <Text style={estilos.Text3}>
          Confirme seus dados
        </Text>
        <Text style={estilos.Text4}>
          Número cadastrado
        </Text>
        <Text style={estilos.Text5}>
          +XX (XX) XXXXX-XXXX
        </Text>
        <Text style={estilos.Text6}>
          Endereço de e-mail
        </Text>
        <Text style={estilos.Text7}>
          {/* {profile.email} */}
        </Text>
        <Text style={estilos.Text8}>
          Sobre você
        </Text>
        <Text style={estilos.Text9}>
          Universidade/Campus
        </Text>
        <Text style={estilos.Text10}>
          UFSCar/São Carlos
        </Text>
        <Text style={estilos.Text11}>
          Preferências
        </Text>
        <Text style={estilos.Text12}>
          {/* {route.params?.email} */}
        </Text>
        <Text style={estilos.Text13}>
          Carros
        </Text>
        <TouchableOpacity 
          style={estilos.TouchbleOpct1}
          onPress={logout}  
        >
          <Text style={estilos.Text14}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Perfil_Detalhes;
