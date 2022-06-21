import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import * as AuthSession from 'expo-auth-session';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type AuthResponse = {
  type: string;  
  params: {
    access_token: string;
  }
}

const Login: React.FC<LoginScreenProps> = (props) =>{
  async function handleSignIn(){
      const CLIENT_ID = '772430708355-bj8udba24u30ja1mi86k9rrcv6k3f2d3.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@joao.fidelisc/caronasuniversitarias';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const {type, params} = await AuthSession.startAsync({authUrl}) as AuthResponse;
      
      if (type === 'success'){
        props.navigation.push('MenuPrincipal', {token: params.access_token} as never); //pesquisar tipagem para essa linha
      }
  }

  return (
    <View style={styles.container}>
       <TouchableOpacity 
          style={styles.btnFechar}
          onPress={()=>props.navigation.push('Entrada')}
          >
            <Text style={styles.txtBtnFechar}>X</Text>
        </TouchableOpacity>
      <Text style={styles.txtGeral}>
        Nos informe o seu e-mail{'\n'} e senha de cadastro
      </Text>
      <TextInput
        style={styles.input}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder="E-mail"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, {top: 238}]}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder="Senha"
        keyboardType="default"
        secureTextEntry={true}
      />
      <StatusBar style="auto"/>
      <TouchableOpacity 
        style={styles.btnContinuar}
        onPress={handleSignIn}
      >
        <Text style={styles.txtBtnContinuar}>Continuar com Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtGeral: {
    position: 'absolute',
    width: 303,
    height: 51,
    left: 34,
    top: 65,
    fontSize: 24,
    lineHeight: 29,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#06444C',
    fontWeight: '700',
  },
  input:{
    backgroundColor: '#C4C4C4',
    position: 'absolute',
    width: 291,
    height: 47,
    left: 34,
    top: 167,
    borderRadius: 15,
    color: 'white',
    textAlign:'center',
  },
  btnContinuar:{
    position: 'absolute',
    width: 291,
    height: 47,
    left: 34,
    top: 492,
    backgroundColor: "#FF5F55",
    borderRadius: 15,
    justifyContent: 'center',
  },
  txtBtnContinuar:{
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 20,
    color: 'white',
  },
  btnContinuarGoogle:{
    width: 291,
    height: 47,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  txtBtnContinuarGoogle:{
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
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