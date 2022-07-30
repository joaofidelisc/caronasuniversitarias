import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

import estilos from '../../estilos/estilos';

/*
  tentar inserir dados no firestore usando o UID, fica mais fácil depois pra fazer as operações de CRUD - João;
*/

function Perfil_Conta({navigation}){


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

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
        {/* <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}> */}
          <View style={[estilos.styleOne, {flex:0, backgroundColor:'white', height: '100%'}]}>
            <View style={estilos.retangulo}>
              <Text style={estilos.Style2}>Perfil</Text>
              {/* <Image source={{uri: profile.picture}} */}
              {/* style={estilos.imgPerfil}/> */}
              {/* <Text style={estilos.textoUsuario}>{profile.name}</Text> */}
            </View>
            <Text style={{position: 'absolute', left: 25, top: 200, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Avaliação</Text>
              <Text style={{position: 'absolute', left: 40, top: 230, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Avaliações</Text>
              <Text style={{position: 'absolute', left: 40, top: 260, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Feedback</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 290, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Preferências</Text>
              <Text style={{position: 'absolute', left: 40, top: 320, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Alterar senha</Text>
              <Text style={{position: 'absolute', left: 40, top: 350, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Notificações</Text>
              <Text style={{position: 'absolute', left: 40, top: 380, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Endereço</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 410, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
              <Text style={{position: 'absolute', left: 40, top: 440, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Métodos de pagamento</Text>
              <Text style={{position: 'absolute', left: 40, top: 470, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 500, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Sobre</Text>
              <Text style={{position: 'absolute', left: 40, top: 530, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Ajuda</Text>
              <Text style={{position: 'absolute', left: 40, top: 560, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Termos de uso</Text>
              <Text style={{position: 'absolute', left: 40, top: 590, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Licença</Text>      
            <TouchableOpacity 
              style={[estilos.TouchbleOpct1, {top:620}]}
              // onPress={signOutGoogle}
            >
              <Text style={estilos.Text14}>Sair</Text>
            </TouchableOpacity>
          </View>
    {/* </View> */}
    </SafeAreaView>
  );
}

export default Perfil_Conta;
