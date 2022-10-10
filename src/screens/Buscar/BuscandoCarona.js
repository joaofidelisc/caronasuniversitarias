import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions} from 'react-native';
import Lottie from 'lottie-react-native';


import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {height, width} = Dimensions.get('screen')

function BuscandoCarona({navigation, route}) {
  const localizacaoPassageiro = route.params?.localizacao;
  const destinoPassageiro = route.params?.destino;



  const [encontrouCarona, setEncontrouCarona] = useState('');
  const currentUser = auth().currentUser.uid;

  const recusouCarona = route.params?.recusou;
  const cidade = route.params?.cidade;
  const estado = route.params?.estado;

  function buscarCarona(){
    try{
      database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`).on('value', function(snapshot){
        console.log('Ofertas Caronas:', snapshot.val().ofertasCaronas);
        if (snapshot.val().ofertasCaronas != ''){
          setEncontrouCarona(true);
          console.log('Encontrou carona?:', encontrouCarona);
        } else{
          setEncontrouCarona(false);
        }
      })
    } catch(error){
      console.log('Error', error.code);
    }
  }

  function navigateTo(){
    // console.log('Estado:', estado);
    // console.log('Cidade:', cidade);
    navigation.navigate('Options', {cidade: cidade, estado: estado});
  }


  useEffect(()=>{
    console.log('Tela: BuscandoCarona');
    // console.log(estado);
    // console.log(cidade);
    // console.log('estado+cidade');
    // console.log(estado);
    // console.log(cidade);
    buscarCarona();
  })

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
        <Text style={{positition: 'absolute', fontSize:height*0.03, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10}}>
          Buscando caronas para você. Isso pode levar alguns minutos...
        </Text>
        
        <Lottie 
        style={{height:height*0.5, width:width, marginTop:'5%'}}
        source={require('../../assets/JSON/mapCell.json')} 
        autoPlay 
        loop />

        
        <Text style={{fontSize:height*0.025, color:'#c0c0c0', paddingHorizontal:10, fontWeight:'normal',marginVertical:35 }}>
          Exibiremos uma lista de propostas assim que possível!
        </Text>
        
        {
          encontrouCarona && 
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
            onPress={navigateTo}
            // onPress={getCaronistasMarker}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Exibir lista
            </Text>
          </TouchableOpacity>
        }
      </View>
    </SafeAreaView>
  );
}

export default BuscandoCarona;