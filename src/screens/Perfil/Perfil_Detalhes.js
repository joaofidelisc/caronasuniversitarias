import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import estilos from '../../estilos/estilos';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth'

function Perfil_Detalhes({navigation, route}){
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [universidade, setUniversidade] = useState('');
  //pesquisar como passar isso por params (está indo pra menuprincipal, mas preciso que vá para Perfil_Conta e Perfil_Detalhes);
  //quando resolver, remover o import auth;
  
  
  const recuperarDados = async()=>{
    const userID = await auth().currentUser.uid;
    firestore().collection('Users').doc(userID).get().then(doc=>{
      if (doc && doc.exists){
        const nome_usuario = doc.data().nome;
        const celular_usuario = doc.data().num_cel;
        const email_usuario = doc.data().email;
        const universidade_usuario = doc.data().universidade;
        setNome(nome_usuario);
        setCelular(celular_usuario);
        setEmail(email_usuario);
        setUniversidade(universidade_usuario);
      }
    })
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
  
  useEffect(()=>{
    recuperarDados();
  })
  
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
          {celular}
        </Text>
        <Text style={estilos.Text6}>
          Endereço de e-mail
        </Text>
        <Text style={estilos.Text7}>
          {email}
        </Text>
        <Text style={estilos.Text8}>
          Sobre você
        </Text>
        <Text style={estilos.Text9}>
          Universidade/Campus
        </Text>
        <Text style={estilos.Text10}>
          {universidade}
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
          // onPress={recuperarDados}  
        >
          <Text style={estilos.Text14}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Perfil_Detalhes;
