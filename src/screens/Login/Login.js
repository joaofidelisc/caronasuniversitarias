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
const dominios_permitidos = ["estudante.ufscar.br", "unesp.com.br", "yahoo.com.br"]

GoogleSignin.configure({
  webClientId: '97527742455-7gie5tgugbocjpr1m0ob9sdua49au1al.apps.googleusercontent.com',
});


function Login({navigation}) {

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
  //https://blog.logrocket.com/email-authentication-react-native-react-navigation-firebase/
  //tratar e-mails e contexto
  const SignInWithEmail = async() =>{
    try{
      auth().signInWithEmailAndPassword(email, password);
    }catch (error){
      console.error(error);
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
            // onPress={SignInWithEmail}
            onPress={()=>{navigation.navigate('MenuPrincipal')}}
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
