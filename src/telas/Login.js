import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types/types';
// import * as AuthSession from 'expo-auth-session';
import estilos from '../estilos/estilos';

// type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
// type AuthResponse = {
//   type: string;  
//   params: {
//     access_token: string;
//   }
// }

function Login({navigation}){
//   async function handleSignIn(){
//       const CLIENT_ID = '772430708355-bj8udba24u30ja1mi86k9rrcv6k3f2d3.apps.googleusercontent.com';
//       const REDIRECT_URI = 'https://auth.expo.io/@joao.fidelisc/caronasuniversitarias';
//       const RESPONSE_TYPE = 'token';
//       const SCOPE = encodeURI('profile email');

//       const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

//       const {type, params} = await AuthSession.startAsync({authUrl}) as AuthResponse;
      
//       if (type === 'success'){
//         props.navigation.push('MenuPrincipal', {token: params.access_token} as never); //pesquisar tipagem para essa linha
//       }
//   }

  return (
    <View style={estilos.container}>
       <TouchableOpacity 
          style={estilos.btnFechar}
          onPress={()=>navigation.navigate('Entrada')}
          >
            <Text style={estilos.txtBtnFechar}>X</Text>
        </TouchableOpacity>
      <Text style={estilos.txtGeral}>
        Nos informe o seu e-mail{'\n'} e senha de cadastro
      </Text>
      <TextInput
        style={estilos.input}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder="E-mail"
        keyboardType="email-address"
      />
      <TextInput
        style={[estilos.input, {top: 238}]}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholder="Senha"
        keyboardType="default"
        secureTextEntry={true}
      />
      <StatusBar style="auto"/>
      <TouchableOpacity 
        style={estilos.btnContinuar}
        // onPress={handleSignIn}
      > 
      <Text style={estilos.txtBtnContinuar}>Continuar com Google</Text>
      </TouchableOpacity>
      <Image 
        source = {{uri:'https://cdn-icons-png.flaticon.com/512/300/300221.png'}}
        style = {{ width: 31, height: 31, position: 'absolute', left: 53, top: 403}}
      />
      <TouchableOpacity 
        style={{position: 'absolute', width: 291, height: 47, left: 34, top: 492, backgroundColor: '#FF5F55', borderRadius:15, justifyContent: 'center', alignItems: 'center'}}
        // onPress={()=>navigation.navigate('MenuPrincipal')}
      >
        <Text style={{fontWeight:'600', fontSize: 20, lineHeight: 24, color: 'white'}}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

