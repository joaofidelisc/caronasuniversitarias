import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, TextInput, Dimensions} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';


import estilos from '../../estilos/estilos';

import FotoPerfil from '../../components/Perfil/FotoPerfil';
import ModoAplicativo from '../../components/Perfil/ModoAplicativo';

import auth from '@react-native-firebase/auth'
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import serverConfig from '../../../config/config.json';


const {height,width} = Dimensions.get('screen')

function Perfil_Conta({navigation}){
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [aviso, setAviso] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modoApp, setModoApp] = useState('');
  const [modalModo, setModalModo] = useState(false);

  const modoAtuacao = async()=>{
    const userID = auth().currentUser.uid;
    firestore().collection('Users').doc(userID).get().then(doc=>{
      if (doc && doc.exists){
        if (doc.data().motorista == true){
          setModoApp('motorista');
        }else{
          setModoApp('passageiro');
        }
      }
    })
  }

  /*function modoAtuacao() {
    const motorista = 'motorista';
    const passageiro = 'passageiro';
    const userID = auth().currentUser.uid;
    //busca pelo id de usuario o valor bool para modo motorista ou passageiro
    let reqs = await fetch(serverConfig.urlRootNode + `buscarUsuario/${userID}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    });
    const res = await reqs.json();
    try{
      if (res != 'Falha' && res.motorista == true) {
            setModoApp(motorista);
          } else {
            setModoApp(passageiro);
          }
    }catch(err){
      console.log('erro em modo atuacao'+err);
    }finally{
      console.log(res.motorista)
    }
  }*/

  const signOut = async()=>{
    const providerID = auth().currentUser?.providerData[0].providerId;
    console.log(auth().currentUser?.providerData[0].providerId);
    try{
      if (providerID == 'google.com'){
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem("token");
        await GoogleSignin.signOut();
      }else{
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        auth().signOut();
      }
      resetaEstados();
      RNRestart.Restart();
    }catch(error){
      console.log('erro no logout!');
    }
    console.log('SAINDO...');
  }
  
  const resetaEstados = async()=>{
    if (modoApp == 'motorista'){
      await AsyncStorage.removeItem('Oferecer');
      await AsyncStorage.removeItem('ViagemMotorista');
      await AsyncStorage.removeItem('ClassificarPassageiro');
    }else if(modoApp == 'passageiro'){
      await AsyncStorage.removeItem('BuscandoCarona');
      await AsyncStorage.removeItem('CaronaEncontrada');
      await AsyncStorage.removeItem('AguardandoMotorista');
      await AsyncStorage.removeItem('ViagemEmAndamento');
      await AsyncStorage.removeItem('Classificacao');
    }
  }
  const changePassword = async()=>{
    setAviso('Digite a senha atual e a nova')
    setAlterarSenha(true);
    setModalVisible(true);
    const senha_atual = await auth().currentUser.uid;
    console.log(senha_atual);

  }

  const notificacoes = async()=>{

  }

  const endereco = async()=>{
    
  }

  useEffect(()=>{
    console.log('Perfil_Conta');
    modoAtuacao();
  })
  
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
          <View style={[estilos.styleOne, {flex:0, backgroundColor:'white', height: '100%'}]}>           
            <View style={[estilos.retangulo]}>
              <FotoPerfil/>
              <ModoAplicativo/>
            </View>
    
            <Text style={[estilos.Style2, {color:'white', fontSize: height*0.016 }]}>Perfil</Text>
            <Text style={{position: 'absolute', left: '5%', top: '36%', fontWeight: '700', fontSize: height*0.017, lineHeight: 15, color: '#06444C'}}>Avaliação</Text>
              <TouchableOpacity style={{position: 'absolute', left: '10%', top: '40%'}}>
                <Text style={{fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'}}>Avaliações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: '10%', top: '44%'}}>
                <Text style={{fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'}}>Feedback</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: '5%', top: '48%', fontWeight: '700', fontSize: height*0.017, lineHeight: 15, color: '#06444C'}}>Preferências</Text>
              <TouchableOpacity 
                style={{position: 'absolute', left: '10%', top: '52%'}}
                onPress={changePassword}
                >
                <Text style={{fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'}}>Alterar senha</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: '10%', top: '56%'}}>
                <Text style={{fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'}}>Notificações</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: '5%', top: '60%', fontWeight: '700', fontSize: height*0.017, lineHeight: 15, color: '#06444C'}}>Sobre</Text>
              <TouchableOpacity style={{position: 'absolute', left: '10%', top: '64%'}}>
                <Text style={{fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'}}>Ajuda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: '10%', top: '68%'}}>
                <Text style={{fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'}}>Termos de uso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: '10%', top: '72%'}}>
                <Text style={{fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'}}>Licença</Text>      
              </TouchableOpacity>
            <TouchableOpacity 
              style={[estilos.TouchbleOpct1, {top:'76%'}]}
              onPress={signOut}
            >
              <Text style={estilos.Text14}>Sair</Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
            >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>{aviso}</Text>
                    {
                      alterarSenha &&
                      <>
                        <TextInput
                        style={{width: 200, height: 40, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 15, borderWidth: 1, color:'black'}}
                        placeholderTextColor='black'
                        placeholder='Senha atual'
                        secureTextEntry={true}
                        onChangeText={(password)=>setPassword(password)}
                        />
                         <TextInput
                        style={{width: 200, height: 40, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 15, borderWidth: 1, color:'black', marginTop: 15, marginBottom: 15}}
                        placeholderTextColor='black'
                        placeholder='Nova senha'
                        secureTextEntry={true}
                        onChangeText={(newPassword)=>setNewPassword(newPassword)}
                        />

                      </>
                      
                    }
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Confirmar</Text>
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
  }
});

export default Perfil_Conta;
