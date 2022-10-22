import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
Ideias para essa tela:
  Exibir modal com todos os passageiros que receberam carona;
  Opção de avaliar separadamente os caronistas;
  Ao encerrar, deletar banco de dados do motorista e voltar para a tela de Oferecer.
  Escrever no histórico de viagens do motorista;
*/


function ClassificarPassageiro({route, navigation}) {
    const passageiros = route.params?.passageiros;

    useEffect(()=>{
      console.log('tela classificar passageiros:');
      console.log('passageiros:', passageiros);
    })
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', position: 'absolute', top:100, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Classifique os seus passageiros!.</Text>
          <Image source={
            require('../../assets/images/message.png')} 
            style={{height:350, width: 350, position: 'absolute', top: 220, alignSelf: 'center'}}  
          />
          {/* <Text style={{color:'#06444C', position: 'absolute', top:570, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>
            E aí, o que está esperando?
          </Text>
          <Text style={{color:'#06444C', position: 'absolute', top:610, left: 24, fontWeight:'500', fontSize: 18, lineHeight:24, textAlign: 'center'}}>
            Procure já por uma carona ou ofereça{'\n'} uma para destinos próximos!
          </Text> */}
        </View>
      </SafeAreaView>
    );
}

export default ClassificarPassageiro;