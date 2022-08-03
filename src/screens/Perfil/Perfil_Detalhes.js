import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal} from 'react-native';
import estilos from '../../estilos/estilos';

import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth'

function Perfil_Detalhes({navigation, route}){
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [universidade, setUniversidade] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
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

  const receberFoto = async()=>{
    // console.log('rodando');
    // const reference = storage().ref('Perfil.jpg');
    // console.log('passou');
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
          <TouchableOpacity 
            style={{position: 'absolute', top:60, alignSelf: 'center'}}
            onPress={receberFoto}  
          >    
            <Image source={
              require('../../assets/icons/user_undefined.png')} 
              style={{height:63, width: 63}}  
            />
          </TouchableOpacity>
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {setModalVisible(!modalVisible);}}
        >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>{message}</Text>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Entendi</Text>
                    </TouchableOpacity>
              </View>
            </View>
          </Modal>
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

export default Perfil_Detalhes;
