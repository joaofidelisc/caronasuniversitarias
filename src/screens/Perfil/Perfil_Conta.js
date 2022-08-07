import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, PermissionsAndroid} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import estilos from '../../estilos/estilos';

import FotoPerfil from '../../components/Perfil/FotoPerfil';

function Perfil_Conta({navigation}){


  // //falta implementar aqui
  // const signOutGoogle = async() =>{
  //   GoogleSignin.signOut().then(()=>{
  //     console.log('saiu');
  //   }).catch(error =>{
  //     // console.log(error.code);
  //     setWarning('Algum erro ocorreu.');
  //     setModalVisible(true);
  //   })
  // }

  useEffect(()=>{
    console.log('Perfil_Conta');
  })
  
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
          <View style={[estilos.styleOne, {flex:0, backgroundColor:'white', height: '100%'}]}>           
            <View style={estilos.retangulo}>
              <FotoPerfil/>
            </View>
            <Text style={[estilos.Style2, {color:'white', fontSize: 15}]}>Perfil</Text>
            <Text style={{position: 'absolute', left: 25, top: 200, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Avaliação</Text>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 230}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Avaliações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 260}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Feedback</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 290, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Preferências</Text>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 320}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Alterar senha</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 350}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Notificações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 380}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Endereço</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 410, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 440}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Métodos de pagamento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 470}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 500, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Sobre</Text>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 530}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Ajuda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 560}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Termos de uso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 590}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Licença</Text>      
              </TouchableOpacity>
            <TouchableOpacity 
              style={[estilos.TouchbleOpct1, {top:640}]}
              // onPress={}
            >
              <Text style={estilos.Text14}>Sair</Text>
            </TouchableOpacity>
          </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  btnFechar:{
    position: 'absolute',
    width: 14,
    height: 29,
    left: 22,
    top: 20,
  },
  txtBtnFechar:{
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 29,
    alignItems: 'center',
    color: '#FF5F55',
  },
});

export default Perfil_Conta;
