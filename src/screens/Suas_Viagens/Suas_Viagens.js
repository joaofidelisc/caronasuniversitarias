import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import auth from '@react-native-firebase/auth'


const {height, width} = Dimensions.get('screen')

//O motorista tem um histórico de viagem diferente?

function Suas_Viagens() {
    const [arrayHistoricoViagens, setArrayHistoricoViagens] = useState([]);
    const [existeViagem, setExisteViagem] = useState(false);

    const currentUser = auth().currentUser.uid;

    const defineArrayHistoricoViagens = async()=>{
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

    const entrarEmContato = async(uidMotorista)=>{
      console.log('entrando em contato com motorista...');
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
              style={{height:'40%', width: '70%', position: 'absolute', top: '10%', alignSelf: 'center'}}  
              />
            <Text style={{color:'#06444C', position: 'absolute', top:'50%', left: '5%', fontWeight:'700', fontSize: height*0.0225, lineHeight:24}}>Suas viagens futuras{'\n'}aparecerão aqui</Text>
            <Text style={{color: '#C4C4C4', position: 'absolute', top:'63%', left: '5%', fontWeight: '600', fontSize: height*0.017, lineHeight:17}}>
              Encontre a viagem para a sua cidade entre{'\n'}milhares de destinos ou publique sua{'\n'}carona para dividir os custos.
            </Text>
            <Image source={
              require('../../assets/icons/mask-covid.png')} 
              style={{height:'9%', width: '15%', position: 'absolute', top: '78%', left:'5%'}}  
              />
            <Text style={{color: '#06444C', position: 'absolute', top:'80%', left: '20%', fontWeight: '600', fontSize: height*0.016, lineHeight:17}}>
            COVID-19: Seja consciente, siga{'\n'} as orientações da universidade!
            </Text>
            <View style={{position: 'absolute', top: '76%', width:'72%', height: '15%', left:'5%', borderWidth:1}}>
            </View>
            </>
          }
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: height*0.0225, lineHeight:24, textAlign: 'center', marginTop: '10%',}}>Seu histórico de viagens</Text>
          <ScrollView style={[styles.scrollView]}>
          {
            existeViagem &&
            arrayHistoricoViagens.map(viagem=>(
              <View style={styles.viewViagens}
              key={viagem.refViagem}
                  >
                  <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, textAlign: 'center', marginTop: 10}}>{viagem.dataViagem}</Text>
                  <Image 
                    source={{
                      uri: viagem.fotoPerfil
                    }}
                    style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
                  />
                  <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, textAlign:'center', marginTop: 10}}>{viagem.nome}</Text>
                  <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, textAlign:'center', marginTop: 10}}>{viagem.destino}</Text>
                  <TouchableOpacity
                    style={{width: 130, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10}}
                    onPress={()=>{entrarEmContato(viagem.uidMotorista)}}
                  >
                    <Text style={{color: '#FF5F55', fontWeight: '800', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                      Entrar em contato
                    </Text>
                  </TouchableOpacity>
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
    width:'100%'
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
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF5F55'
  }
});

export default Suas_Viagens;