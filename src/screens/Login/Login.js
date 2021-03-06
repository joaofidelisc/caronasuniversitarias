import React, {useState, useEffect} from 'react';
import {
  SafeAreaView, 
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal, 
  StyleSheet,
  ActivityIndicatorComponent,
} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { firebase } from '@react-native-firebase/auth'

import AsyncStorage from '@react-native-async-storage/async-storage';

import firestore from '@react-native-firebase/firestore';

// incluir aqui dominios permitidos (válido para email e autenticação com Google)
const dominios_permitidos = ["estudante.ufscar.br"];

GoogleSignin.configure({
  webClientId: '97527742455-7gie5tgugbocjpr1m0ob9sdua49au1al.apps.googleusercontent.com',
});


function Login({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');

  const partesEmail = email.split("@");
  
  useEffect(()=>{
    if(GoogleSignin.isSignedIn){
      signOutGoogle();
    }
  })
  
  const redirecionamentoLogin = async(emailGoogle)=>{  
    if (email == ''){
      firestore().collection('Users').where('email', '==', emailGoogle).get().then(querySnapshot=>{
        const valor = querySnapshot.docs;
        if (valor == ""){
          navigation.navigate("Como_Comecar", {email: emailGoogle});
        }
        else{
          navigation.navigate("MenuPrincipal");
        }
      })
    }else{
      firestore().collection('Users').where('email', '==', email).get().then(querySnapshot=>{
        const valor = querySnapshot.docs;
        if (valor == ""){
          navigation.navigate("Como_Comecar", {email: email});
        }
        else{
          navigation.navigate("MenuPrincipal");
        }
      })
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
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      const dominio = res.user.email.split("@");
      if (dominios_permitidos.includes(dominio[1]) == false){
        setWarning('Você pode entrar apenas\n com e-mails institucionais!');
        setModalVisible(true);
        if (auth().onAuthStateChanged()){
          const bloquearAcesso = await auth().currentUser;
          await bloquearAcesso.delete();
        }
        signOutGoogle();
      }else{
        // await AsyncStorage.setItem("token", idToken);
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

  const esqueciMinhaSenha = async()=>{
    if (email == ''){
      setWarning('Preencha o e-mail para recuperar a senha.');
      setModalVisible(true);
    }else{
      auth().sendPasswordResetEmail(email).then(()=>{
      setWarning(`O link de redefinição de senha foi enviado para ${email}`);
      setModalVisible(true);
      }).catch(error =>{
        if (error.code == 'auth/invalid-email'){
          setWarning('Digite um e-mail válido para recuperar a senha.');
          setModalVisible(true);
        }
        else if(error.code == 'auth/user-not-found'){
          setWarning('Usuário não encontrado.');
          setModalVisible(true);
        }
        else{
          console.log(error.code);
        }
      })
    }
  }
  //https://blog.logrocket.com/email-authentication-react-native-react-navigation-firebase/
  //tratar e-mails e contexto
  const SignInWithEmail = async() =>{
    if (email == '' && password == ''){
      setWarning('Preencha os campos de e-mail e senha!');
      setModalVisible(true);
    }
    else if (email == ''){
      setWarning('O campo e-mail não pode estar vazio.');
      setModalVisible(true);
    }
    else if (password == ''){
      setWarning('O campo senha não pode estar vazio.');
      setModalVisible(true);
    }
    else{
      if (partesEmail[0] == undefined || partesEmail[1] == undefined || partesEmail[0] == "" || partesEmail[1] == ""){
        setWarning('E-mail inválido.');
        setModalVisible(true);
      }
      else{
        auth().signInWithEmailAndPassword(email, password).then((result)=>{
          if (auth().currentUser.emailVerified==true){
            redirecionamentoLogin();
          }
          else{
            auth().currentUser.reload();
            auth().currentUser.getIdToken(true);
            setWarning('Verifique seu e-mail antes de prosseguir!');
            setModalVisible(true);
        }
        }).catch(error => {
          if (error.code == 'auth/user-not-found'){
            setWarning('Usuário não cadastrado!');
            setModalVisible(true);
          }else if (error.code == 'auth/wrong-password'){
            setWarning('Senha Incorreta!');
            setModalVisible(true);
          }else if (error.code == 'auth/too-many-requests'){
            setWarning('Você tentou muitas vezes, tente novamente\n daqui a 20 segundos.');
            setModalVisible(true);
          }else if (error.code == 'auth/invalid-email'){
            setWarning('E-mail inválido.\nDigite um e-mail corretamente.');
            setModalVisible(true);
          }else{
            setWarning('Algo deu errado, tente novamente mais tarde.');
            setModalVisible(true);
          }
        })
      }
    }  
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
        <View style={{backgroundColor: '#FFF', height: '100%'}}>
          <TouchableOpacity 
              style={styles.btnFechar}
              onPress={()=>navigation.navigate('Entrada')}
              >
                <Text style={styles.txtBtnFechar}>X</Text>
          </TouchableOpacity>
          <Text style={{color: '#06444C', position: 'absolute', top: 65, fontWeight: '700', fontSize: 24, lineHeight: 29, alignSelf: 'center', textAlign: 'center'}}>Nos informe seu e-mail{'\n'} e senha de cadastro</Text>
          <TextInput
            style={{width: 291, height: 47, top: 167, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 18, lineHeight: 22, borderWidth: 1, color:'black'}}
            placeholderTextColor='black'
            placeholder='E-mail'
            keyboardType='email-address'
            onChangeText={(email)=>setEmail(email)}
            />
          <TextInput
            style={{width: 291, height: 47, top: 200, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 18, lineHeight: 22, borderWidth: 1, color:'black'}}
            placeholderTextColor='black'
            placeholder='Senha'
            secureTextEntry={true}
            onChangeText={(password)=>setPassword(password)}
          />
          <TouchableOpacity 
            style={{position: 'absolute', width: 291, height: 47, top: 395, backgroundColor: '#FF5F55', borderRadius: 15, alignSelf: 'center', justifyContent: 'center'}}
            onPress={SignInGoogle}
          >
            
            <Text style={{fontWeight: '600', fontSize: 18, lineHeight: 20, textAlign: 'center', color:'white'}}>Continuar com Google</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{position: 'absolute', width: 291, height: 47, top: 492, backgroundColor: '#FF5F55', borderRadius: 15, alignSelf: 'center', justifyContent: 'center'}}
            onPress={SignInWithEmail}
            >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>Continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{position: 'absolute', width: 291, height: 47, top: 590, alignSelf: 'center', justifyContent: 'center'}}
            onPress={esqueciMinhaSenha}
            >
            <Text style={{color: '#FF5F55', fontWeight: '600', fontSize: 15, lineHeight: 24, textAlign: 'center'}}>Esqueci minha senha</Text>
          </TouchableOpacity>
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
  )
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

export default Login;
