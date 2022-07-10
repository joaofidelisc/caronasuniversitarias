import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { addDoc, collection, doc } from 'firebase/firestore';
import { db } from '../../config';

export default function Dados() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function cadastrar(){
        addDoc(collection(db, 'users'),{
            useremail: email,
            password: password
        })
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 15}}>Cadastre-se</Text>
        <TextInput 
          placeholder='useremail@estudante.ufscar.br'
          onChangeText={(email)=>{setEmail(email)}}
          style={{borderRadius: 10, backgroundColor: 'gray', width: '60%', height: '5%', textAlign: 'center'}}
        />
        <TextInput 
          placeholder='password'
          onChangeText={(password)=>{setPassword(password)}}
          style={{borderRadius: 10, backgroundColor: 'gray', width: '60%', height: '5%', textAlign: 'center', marginTop: 15}}
          secureTextEntry
        />
        <TouchableOpacity
            onPress={cadastrar}
            style={{marginTop: 15, backgroundColor: 'red', borderRadius: 15, width: '30%', height: '8%', alignItems:'center', justifyContent: 'center'}}
        >
            <Text style={{color:'white', fontWeight: 'bold', fontSize: 18}}>Cadastrar</Text>
        </TouchableOpacity>
        <StatusBar style="auto"/>
      </View>
    );
  }

