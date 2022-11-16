import React, { useState, useEffect, Component } from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';
import Lottie from 'lottie-react-native';

const {height, width} = Dimensions.get('screen')

//O motorista tem um histórico de viagem diferente?

function Suas_Viagens({route, navigation}) {
    const [arrayHistoricoViagens, setArrayHistoricoViagens] = useState([]);
    const [existeViagem, setExisteViagem] = useState(false);
    const [loading, setLoading] = useState(true);
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


  const buscaChat = async(secondUser)=>{
    let idChatKey = null;
    try{
      await database().ref().child('chatrooms/').once('value', snapshot=>{
        if (snapshot.exists()){
          snapshot.forEach(idChat=>{
            if (idChat.val().firstUser == currentUser && idChat.val().secondUser == secondUser || idChat.val().firstUser == secondUser && idChat.val().secondUser == currentUser){
              idChatKey = idChat.key;
              return idChatKey;
            }
          })
        }
      })
    }catch(error){
      console.log('erro em buscaChat');
    }
    return idChatKey;
  }
  
  //ref.push cria um chat com uma chave única
  const newChatroom = (user2)=>{
    const ref = database().ref(`chatrooms/`);
    try{
      ref.push({
        firstUser: currentUser,
        secondUser: user2,
        messages: [],
      })
    }catch(error){
      console.log('erro em newChatRoom');
    }
  }
  
  
  const entrarEmContato = async(uidUserContato)=>{
      let idChat = null;
      idChat = await buscaChat(uidUserContato);
      if (idChat == null){
          newChatroom(uidUserContato);
          navigation.navigate('Mensagens');
        }else{
          navigation.navigate('Mensagens', {ocultarChat: false, idChat: idChat});
        }
    }


    useEffect(()=>{
      setTimeout(()=> setLoading(false), 4000);
      console.log('carregou!');
    },[]);

    useEffect(()=>{
      defineArrayHistoricoViagens();
    }, [])


    

    // useEffect(()=>{
    //   console.log('rodando useEffect do DOM...');
    //   document.addEventListener('DOMContentLoaded', function(event){
    //     console.log('carregou!!!');
    //   })
    // })
    
    



    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          {
          loading &&
          <View style={{alignSelf:'center', marginTop: '60%'}}>
            {/* <Text style={{color:'#06444C', fontWeight:'600', fontSize: 20, lineHeight:24, textAlign:'center'}}>Verificando se existem viagens...</Text> */}
            <Lottie 
              style={{height:height*0.3, width:height*0.3, alignSelf:'center'}}
              source={require('../../assets/JSON/loading_1.json')} 
              autoPlay 
              loop
              speed={0.6} 
            />
          </View>
          }
          {
            !existeViagem && !loading &&
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
          <ScrollView style={[styles.scrollView]}>
          {
            existeViagem && !loading &&
            <Text style={{color:'#06444C', fontWeight:'700', fontSize: height*0.0225, lineHeight:24, textAlign: 'center', marginTop: '10%',}}>Seu histórico de viagens</Text>
          }
          {
            existeViagem && !loading &&
            arrayHistoricoViagens.map(viagem=>(
              <View style={styles.viewViagens}
              key={viagem.refViagem}
                  >
                  <Text style={{color:'#06444C', fontWeight:'600', fontSize: width*0.045, textAlign: 'center', marginTop: 10}}>{viagem.dataViagem}</Text>
                  <Image 
                    source={{
                      uri: viagem.fotoPerfil
                    }}
                    style={{height:width*0.9*0.2, width: width*0.9*0.2, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
                  />
                  <Text style={{color:'#06444C', fontWeight:'600', fontSize: width*0.9*0.06, textAlign:'center', marginTop: 10, marginLeft: width*0.9*0.04, marginRight:width*0.9*0.04}}>{viagem.nome}</Text>
                  <Text style={{color:'#06444C', fontWeight:'600', fontSize: width*0.9*0.038, textAlign:'center', marginTop: 10, marginLeft: width*0.9*0.04, marginRight:width*0.9*0.04}}>{viagem.destino}</Text>
                  <TouchableOpacity
                    style={{width: 130, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10}}
                    onPress={()=>{entrarEmContato(viagem.uidMotorista)}}
                  >
                    <Text style={{color: '#FF5F55', fontWeight: '800', fontSize: width*0.9*0.04, lineHeight: 24, textAlign: 'center'}}>
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
    width: width*0.9, 
    height: height*0.3, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    alignSelf:'center', 
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF5F55'
  }
});

export default Suas_Viagens;