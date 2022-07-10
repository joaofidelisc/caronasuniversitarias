import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';

import { addDoc, collection, doc } from 'firebase/firestore';
import { db } from '../../config';

export default function Dados() {
    function insert(){
        console.log('inseriu')
        addDoc(collection(db, 'users'),{
            name:'Joao'
        })
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Dados</Text>
        <TouchableOpacity
            onPress={insert}
        >
            <Text>Inserir</Text>
        </TouchableOpacity>
        <StatusBar style="auto"/>
      </View>
    );
  }

