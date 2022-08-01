import React from 'react';
import {View, Text, SafeAreaView, StatusBar, Button, Image, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {useState} from 'react';

export default function Procurar({navigation}) {

  const [lugar,setLugar]=useState("")

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%',}}>
        <Image
          source={require('../Procurar/carropesquisa.png')}
          style={{resizeMode:'center',width:100, height:100, padding:100, paddingVertical:90, marginVertical:0}}
        />
        <Text style={{fontSize:20, color:'#2f4f4f', paddingHorizontal:70, fontWeight:'bold'}}>Para onde pretende ir?</Text>
        <Text style={{fontSize:15, color:'#c0c0c0', paddingHorizontal:70, fontWeight:'normal', marginVertical:15}}>Ex: Universidade fereral de São Carlos</Text>
        <TextInput
          style={{

          borderWidth:1, 
          borderColor:'#000', 
          alignItems:'center', 
          padding:20,
          paddingHorizontal:150,
          paddingVertical:20,
          borderTopRightRadius:15, 
          borderTopLeftRadius:15,
          borderBottomRightRadius:15,
          borderBottomLeftRadius:15,
          borderBottomStartRadius:15,
          borderBottomEndRadius:15,
          borderTopLeftRadius:15,
          borderTopRightRadius:15,
          marginHorizontal:0,
          color:'black'
      
        }}
          value={lugar}
          onChangeText={text=>setLugar(text)}
          autoCapitalize="words"
          allowFontScaling={true}
          caretHidden={false}
          blurOnSubmit={true}
  
        />
        <View style={{marginVertical:50}}>
        <Button 
          
          title='Buscar Carona'
          color={'#cd5c5c'}
          onPress={()=>navigation.navigate('Buscando_Carona')}
        />
        </View>
        </View>
      </SafeAreaView>
    );
}

