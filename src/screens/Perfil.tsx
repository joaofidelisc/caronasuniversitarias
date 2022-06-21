import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, StyleSheet, SafeAreaView } from 'react-native';

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
  // console.log('Perfil Token', token);

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
        <Image source={{uri: profile.picture}}
        style={styles.imgPerfil}/>
        <Text style={styles.textoUsuario}>{profile.name}</Text>
      </View>
      <Text style={styles.confirmacao}>
        Confirme seus dados
      </Text>
      <Text>
        Email:{profile.email}
      </Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles= StyleSheet.create({
  retangulo:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 473,
    backgroundColor: '#FF5F55',
  },
  imgPerfil:{
    position: 'absolute',
    width: 63,
    height: 63,
    left: 148,
    top: 51,
    borderRadius: 100,
  },
  textoUsuario:{
    position: 'absolute',
    height: 12,
    top: 120,
    left: 130,
    fontWeight: '800',
    fontSize: 10,
    lineHeight: 12,
    color: '#FFFFFF',
  },
  confirmacao:{
    position: 'absolute',
    left: 25,
    right: 168,
    top: 175,
    bottom: 447,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 18,
    color: '#06444C'
  }
});