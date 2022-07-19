import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';

import estilos from '../../estilos/estilos';


function Perfil_Detalhes({navigation}){
  // const {token} = route.params;
  // const [profile, setProfile] = useState({} as Profile);
  
  // async function loadProfile() {
  //   const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${token}`);
  //   const userInfo = await response.json();
  //   setProfile(userInfo);
  // }
  // useEffect(()=>{
  //   loadProfile();
  // },[]);

  //   //CORRIGIR ESTILOS
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
          Sem preferências
        </Text>
        <Text style={estilos.Text13}>
          Carros
        </Text>
        <TouchableOpacity style={estilos.TouchbleOpct1}>
          <Text style={estilos.Text14}>Adicionar carro +</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Perfil_Detalhes;
