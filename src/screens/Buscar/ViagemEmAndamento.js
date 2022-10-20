import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen')

function ViagemEmAndamento({navigation, route}) {
    
    const uidMotorista = route.params?.uidMotorista;
    const currentUser = route.params?.currentUser;
    const cidade = route.params?.cidade;
    const estado = route.params?.estado;
    const nomeMotorista = route.params?.nomeMotorista;
    const veiculoMotorista = route.params?.veiculoMotorista;
    const placaVeiculoMotorista = route.params?.placaVeiculoMotorista;

    const fimDaViagem = async()=>{
      // o que fazer quando a viagem acaba?
      console.log('acabou a viagem!');
      //escrever no histórico de viagens do passageiro;
      //avaliar o motorista;
      //remover o uid do passageiro de caronistasAbordo;
      //apagar o banco de passageiros (tempo real);
      navigation.navigate('Classificacao', {uidMotorista: uidMotorista, cidade: cidade, estado: estado, currentUser: currentUser});

    }

    useEffect(()=>{

    }, []);


    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Viagem em andamento...</Text>
          <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Motorista: {nomeMotorista}</Text>
          <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Veículo: {veiculoMotorista}</Text>
          <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Placa: {placaVeiculoMotorista}</Text>
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.03}}
            onPress={fimDaViagem}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Confirmar fim da viagem
            </Text>
          </TouchableOpacity>

          {/* <Image source={
            require('../../assets/images/message.png')} 
            style={{height:350, width: 350, position: 'absolute', top: 220, alignSelf: 'center'}}  
          /> */}
        </View>
      </SafeAreaView>
    );
}

export default ViagemEmAndamento;