import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, StyleSheet, CameraRoll} from 'react-native';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


function Options({navigation, route}) {

    const [vetorMotoristas, setMotoristas] = useState([]);    

    const currentUser = auth().currentUser.uid;
    
    const cidade = route.params?.cidade;
    const estado = route.params?.estado;
    const nomeDestino = route.params?.nomeDestino;

    /*
    Função responsável por definir o vetor de motoristas e atualizar em tempo real conforme mais caronas forem oferecidas.
    */
    async function getDadosMotorista(){
      let listaCaronas = '';
      let arrayUIDs = [];
      let jaExiste = false;
      if (jaExiste == true){
        jaExiste = false;
      }
      const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
      try{
        reference.on('value', function(snapshot){
          if (snapshot.exists() && snapshot.val().ofertasCaronas != undefined){
            listaCaronas = snapshot.val().ofertasCaronas;
            // console.log('listaCaronasCaronaEncontrada:', listaCaronas);
          }
          arrayUIDs = listaCaronas.split(', ');
          arrayUIDs.forEach(async uid =>{
            if (vetorMotoristas.length == 0){
              setMotoristas([{
                url: await getFotoMotorista(uid),
                uid: uid,
                nome: await getNomeMotorista(uid),
                carro: await getNomeCarroMotorista(uid),
                placa: await getPlacaCarroMotorista(uid),
                classificacao: await getClassificacaoMotorista(uid)
              }])
            }else{
              vetorMotoristas.some(motorista=>{
                if (motorista.uid == uid){
                  jaExiste = true;
                }
              })
              if (!jaExiste){
                setMotoristas([...vetorMotoristas, {
                  url: await getFotoMotorista(uid),
                  uid: uid,
                  nome: await getNomeMotorista(uid),
                  carro: await getNomeCarroMotorista(uid),
                  placa: await getPlacaCarroMotorista(uid),
                  classificacao: await getClassificacaoMotorista(uid)
                }])
              }
            }
          });
        })
      } catch(error){
        console.log('error.code:', error.code);
      }
    }



  //Função responsável por get o nome do motorista e atualizar no vetor;
  async function getNomeMotorista(motoristaUID){
    let nomeMotorista = '';
    let docRef = firestore().collection('Users').doc(motoristaUID);
    return docRef.get().then((doc)=>{
      if (doc.exists){
        nomeMotorista = doc.data().nome;
        return nomeMotorista;
      }else{
        return '';
      }
    })
  }

  //Função responsável por get o nome do carro do motorista
  async function getNomeCarroMotorista(motoristaUID){
    let nomeCarroMotorista = '';
    let docRef = firestore().collection('Users').doc(motoristaUID);
    return docRef.get().then((doc)=>{
      if (doc.exists){
        nomeCarroMotorista = doc.data().nome_veiculo;
        return nomeCarroMotorista;
      }else{
        return '';
      }
    })
  }

  //Função responsável por get a placa do carro do motorista
  async function getPlacaCarroMotorista(motoristaUID){
    let placaCarroMotorista = '';
    let docRef = firestore().collection('Users').doc(motoristaUID);
    return docRef.get().then((doc)=>{
      if (doc.exists){
        placaCarroMotorista = doc.data().placa_veiculo;
        return placaCarroMotorista;
      }else{
        return '';
      }
    })
  }

  const getClassificacaoMotorista = async(motoristaUID)=>{
    let classificacaoAtual = 0;
    const reference_motorista = firestore().collection('Users').doc(motoristaUID);
    try{
      await reference_motorista.get().then((reference)=>{
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


  //Função responsável por receber um UID e retornar a url para a imagem do motorista.
  const getFotoMotorista = async(motoristaUID)=>{
    const uidMotorista = motoristaUID;
    var caminhoFirebase = uidMotorista.concat('Perfil');    
    var url = '';
    try{
      url = await storage().ref(caminhoFirebase).getDownloadURL();
    } catch (error){
      if (error.code == 'storage/object-not-found'){
        url = await storage().ref('user_undefined.png').getDownloadURL(); 
      }
    }
   return url;
  }


  //Função responsável por recusar carona. O ato de recusar carona de um motorista, implica em remover o seu UID do banco de dados e do vetor corrente de motoristas.
  function recusarCarona(motoristaUID){
    let totalOfertas = '';
    let arrayOfertasRestantes = [];
    let ofertasRestantes = '';

    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference_passageiro.once('value').then(snapshot=>{
        if (snapshot.exists() && snapshot.val().ofertasCaronas != undefined){
          totalOfertas = snapshot.val().ofertasCaronas;
        }
        if (totalOfertas != '' || totalOfertas.split(', ').length>1){
          arrayOfertasRestantes = totalOfertas.split(', ');
          if (totalOfertas.includes(motoristaUID)){
            arrayOfertasRestantes.splice(arrayOfertasRestantes.indexOf(motoristaUID), 1);
            ofertasRestantes = arrayOfertasRestantes.join(', ');
            console.log('ofertas restantes:', ofertasRestantes);
            if (ofertasRestantes == ''){
              setMotoristas([]);
              reference_passageiro.off();
              // voltouTela();
              navigation.navigate('Buscando_Carona', {cidade: cidade, estado:estado});
            }
            reference_passageiro.update({
              ofertasCaronas: ofertasRestantes,
            })
            vetorMotoristas.some(motorista=>{
              if (motorista.uid == motoristaUID){
                vetorMotoristas.splice(vetorMotoristas.indexOf(motorista), 1);
              }
            })
          }
        }
      })
    }catch(error){
      console.log('error.code', error.code);
    }
    console.log('Carona recusada!');
  }

  //Função responsável por complementar a função abaixo.
  //Escreve no banco do motorista o UID do passageiro.
  function aceitarCarona_(uidMotorista, nomeMotorista, veiculoMotorista, placaVeiculoMotorista, motoristaURL){
    let listaCaronasAceitas = '';
    const reference_motorista = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
    try{
        reference_motorista.once('value').then(snapshot=>{
          listaCaronasAceitas = snapshot.val().caronasAceitas;
          console.log('CARONAS ACEITAS:', listaCaronasAceitas);
          if (!listaCaronasAceitas.includes(currentUser)){
            if (listaCaronasAceitas == ''){
              listaCaronasAceitas = currentUser;
            }else{
              listaCaronasAceitas = listaCaronasAceitas.concat(', ',currentUser);
            }
          }
          reference_motorista.update({        
            caronasAceitas: listaCaronasAceitas,
          });
        })
    }catch(error){
        console.log('ERRO:', error.code);
    }
    // defineEstadoAtual();
    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    reference_passageiro.off();
    navigation.navigate('AguardandoMotorista', {cidade: cidade, estado: estado, uidMotorista:uidMotorista, currentUser: currentUser, nomeMotorista: nomeMotorista, veiculoMotorista: veiculoMotorista, placaVeiculoMotorista: placaVeiculoMotorista, urlIMG: motoristaURL, nomeDestino: nomeDestino});
  }

  // async function defineEstadoAtual(){
  //   // await AsyncStorage.removeItem('CaronaEncontrada');
  //   // await AsyncStorage.setItem('AguardandoMotorista', true);
  // }
  
  //Função responsável por aceitar carona - escreve no banco do banco do passageiro o uid do motorista e reseta o vetor de ofertas de caronas;
  //Além disso, invoca a função aceitarCarona_ (complementar desta), que é responsável por escrever no banco do motorista o uid do passageiro;
  function aceitarCarona(uidMotorista, nomeMotorista, veiculoMotorista, placaVeiculoMotorista, motoristaURL){
    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference_passageiro.update({        
        caronasAceitas:uidMotorista,
        ofertasCaronas:'',
        viagemTerminou: false,
      });
    }catch(error){
        console.log('ERRO:', error.code);
    }
    aceitarCarona_(uidMotorista, nomeMotorista, veiculoMotorista, placaVeiculoMotorista, motoristaURL);
  }

  // const voltouTela = async()=>{
  //   await AsyncStorage.removeItem('CaronaEncontrada');
  // }

  // useEffect(()=>{
  //   const defineEstadoAtual = async()=>{
  //     await AsyncStorage.removeItem('BuscandoCarona');
  //     await AsyncStorage.setItem('CaronaEncontrada', 'true');
  //   }
  //   defineEstadoAtual().catch(console.error);
  // }, [])
  
  useEffect(()=>{
    getDadosMotorista();
  }, [vetorMotoristas]);

    return (
       <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} />
          <Image source={
              require('../../assets/images/carona-encontrada.png')} 
              style={{height:450, width: 450, alignSelf: 'center', top: -80}}  
          />
          <Text style={{color:'#06444C', left: 24, fontWeight:'700', fontSize: 20, lineHeight:24, textAlign:'left', top: -120}}>Carona encontrada!</Text>
          <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 20, lineHeight:24, textAlign:'left', top: -110}}>Motoristas disponíveis:</Text>
   
          <ScrollView style={[styles.scrollView,{top:-100}]}>
          {
            vetorMotoristas.map(motorista=>(
              <View style={styles.viewMotoristas}
                  key={motorista.uid}
                  >
                  <Image 
                    source={{
                      uri: motorista.url
                    }}
                    style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
                  />
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Nome: {motorista.nome}</Text>
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Carro: {motorista.carro}</Text>
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Placa: {motorista.placa}</Text>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Classificação: {motorista.classificacao}</Text>
                    <Icon name="star" size={18} color="#06444C" style={{alignSelf:'center', marginLeft: 25}}/>
                  </View>
                  <View style={{flexDirection:'row', alignSelf:'center'}}>
                  <TouchableOpacity
                    style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10, marginRight: 20}}
                    onPress={()=>{aceitarCarona(motorista.uid, motorista.nome, motorista.carro, motorista.placa, motorista.url)}}
                  >
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                      Aceitar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 10}}
                    onPress={()=>{recusarCarona(motorista.uid)}}
                    >
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                      Recusar
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
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 10,
  },
  viewMotoristas:{
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


export default Options;