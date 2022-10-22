import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import estilos from '../../estilos/estilos';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Classificacao({navigation, route}){
    const [descricaoViagem, setDescricaoViagem] = useState('');
    const [defaultRating, setDefaultRating] = useState(2); 
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

    const uidMotorista = route.params?.uidMotorista;
    const currentUser = route.params?.currentUser;
    const cidade = route.params?.cidade;
    const estado = route.params?.estado;



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
      // await AsyncStorage.removeItem('Classificacao');
      navigation.navigate('Buscar')
    }

    useEffect(()=>{

    }, [defaultRating]);

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: 24, lineHeight:29, top: 52}}>Como foi sua viagem?</Text>
          <Text style={{color:'#C4C4C4', fontWeight:'600', fontSize: 16, lineHeight:20, marginTop: 64, width: 292, textAlign: 'center'}}>Feedback sobre como foi sua experiência durante a viagem.</Text>
          <TextInput
              style={{width: 315, height: 80, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth: 1, color:'black', marginTop: 15}}
              placeholderTextColor='gray'
              placeholder='Digite aqui sua avaliação...'
              keyboardType='default'
              onChangeText={(descricaoViagem)=>setDescricaoViagem(descricaoViagem)}
          />
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: 24, lineHeight:29, marginTop: 52}}>Classifique o(a) motorista</Text>
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
            style={{backgroundColor: '#FF5F55', width: 240, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 100}}
            onPress={classificarMotorista}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Finalizar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default Classificacao;



  

      
