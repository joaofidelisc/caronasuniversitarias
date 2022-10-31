import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Dimensions} from 'react-native';
import estilos from '../../estilos/estilos';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth'
import FotoPerfil from '../../components/Perfil/FotoPerfil';

const {height,width} = Dimensions.get('screen')

function Perfil_Detalhes({navigation, route}){
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [universidade, setUniversidade] = useState('');
  
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

  useEffect(()=>{
    recuperarDados();
    console.log('Perfil_Detalhes');
  })
  
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={[estilos.styleOne, {flex:0, backgroundColor: 'white', height: '100%'}]}>
        <View style={estilos.retangulo}>
          <FotoPerfil/>
        </View>
        <Text style={[estilos.Style2, {color:'white', fontSize: height*0.016 }]}>Perfil</Text>
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
        <TouchableOpacity style={{position: 'absolute', left: '10%', top: '48%'}}>
          <Text style={estilos.Text9}>
            Universidade/Campus
          </Text>
        </TouchableOpacity>
        <Text style={estilos.Text10}>
          {universidade}
        </Text>
        {/* <TouchableOpacity style={{ position: 'absolute', left: 40, top: 415}}>
          <Text style={estilos.Text11}>
            Preferências
          </Text>
        </TouchableOpacity>
        <Text style={[estilos.Text10, {top: 440}]}>
          Sr. João
        </Text> */}
        <Text style={[estilos.Text13, {top: '55%'}]}>
          Carros
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Perfil_Detalhes;
