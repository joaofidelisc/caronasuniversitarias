import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions} from 'react-native';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";


const {height, width} = Dimensions.get('screen')

function ViagemEmAndamento({navigation, route}) {
    
    const uidMotorista = route.params?.uidMotorista;
    const currentUser = route.params?.currentUser;
    const cidade = route.params?.cidade;
    const estado = route.params?.estado;
    const nomeMotorista = route.params?.nomeMotorista;
    const veiculoMotorista = route.params?.veiculoMotorista;
    const placaVeiculoMotorista = route.params?.placaVeiculoMotorista;


    const excluiBancoPassageiro = async()=>{
      const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
      try{
        reference_passageiro.remove();
      }catch(error){
        console.log('excluiBancoPassageiro');
      }
    }
    
    //remove o uid do passageiro no banco de motoristas, porque por mais que tenha finalizado a minha viagem
    //as vezes não finalizou a viagem de outro passageiro a bordo.
    const removeUIDCaronista = async()=>{
      let todosCaronistasAbordo = '';
      let arrayCaronistasRestantes = [];
      let caronistasRestantes = '';
      const reference_motorista = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
      try{
        reference_motorista.once('value').then(snapshot=>{
          todosCaronistasAbordo = snapshot.val().caronistasAbordo;
          if (todosCaronistasAbordo != '' && todosCaronistasAbordo.split(', '.length>1)){
            arrayCaronistasRestantes = todosCaronistasAbordo.split(', ');
            if (todosCaronistasAbordo.includes(currentUser)){
              arrayCaronistasRestantes.splice(arrayCaronistasRestantes.indexOf(currentUser), 1);
              caronistasRestantes = arrayCaronistasRestantes.join(', ');
              reference_motorista.update({
                caronistasAbordo: caronistasRestantes
              })
            }
          }
        })
      }catch(error){
        console.log('erro em removeUIDCaronista');
      }
    }

    const dataAtualFormatada = async()=>{
        var data = new Date(),
            dia  = data.getDate().toString().padStart(2, '0'),
            mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
            ano  = data.getFullYear();
        return dia+"/"+mes+"/"+ano;
    }

    const escreveHistoricoViagem = async()=>{
      const data = await dataAtualFormatada();
      const reference_passageiro = firestore().collection('Users').doc(currentUser); 
      try{
        reference_passageiro.update({
          historicoViagens: firebase.firestore.FieldValue.arrayUnion({
            uidMotorista: uidMotorista,
            dataViagem: data
          })
        })
      }catch(error){
        console.log('erro em escreveHistoricoViagem');
      }
    }


    const fimDaViagem = async()=>{
      await excluiBancoPassageiro();
      await removeUIDCaronista();
      await escreveHistoricoViagem();
      await navigateToClassificacao();
    }
    
    const navigateToClassificacao = async()=>{
      navigation.navigate('Classificacao', {uidMotorista: uidMotorista, currentUser: currentUser});
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