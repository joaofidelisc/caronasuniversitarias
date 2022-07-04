import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

type Profile = {
  name: string;
  email: string;
  family_name: string;
  given_name: string;
  locale: string;
  picture: string;
}

export default function Perfil({route}) {
  const {token} = route.params;
  const [profile, setProfile] = useState({} as Profile);
  
  async function loadProfile() {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${token}`);
    const userInfo = await response.json();
    setProfile(userInfo);
  }
  useEffect(()=>{
    loadProfile();
  },[]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.retangulo}>
        <Text style={{position: 'absolute', top: 24, left: 26, fontWeight: '700', fontSize: 12, lineHeight: 15, color:'#06444C'}}>Perfil</Text>
        <Image source={{uri: profile.picture}}
        style={styles.imgPerfil}/>
        <Text style={styles.textoUsuario}>{profile.name}</Text>
      </View>
      <Text style={{position: 'absolute', left: 61, top: 141, fontWeight: '800', fontSize: 12, lineHeight: 15, color:'#F9FEFF'}}>
        Detalhes
      </Text>
      <Text style={{position: 'absolute', left: 252, top: 141, fontWeight: '800', fontSize: 12, lineHeight: 15, color:'#F9FEFF'}}>
        Conta
      </Text>
      <Text style={{position: 'absolute', left: 25, top: 175, fontWeight: '700', fontSize: 15, lineHeight: 18, color: '#06444C'}}>
        Confirme seus dados
      </Text>
      <Text style={{position: 'absolute', left: 40, top: 205, fontWeight: '600', fontSize: 12, lineHeight: 15, color:'#06444C'}}>
        Número cadastrado
      </Text>
      <Text style={{position: 'absolute', left: 60, top: 235, fontWeight: '600', fontSize: 12, lineHeight: 15, color:'#FF5F55'}}>
        +XX (XX) XXXXX-XXXX
      </Text>
      <Text style={{position: 'absolute', left: 40, top: 265, fontWeight: '600', fontSize: 12, lineHeight: 15, color:'#06444C'}}>
        Endereço de e-mail
      </Text>
      <Text style={{position: 'absolute', left: 60, top: 295, fontWeight: '600', fontSize: 12, lineHeight: 15, color:'#FF5F55'}}>
        {profile.email}
      </Text>
      <Text style={{position: 'absolute', left: 25, top: 325, fontWeight: '700', fontSize: 15, lineHeight: 18, color:'#06444C'}}>
        Sobre você
      </Text>
      <Text style={{position: 'absolute', left: 40, top: 355, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>
        Universidade/Campus
      </Text>
      <Text style={{position: 'absolute', left: 60, top: 385, fontWeight: '600', fontSize: 12, lineHeight: 15, color:'#FF5F55'}}>
        UFSCar/São Carlos
      </Text>
      <Text style={{position: 'absolute', left: 40, top: 415, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>
        Preferências
      </Text>
      <Text style={{position: 'absolute', left: 60, top: 445, fontWeight: '600', fontSize: 12, lineHeight: 15, color:'#FF5F55'}}>
        Sem preferências
      </Text>
      <Text style={{position: 'absolute', left: 25, top: 475, fontWeight: '600', fontSize: 15, lineHeight: 18, color: '#06444C'}}>
        Carros
      </Text>
      <TouchableOpacity style={{position: 'absolute', width: 133, height: 31, left: 28, top:508, backgroundColor: '#FF5F55', borderRadius: 57, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Adicionar carro +</Text>
      </TouchableOpacity>
      <StatusBar style="light" />
    </View>
  );
}

const styles= StyleSheet.create({
  retangulo:{
    position: 'absolute',
    height: 167,
    left: 0,
    right: 0,
    top: 0,
    bottom: 473,
    backgroundColor: '#FF5F55',
    alignItems: 'center',
  },
  imgPerfil:{
    position: 'absolute',
    width: 63,
    height: 63,
    top: 49,
    borderRadius: 100,
  },
  textoUsuario:{
    position: 'absolute',
    top: 120,
    fontWeight: '800',
    fontSize: 10,
    lineHeight: 12,
    color: '#FFFFFF',
  },
});