import React, {useState} from 'react';
import {
  SafeAreaView, 
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity
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
    const dominio = email.split("@")
    if (dominios_permitidos.includes(dominio[1]) == false){
      console.log(dominios_permitidos.includes(dominio))
      alert('Apenas dominínios universitários são permitidos')
    }
    auth().createUserWithEmailAndPassword(email, password).then(() => {
      console.log('User account created & signed in!');
      //implementar alguma coisa aqui
    }).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        //implementar alguma coisa aqui
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        //implementar alguma coisa aqui
      }
      console.error(error);
    });
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
        </View>
      </SafeAreaView>
  )
}

export default App;
