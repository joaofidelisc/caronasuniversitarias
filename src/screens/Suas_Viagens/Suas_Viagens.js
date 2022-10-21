import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, StyleSheet, Dimensions, ScrollView} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import auth from '@react-native-firebase/auth'


const {height, width} = Dimensions.get('screen')


function Suas_Viagens() {
    const [arrayHistoricoViagens, setArrayHistoricoViagens] = useState([]);
    const [existeViagem, setExisteViagem] = useState(false);

    const currentUser = auth().currentUser.uid;

    const defineArrayHistoricoViagens = async()=>{
      console.log('teste vetor...');
      let historicoViagens = []
      let reference = firestore().collection('Users').doc(currentUser);
      try{
        reference.onSnapshot(documentSnapshot=>{
          historicoViagens = documentSnapshot.data().historicoViagens;
          if (historicoViagens != undefined){
            setArrayHistoricoViagens(historicoViagens);
            setExisteViagem(true);
          }
        })
      }catch(error){
        console.log('erro em testeVetor');
      }
    }

    useEffect(()=>{
      defineArrayHistoricoViagens();
    }, [])


    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          {
            !existeViagem &&
            <>
            <Image source={
              require('../../assets/images/viagens-futuras.png')} 
              style={{height:300, width: 300, position: 'absolute', top: 80, alignSelf: 'center'}}  
              />
            <Text style={{color:'#06444C', position: 'absolute', top:380, left: 24, fontWeight:'700', fontSize: 20, lineHeight:24}}>Suas viagens futuras{'\n'}aparecerão aqui</Text>
            <Text style={{color: '#C4C4C4', position: 'absolute', top:470, left: 24, fontWeight: '600', fontSize: 14, lineHeight:17}}>
              Encontre a viagem para a sua cidade entre{'\n'}milhares de destinos ou publique sua{'\n'}carona para dividir os custos.
            </Text>
            <Image source={
              require('../../assets/icons/mask-covid.png')} 
              style={{height:60, width: 60, position: 'absolute', top: 582, left:24}}  
              />
            <Text style={{color: '#06444C', position: 'absolute', top:598, left: 84, fontWeight: '600', fontSize: 14, lineHeight:17}}>
            COVID-19: Seja consciente, siga{'\n'} as orientações da universidade!
            </Text>
            <View style={{position: 'absolute', top: 562, width:300, height: 100, left:24, borderWidth:1}}>
            </View>
            </>
          }
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: 20, lineHeight:24, textAlign: 'center', marginTop: 50, marginBottom: 25}}>Seu histórico de viagens</Text>
          <ScrollView style={[styles.scrollView]}>
          {
            existeViagem &&
            arrayHistoricoViagens.map(viagem=>(
              <View style={styles.viewViagens}
              // key={motorista.uid}
                  >
                  {/* <Image 
                    source={{
                      uri: motorista.url
                    }}
                    style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
                  /> */}
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Data Viagem: {viagem.dataViagem}</Text>
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>UID motorista: {viagem.uidMotorista}</Text>
                  <View style={{flexDirection:'row', alignSelf:'center'}}>
                  </View>
                </View>
            ))
          }
          </ScrollView>
        </View>
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 10,
  },
  viewViagens:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 330, 
    height: 250, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    alignSelf:'center', 
    marginTop: 10
  }
});

export default Suas_Viagens;