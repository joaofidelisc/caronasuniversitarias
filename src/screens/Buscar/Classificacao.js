import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth'

import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import estilos from '../../estilos/estilos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import Lottie from 'lottie-react-native';
import EstadoApp from '../../services/sqlite/EstadoApp';


const {height,width} = Dimensions.get('screen')

function Classificacao({navigation, route}){
    const [descricaoViagem, setDescricaoViagem] = useState('');
    const [defaultRating, setDefaultRating] = useState(2); 
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);


    const [infoCarregadas, setInfoCarregadas] = useState(false);
    const [cidade, setCidade] = useState(null);
    const [estado, setEstado] = useState(null);
    const [uidMotorista, setUidMotorista] = useState(null);
    
    const currentUser = auth().currentUser.uid;
    
    // const uidMotorista = route.params?.uidMotorista;
    // const currentUser = route.params?.currentUser;
    // const cidade = route.params?.cidade;
    // const estado = route.params?.estado;

    function carregarInformacoes(){
      if (route.params?.cidade == undefined || route.params?.estado == undefined){
        //buscar do banco
        EstadoApp.findData(1).then(
          info => {
            console.log(info)
            setCidade(info.cidade);
            setEstado(info.estado);
            setUidMotorista(info.uidMotorista);
            setInfoCarregadas(true);
          }
        ).catch(err=> console.log(err));
      }else{
        console.log('info carregadas por default!');
        setCidade(route.params?.cidade);
        setEstado(route.params?.estado);
        setUidMotorista(route.params?.uidMotorista);
        setInfoCarregadas(true);
      }
    }

    function CustomRatingBar() {
      return (
        <View style={estilos.CustomRatingBarStyle}>
          {
            maxRating.map((item, key) => {
              return(
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={item}
                  onPress={() => {
                    console.log('defaultRating:', defaultRating);
                    setDefaultRating(item);
                  }}
                >
                  <Image
                    style={estilos.StarImgStyle}
                    source={
                      item <= defaultRating
                      ?require('../../assets/icons/star_filled.png')
                      :require('../../assets/icons/star_corner.png')
                    }
                  />
                </TouchableOpacity>
              );
            })
          }
        </View>
      );
    }

    const classificarMotorista = async()=>{
      let numViagens = 0;
      let classificacaoAtual = 0;
      const reference_motorista = firestore().collection('Users').doc(uidMotorista);
      try{
        reference_motorista.get().then((reference)=>{
          if (reference.exists){
            numViagens = reference.data().numViagensRealizadas;
            classificacaoAtual = reference.data().classificacao;
            if (numViagens != undefined && classificacaoAtual != undefined){
              reference_motorista.update({
                classificacao: (defaultRating+classificacaoAtual)/2,
                numViagensRealizadas: numViagens+1
              })
            }else{
              reference_motorista.update({
                classificacao: defaultRating,
                numViagensRealizadas: 1
              })
            }
          }
        })
        await navigateToBuscar();
      }catch(error){
        console.log('erro em getClassificacao');
      }
    }

    
    const navigateToBuscar = async()=>{
      await AsyncStorage.removeItem('Classificacao');
      navigation.navigate('Buscar')
    }

    const excluiBancoPassageiro = async()=>{
      const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
      try{
        reference_passageiro.remove();
      }catch(error){
        console.log('excluiBancoPassageiro');
      }
    }

    useEffect(()=>{
      console.log('largura:', width);
      console.log('altura:', height);
      if (infoCarregadas){
        excluiBancoPassageiro();
      }else{
        console.log('é necessário carregar as informações');
        carregarInformacoes();
      }
    }, [infoCarregadas]);


    useEffect(()=>{
      const defineEstadoAtual = async()=>{
        await AsyncStorage.removeItem('ViagemEmAndamento');
        await AsyncStorage.setItem('Classificacao', 'true');
      }
      defineEstadoAtual().catch(console.error);
    }, [])

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: height*0.03, lineHeight:29, top: '5%',textDecorationLine:'underline'}}>Como foi sua viagem?</Text>
          <Text style={{color:'#C4C4C4', fontWeight:'600', fontSize: height*0.018, lineHeight:20, marginTop: '15%', width:'75%', textAlign: 'center', top:'0%'}}>Feedback sobre como foi sua experiência durante a viagem.</Text>
          <TextInput
              style={{width: '75%', height: '10%', borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: height*0.018, borderWidth: 2, color:'black',marginTop:'5%'}}
              placeholderTextColor='gray'
              placeholder='Digite aqui sua avaliação...'
              keyboardType='default'
              onChangeText={(descricaoViagem)=>setDescricaoViagem(descricaoViagem)}
          />
          <Lottie 
                    style={{height:height*0.5, width:width, top:'7%', alignSelf:'center', position:'absolute', }}
                    source={require('../../assets/JSON/star.json')} 
                    autoPlay 
                    autoSize={false}
                    loop = {true}
                    speed = {1}
          />
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: height*0.028, lineHeight:29, marginTop: '35%'}}>Classifique o(a) motorista</Text>
          {
            maxRating.map((item, key) => {
              <TouchableOpacity
                  activeOpacity={0.7}
                  key={item}
                  onPress={() => setDefaultRating(item)}
                >
                  <Image
                    style={estilos.StarImgStyle}
                    source={
                      item <= defaultRating
                      ?require('../../assets/icons/star_filled.png')
                      :require('../../assets/icons/star_corner.png')
                    }
                  />
                </TouchableOpacity>
            })
          }
          <CustomRatingBar/>
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: '70%', height: '6%', alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', top:'15%'}}
            onPress={classificarMotorista}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: height*0.02, lineHeight: 24, textAlign: 'center'}}>
              Finalizar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default Classificacao;



  

      