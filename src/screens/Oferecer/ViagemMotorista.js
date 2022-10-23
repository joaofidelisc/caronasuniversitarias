import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            // 'joao, guilherme, maria, felipe'
            // ['joao', ...]
            //['joao', ''];

            listaCaronistasAbordo = snapshot.val().caronistasAbordo;
            arrayUIDsCaronistas = listaCaronistasAbordo.split(', ');
            console.log('arrayUIDS:', arrayUIDsCaronistas);
            console.log('caronistas a bordo:', listaCaronistasAbordo);
            arrayUIDsCaronistas.forEach(async uid=>{
              console.log('uid::::::::', uid);
              if (uid != ''){
                setNumPassageirosABordo(numPassageirosABordo+1);
              }
              setPassageirosABordo([...passageirosABordo, {
                uid: uid,
                url: await getFotoPassageiro(uid),
                nome: await getNomePassageiro(uid),
                // destino: await getDestinoPassageiro(uid),
                destino: 'TESTE',
                classificacao: await getClassificacaoPassageiro(uid)
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

    //exibir a classificação do passageiro ao oferecer carona!!!!!!!!!!!!!!!!!1111
    const getClassificacaoPassageiro = async(uidPassageiro)=>{
      let classificacaoAtual = 0;
      const reference_passageiro = firestore().collection('Users').doc(uidPassageiro);
      try{
        await reference_passageiro.get().then((reference)=>{
          if (reference.exists){
            classificacaoAtual = reference.data().classificacao;
            if (classificacaoAtual == undefined){
              classificacaoAtual = 0;
            }
            return parseFloat(classificacaoAtual.toFixed(2));
          }
        })
      }catch(error){
        console.log('erro em recuperaClassificacaoMotorista');
      }
      return parseFloat(classificacaoAtual.toFixed(2));
    }

    const dataAtualFormatada = async()=>{
      var data = new Date(),
          dia  = data.getDate().toString().padStart(2, '0'),
          mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
          ano  = data.getFullYear();
      return dia+"/"+mes+"/"+ano;
    }

    //por algum motivo tá com problema essa função
    // const escreveHistoricoViagem = async(uidPassageiro)=>{
    //   const data = await dataAtualFormatada();
    //   const reference_passageiro = firestore().collection('Users').doc(uidPassageiro); 
    //   try{
    //     reference_passageiro.update({
    //       historicoViagens: firebase.firestore.FieldValue.arrayUnion({
    //         uidMotorista: currentUser,
    //         dataViagem: data
    //       })
    //     })
    //   }catch(error){
    //     console.log('erro em escreveHistoricoViagem');
    //   }
    // }

    const finalizarViagemPassageiro = async(uidPassageiro)=>{
      // await escreveHistoricoViagem(uidPassageiro);
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
                    <View style={{flexDirection:'row'}}>
                      <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Classificação: {passageiro.classificacao}</Text>
                      <Icon name="star" size={18} color="#06444C" style={{alignSelf:'center', marginLeft: 25}}/>
                    </View>
                    <View style={{flexDirection:'row', alignSelf:'center'}}>
                    <TouchableOpacity
                      style={{backgroundColor: '#FF5F55', width: 180, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10, marginRight: 20}}
                      onPress={()=>{
                        finalizarViagemPassageiro(passageiro.uid);
                        if (numPassageirosABordo == 1){
                          setExistePassageiroABordo(false);
                          navigation.navigate('ClassificarPassageiro', {cidade: cidade, estado: estado, currentUser: currentUser, passageiros: passageirosABordo});
                          console.log('você entregou todos os seus passageiros!');
                        }else{
                          setNumPassageirosABordo(numPassageirosABordo-1);
                        }
                        }
                      }
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
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 10,
    width: '100%'
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