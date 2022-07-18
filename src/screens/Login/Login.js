import React, {useState} from 'react';
import {
  SafeAreaView, 
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal, 
  StyleSheet,
} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'

// incluir aqui dominios permitidos (válido para email e autenticação com Google)
const dominios_permitidos = ["estudante.ufscar.br", "unesp.com.br"]

GoogleSignin.configure({
  webClientId: '97527742455-7gie5tgugbocjpr1m0ob9sdua49au1al.apps.googleusercontent.com',
});


function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');
  const [loginPermitidoEmail, setLoginPermitidoEmail] = useState(false);

  const SignInGoogle = async() =>{
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    res = await auth().signInWithCredential(googleCredential);
    console.log(res);
  }

  const SignOutGoogle = async() =>{
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  }

  const InsertUserWithEmail = async() =>{
    if (email == '' && password == ''){
      setLoginPermitidoEmail(false);
      setWarning('Os campos de e-mail e senha\n não podem estar vazios!');
      setModalVisible(true);
    }
    else if (email == ''){
      setLoginPermitidoEmail(false);
      setWarning('O campo e-mail \nnão pode estar vazio!')
      setModalVisible(true);
    }
    else if (password == ''){
      setLoginPermitidoEmail(false);
      setWarning('O campo senha \nnão pode estar vazio!')
      setModalVisible(true);
    }
    else{
      const dominio = email.split("@")
      if (dominios_permitidos.includes(dominio[1]) == false){
        setLoginPermitidoEmail(false);
        setWarning('Você pode fazer login\n apenas com e-mails institucionais!');
        setModalVisible(true);
      }
      else{
        auth().createUserWithEmailAndPassword(email, password).then(() => {
          setLoginPermitidoEmail(true);
          setWarning('Conta criada com sucesso!')
          setModalVisible(true);
        }).catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setLoginPermitidoEmail(false);
            setWarning('Este email já está em uso, escolha outro!')
            setModalVisible(true);
          }
          if (error.code === 'auth/invalid-email') {
            setLoginPermitidoEmail(false);
            setWarning('E-mail inválido!')
            setModalVisible(true);
          }
          // console.error(error);
        });
      }
    }
  }
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
        <View style={{backgroundColor: '#FFF', height: '100%'}}>
          <Text style={{color: '#06444C', position: 'absolute', top: 65, fontWeight: '700', fontSize: 24, lineHeight: 29, alignSelf: 'center', textAlign: 'center'}}>Nos informe seu e-mail{'\n'} e senha de cadastro</Text>
          <TextInput
            style={{backgroundColor: '#C4C4C4', width: 291, height: 47, top: 167, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 18, lineHeight: 22}}
            placeholder='E-mail'
            keyboardType='email-address'
            onChangeText={(email)=>setEmail(email)}
            />
          <TextInput
            style={{backgroundColor: '#C4C4C4', width: 291, height: 47, top: 200, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 18, lineHeight: 22}}
            placeholder='Senha'
            secureTextEntry={true}
            onChangeText={(password)=>setPassword(password)}
          />
          <TouchableOpacity 
            style={{position: 'absolute', width: 291, height: 47, top: 395, backgroundColor: '#C4C4C4', borderRadius: 15, alignSelf: 'center', justifyContent: 'center'}}
            onPress={SignInGoogle}
          >
            
            <Text style={{fontWeight: '400', fontSize: 16, lineHeight: 20, textAlign: 'center'}}>Continuar com Google</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{position: 'absolute', width: 291, height: 47, top: 492, backgroundColor: '#FF5F55', borderRadius: 15, alignSelf: 'center', justifyContent: 'center'}}
            onPress={InsertUserWithEmail}
            >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 20, lineHeight: 24, textAlign: 'center'}}>Continuar</Text>
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
});

export default App;
