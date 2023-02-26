import React, {useEffect, useState} from 'react';
import {View, Text, StatusBar, StyleSheet, TouchableOpacity, SafeAreaView, Modal, Image, Dimensions} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dominios from '../../dominios/dominios.json';

const {height, width} = Dimensions.get('screen')

import serverConfig from '../../../config/config.json';


GoogleSignin.configure({
  webClientId: '97527742455-7gie5tgugbocjpr1m0ob9sdua49au1al.apps.googleusercontent.com',
});


function Cadastro_Inicio({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');
  useEffect(()=>{
    if(GoogleSignin.isSignedIn){
      signOutGoogle();
    }
  })
  
  // const redirecionamentoLogin = async(emailGoogle)=>{  
  //   await AsyncStorage.setItem('email', emailGoogle);
  //   firestore().collection('Users').where('email', '==', emailGoogle).get().then(querySnapshot=>{
  //     const valor = querySnapshot.docs;
  //     console.log(valor);
  //     if (valor == ""){
  //       navigation.navigate("Como_Comecar", {email: emailGoogle});
  //     }
  //     else{
  //       setWarning('Email já cadastrado.\nFaça login para continuar.');
  //       setModalVisible(true);
  //       signOutGoogle();
  //     }
  //   })
  // }
  
  const redirecionamentoLogin = async(emailGoogle)=>{
    await AsyncStorage.setItem('email', emailGoogle);
    let reqs = await fetch(serverConfig.urlRootNode+`buscarPorEmail/${emailGoogle}`,{
      method: 'GET',
      mode: 'cors',
      headers:{
        'Accept':'application/json',
        'Content-type':'application/json'
      }
    });
    const res = await reqs.json();
    console.log('resposta:', res[0]);
    if (res[0] == undefined || res == 'Falha'){
      // console.log('Usuário não encontrado!');
      navigation.navigate("Como_Comecar", {email: emailGoogle});
    }else{
      setWarning('Email já cadastrado.\nFaça login para continuar.');
      setModalVisible(true);
      signOutGoogle();
    }

  }

  const signOutGoogle = async() =>{
    GoogleSignin.signOut().then(()=>{
    }).catch(error =>{
      setWarning('Algum erro ocorreu.');
      setModalVisible(true);
    })
  }

  const SignInGoogle = async() =>{
    try{
      const { idToken } = await GoogleSignin.signIn();
      await AsyncStorage.setItem('token', idToken);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      const dominio = res.user.email.split("@");
      if (dominios.dominios_permitidos.includes(dominio[1]) == false){
        setWarning('Você pode se cadastrar apenas\n com e-mails institucionais!');
        setModalVisible(true);
        if (auth().onAuthStateChanged()){
          const bloquearAcesso = auth().currentUser;
          await bloquearAcesso.delete();
        }
        signOutGoogle();
      }else{
        const emailGoogle = res.user.email.slice();
        redirecionamentoLogin(emailGoogle);
      }
    }catch(e){
      console.log('ERRO:', e.code);
      if (e.code == 12501){
        console.log('exceção tratada');
      }
    }
  }
    

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
          <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
              <TouchableOpacity 
              style={styles.btnFechar}
              onPress={()=>navigation.navigate('Entrada')}
              >
                <Image source={
                  require('../../assets/icons/close.png')} 
                  style={{height:'70%', width: '100%'}}  
                />
            </TouchableOpacity>
            <Text style={styles.txtCadastro}>
                Como você deseja se {'\n'}cadastrar?
            </Text>
            <Image source={
              require('../../assets/icons/google-color.png')} 
              style={{height:'3.2%', width: '6.5%', position: 'absolute', left: '8%', top: '29%'}}  
            />
            <TouchableOpacity 
              style={[styles.btnContinuarComRedes]}
              onPress={SignInGoogle}  
            >
                <Text style={styles.txtBtnContinuarComRedes}>Continuar com Google</Text>
            </TouchableOpacity>
            <View style={{position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                width: '75%',
                left: '7%',
                top: '33.5%'}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <Image source={
              require('../../assets/icons/email.png')} 
              style={{height:'3.5%', width: '7%', position: 'absolute', left: '8%', top: '34.5%'}}  
            />
            <TouchableOpacity 
              style={[styles.btnContinuarComRedes, {width:'100%', top:'35.2%'}]}
              onPress={()=>navigation.navigate('Cadastro_Email')}  
            >
                <Text style={styles.txtBtnContinuarComRedes}>Continuar com e-mail</Text>
            </TouchableOpacity>
            <Text style={styles.txtCadastrar}>Já está cadastrado?</Text>
            <TouchableOpacity 
              style={styles.btnEntrar}
              onPress={()=>navigation.navigate('Login')}
            >
                <Text style={styles.txtBtnEntrar}>Entrar</Text>
            </TouchableOpacity>
            <Text style={styles.textoInformativo}>
                Ao se cadastrar, você aceita nossos Termos e Condições e{'\n'}
                nossa Política de Privacidade.{'\n'}
                Você possui direitos autorais sobre seus dados pessoais e{'\n'}
                pode exercê-los entrando em contato com os responsáveis{'\n'}
                pelo aplicativo por meio do nosso formulário de contato.{'\n'}
                Vale ressaltar, que suas informações estarão protegidas por{'\n'}
                meio da Lei Geral de Proteção de Dados (LGPD), Lei nº{'\n'}
                13.709/2018.
            </Text> 
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>{warning}</Text>
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

export default Cadastro_Inicio;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtCadastro:{
    position: 'absolute',
    width: '75%',
    height: '15%',
    left: '10%',
    top: '15%',
    fontWeight: '700',
    fontSize: height*0.03,
    lineHeight: height*0.04,
    display: 'flex',
    color: '#06444C',
  },
  btnContinuarComRedes:{
    position: 'absolute',
    width: '100%',
    height: '10%',
    left:'15%',
    top: '30%',
  },
  txtBtnContinuarComRedes:{
    fontWeight:'600',
    fontSize: height*0.015,
    lineHeight: 15,
    color: '#06444C',
  },
  btnEntrar:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '8%',
    top: '49%',
  },
  txtBtnEntrar:{
    color: '#FF5F55',
    fontWeight: '700',
    fontSize: height*0.02,
    lineHeight: 20,
  },
  txtCadastrar:{
    color: '#06444C',
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '8%', 
    top: '42.5%',
    fontWeight: '700',
    fontSize: height*0.02,
    lineHeight:18,
    alignItems: 'center',
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
  textoInformativo:{
    color: '#C4C4C4',
    position: 'absolute',
    width: '80%',
    height: '100%',
    left: '8%',
    top: '55%',
    fontWeight: '700',
    fontSize: height*0.012,
    lineHeight:height*0.02,
    alignItems: 'center',
  },
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
});