import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'

GoogleSignin.configure({
  webClientId: '97527742455-7gie5tgugbocjpr1m0ob9sdua49au1al.apps.googleusercontent.com',
});

function App(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const SignInGoogle = async() =>{
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
    res = await auth().signInWithCredential(googleCredential);
}

  const SignOutGoogle = async() =>{
    try {
      await GoogleSignin.signOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  }

  const InsertUserWithEmail = async() =>{
    const dominio = email.split("@")
    if (dominio != "gmail.com"){
      alert('DOMINIO NAO PERMITIDO')
    }
    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
      //implementar alguma coisa aqui
    })
    .catch(error => {
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
        <View>
        <Button
          title="Google Sign-In"
          onPress={SignInGoogle}
        />
        <Button
          title="Google SignOut"
          onPress={SignOutGoogle}
        />
        <TextInput
          placeholder='Insira seu email'
          style={{backgroundColor: 'white', width: '70%', marginTop: 50, left: 50, borderRadius: 15, color: 'black'}}
          onChangeText={(email)=>{setEmail(email)}}
          keyboardType='email-address'
        />
        <TextInput
          placeholder='Insira sua senha'
          style={{backgroundColor: 'white', width: '70%', marginTop: 50, left: 50, borderRadius: 15, color: 'black'}}
          onChangeText={(password)=>{setPassword(password)}}
          secureTextEntry={true}
        />
        <Button
          title="Cadastrar usuário"
          // style={{marginTop: 20}}
          onPress={InsertUserWithEmail}
        />
        <Button
          title="Entrar"
          // style={{marginTop: 20}}
          // onPress={SignInGoogle}
        />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
});

export default App;
