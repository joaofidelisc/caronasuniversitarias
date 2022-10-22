import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
/*
Ideias para essa tela:
  Aparecer modal com todos os passageiros a bordo;
  Quando o passageiro aperta finalizar viagem, ele desaparece de tela;
  O motorista e o passageiro podem finalizar a viagem;
  Assim que não tiver nenhum passageiro, ir para a tela de classificação;
  
*/


function ViagemMotorista({route, navigation}){
    const [passageirosABordo, setPassageirosABordo] = useState([]);
    const [atualizouPassageiros, setAtualizouPassageiros] = useState(false);
    const [numPassageirosABordo, setNumPassageirosABordo] = useState(0);
    const [existePassageiroABordo, setExistePassageiroABordo] = useState(false);

    const currentUser = auth().currentUser.uid;
    const cidade = route.params?.cidade;
    const estado = route.params?.estado;


    const getDadosPassageiros = async()=>{
      let listaCaronistasAbordo = '';
      let arrayUIDsCaronistas = [];

      const reference = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
      if (!atualizouPassageiros){
        try{
          reference.once('value').then(function(snapshot){
            listaCaronistasAbordo = snapshot.val().caronistasAbordo;
            arrayUIDsCaronistas = listaCaronistasAbordo.split(', ');
            console.log('arrayUIDS:', arrayUIDsCaronistas);
            console.log('caronistas a bordo:', listaCaronistasAbordo);
            arrayUIDsCaronistas.forEach(async uid=>{
              setNumPassageirosABordo(numPassageirosABordo+1);
              setPassageirosABordo([...passageirosABordo, {
                uid: uid,
                url: await getFotoPassageiro(uid),
                nome: await getNomePassageiro(uid),
                // destino: await getDestinoPassageiro(uid),
                destino: 'TESTE',
                classificacao: 5
              }])
            })
            setAtualizouPassageiros(true);
          })
        }catch(error){
          console.log('erro em getDadosPassageiro');
        }
      }
      console.log('passageiros:', passageirosABordo);
    }

    const getNomePassageiro = async(uidPassageiro)=>{
      let nomePassageiro = '';
      let docRef = firestore().collection('Users').doc(uidPassageiro);
      return docRef.get().then((doc)=>{
        if (doc.exists){
          nomePassageiro = doc.data().nome;
          return nomePassageiro;
        }else{
          return '';
        }
      })
    }

    const getFotoPassageiro = async(uidPassageiro)=>{
      let caminhoFirebase = uidPassageiro.concat('Perfil');    
      let url = '';
      try{
        url = await storage().ref(caminhoFirebase).getDownloadURL();
      } catch (error){
        if (error.code == 'storage/object-not-found'){
          url = await storage().ref('user_undefined.png').getDownloadURL(); 
        }
      }
     return url;
    }

    const getDestinoPassageiro = async(uidPassageiro)=>{
      let destino = '';
      try{
        database().ref(`${estado}/${cidade}/Passageiros/${uidPassageiro}`).once('value').then(snapshot=>{
          destino = snapshot.val().nomeDestino;
          return destino;
        })
      }catch(error){
        console.log(error.code);
      }
      return destino;
    }

    const finalizarViagemPassageiro = async(uidPassageiro)=>{
      console.log('numero de passageiros a bordo:', numPassageirosABordo);
      console.log('finalizando viagem do passageiro...');
    }

    useEffect(()=>{
      getDadosPassageiros();
    }, [numPassageirosABordo])


    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          {
            !atualizouPassageiros &&
            <>
            <Text style={{color:'#06444C', position: 'absolute', top:100, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Viagem do motorista em andamento...</Text>
            <Image source={
              require('../../assets/images/message.png')} 
              style={{height:350, width: 350, position: 'absolute', top: 220, alignSelf: 'center'}}  
              />
            </>
          }
          {
            atualizouPassageiros &&
            <ScrollView style={[styles.scrollView,{top:0}]}>
            {
              passageirosABordo.map(passageiro=>(
                <View style={styles.viewPassageiros}
                    key={passageiro.uid}
                    >
                    <Image 
                      source={{
                        uri: passageiro.url
                      }}
                      style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
                    />
                    <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Nome: {passageiro.nome}</Text>
                    <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Destino: {passageiro.destino}</Text>
                    <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Classificação: {passageiro.classificacao}</Text>
                    <View style={{flexDirection:'row', alignSelf:'center'}}>
                    <TouchableOpacity
                      style={{backgroundColor: '#FF5F55', width: 180, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10, marginRight: 20}}
                      onPress={()=>{
                        if (numPassageirosABordo == 1){
                          setExistePassageiroABordo(false);
                          navigation.navigate('ClassificarPassageiro', {cidade: cidade, estado: estado, currentUser: currentUser, passageiros: passageirosABordo});
                          console.log('você entregou todos os seus passageiros!');
                        }else{
                          setNumPassageirosABordo(numPassageirosABordo-1);
                        }
                        finalizarViagemPassageiro(passageiro.uid)}
                      }
                      // onPress={()=>{aceitarCarona(motorista.uid, motorista.nome, motorista.carro, motorista.placa)}}
                    >
                      <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                        Finalizar viagem
                      </Text>
                    </TouchableOpacity>
                    </View>
                  </View>
              ))
            }
              <Text style={styles.text}>
              
              {'\n\n\n\n'}
              {'\n\n\n\n\n'}
              </Text>
            </ScrollView>
          }
          {/* <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 240, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', position: 'absolute', bottom: 50}}
            onPress={()=>{
              getDadosPassageiros();
            }}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
              Teste banco
            </Text>
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 10,
  },
  text: {
    fontSize: 42,
  },
  viewPassageiros:{
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

export default ViagemMotorista;