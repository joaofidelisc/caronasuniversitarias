import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Dimensions} from 'react-native';
import estilos from '../../estilos/estilos';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth'
import FotoPerfil from '../../components/Perfil/FotoPerfil';
import ModoAplicativo from '../../components/Perfil/ModoAplicativo';

import serverConfig from '../../../config/config.json';


const {height,width} = Dimensions.get('screen')

function Perfil_Detalhes({navigation, route}){
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [universidade, setUniversidade] = useState('');
  
  // const recuperarDados = async()=>{
  //   const userID = auth().currentUser.uid;
  //   firestore().collection('Users').doc(userID).get().then(doc=>{
  //     if (doc && doc.exists){
  //       const nome_usuario = doc.data().nome;
  //       const celular_usuario = doc.data().num_cel;
  //       const email_usuario = doc.data().email;
  //       const universidade_usuario = doc.data().universidade;
  //       setNome(nome_usuario);
  //       setCelular(celular_usuario);
  //       setEmail(email_usuario);
  //       setUniversidade(universidade_usuario);
  //     }
  //   })
  // }
  
  //const userUID = auth().currentUser.uid;
  //Essa função altera algum dado do usuario?
  //Pela quantidade de useStates, essa foi a dedução, mas não ficou claro
  
  
  async function recuperarDados(){
    const userID = auth().currentUser.uid;
    let reqs = await fetch(serverConfig.urlRootNode+`buscarUsuario/${userID}`,{
      method: 'GET',
      mode: 'cors',
      headers:{
        'Accept':'application/json',
        'Content-type':'application/json'
      }
    });
  const res = await reqs.json();
    if (res != 'Falha'){
        const nome_usuario = res.nome;
        const celular_usuario = res.numCel; //OBS: "numCel" foi usado no modelo sequelize porem com o firestore estava "num_cel".   
        const email_usuario = res.email;
        const universidade_usuario = res.universidade;
        setNome(nome_usuario);
        setCelular(celular_usuario);
        setEmail(email_usuario);
        setUniversidade(universidade_usuario);
    }else{
      setNome('Erro');
      setCelular('(xx)xxxxx-xxxx');
      setUniversidade('Atualizar');
    }
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
          <ModoAplicativo/>
        </View>
        <Text style={[estilos.Style2, {color:'white', fontSize: height*0.016 }]}>Perfil</Text>
        <Text style={[estilos.Text3, {top: '36%'}]}>
          Confirme seus dados
        </Text>
        <Text style={[estilos.Text4, {top: '40%'}]}>
          Número cadastrado
        </Text>
        <Text style={[estilos.Text5, {top: '44%'}]}>
          {celular}
        </Text>
        <Text style={[estilos.Text6, {top: '48%'}]}>
          Endereço de e-mail
        </Text>
        <Text style={[estilos.Text7, {top: '52%'}]}>
          {email}
        </Text>
        <Text style={[estilos.Text8, {top: '56%'}]}>
          Sobre você
        </Text>
        <TouchableOpacity style={{position: 'absolute', left: '10%', top: '60%'}}>
          <Text style={estilos.Text9}>
            Universidade/Campus
          </Text>
        </TouchableOpacity>
        <Text style={[estilos.Text10, {top: '64%'}]}>
          {universidade}
        </Text>
        <Text style={[estilos.Text13, {top: '68%'}]}>
          Carros
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Perfil_Detalhes;
