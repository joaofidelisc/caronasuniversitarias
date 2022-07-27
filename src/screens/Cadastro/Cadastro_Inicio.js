import React, {useEffect, useState} from 'react';
import {View, Text, StatusBar, StyleSheet, TouchableOpacity, SafeAreaView, Modal} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const dominios_permitidos = ["estudante.ufscar.br"];


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
  
  const redirecionamentoLogin = async(emailGoogle)=>{  
    // console.log('email:', emailGoogle);
    firestore().collection('Passageiro').where('email', '==', emailGoogle).get().then(querySnapshot=>{
      const valor = querySnapshot.docs;
      // console.log(valor);
      if (valor == ""){
        // console.log("AAA");
        navigation.navigate("Como_Comecar", {email: emailGoogle});
      }
      else{
        setWarning('Email já cadastrado.\nFaça login para continuar.');
        setModalVisible(true);
        signOutGoogle();
        // navigation.navigate("MenuPrincipal");
      }
    })
  }

  const signOutGoogle = async() =>{
    GoogleSignin.signOut().then(()=>{
      // console.log('saiu');
    }).catch(error =>{
      // console.log(error.code);
      setWarning('Algum erro ocorreu.');
      setModalVisible(true);
    })
  }

  //impede o usuário de fazer login mas não o remove da base de dados;
  const SignInGoogle = async() =>{
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const res = await auth().signInWithCredential(googleCredential);
    const dominio = res.user.email.split("@");
    if (dominios_permitidos.includes(dominio[1]) == false){
      setWarning('Você pode se cadastrar apenas\n com e-mails institucionais!');
      setModalVisible(true);
      if (auth().onAuthStateChanged()){
        const bloquearAcesso = await auth().currentUser;
        await bloquearAcesso.delete();
      }
      signOutGoogle();
    }else{
      await AsyncStorage.setItem("token", idToken);
      const emailGoogle = res.user.email.slice();
      redirecionamentoLogin(emailGoogle);
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
                <Text style={styles.txtBtnFechar}>X</Text>
            </TouchableOpacity>
            <Text style={styles.txtCadastro}>
                Como você deseja se {'\n'}cadastrar?
            </Text>
            <TouchableOpacity 
              style={[styles.btnContinuarComRedes]}
              onPress={SignInGoogle}  
            >
                <Text style={styles.txtBtnContinuarComRedes}>Continuar com Google</Text>
            </TouchableOpacity>
            <View style={{position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                width: 309,
                left: 28,
                top: 266.5}}>
                <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            </View>
            <TouchableOpacity 
              style={[styles.btnContinuarComRedes, {width:228, top:279}]}
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
    width: 315,
    height: 51,
    left: 28,
    top: 130,
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    display: 'flex',
    color: '#06444C',
  },
  btnContinuarComRedes:{
    position: 'absolute',
    width: 315,
    height: 18,
    left:63,
    top: 236,
  },
  txtBtnContinuarComRedes:{
    fontWeight:'600',
    fontSize: 12,
    lineHeight: 15,
    color: '#06444C',
  },
  btnEntrar:{
    position: 'absolute',
    width: 53,
    height: 20,
    left: 28,
    top: 374,
  },
  txtBtnEntrar:{
    color: '#FF5F55',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  txtCadastrar:{
    color: '#06444C',
    position: 'absolute',
    width: 315,
    height: 18,
    left: 28, 
    top: 333,
    fontWeight: '700',
    fontSize: 15,
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
    width: 315,
    height: 600,
    left: 28,
    top: 417,
    fontWeight: '700',
    fontSize: 10,
    lineHeight:12,
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