import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';


const {width, height} = Dimensions.get('screen');

function ClassificarPassageiro({route, navigation}) {
    const [descricaoViagem, setDescricaoViagem] = useState('');
    const [defaultRating, setDefaultRating] = useState(2); 
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
    const [passageirosAvaliados, setPassageirosAvaliados] = useState([]);

    const passageiros = route.params?.passageiros;
    const currentUser = route.params?.currentUser;
    const cidade = route.params?.cidade;
    const estado = route.params?.estado;

    
    const classificarPassageiro = async(uidPassageiro)=>{
      setPassageirosAvaliados([...passageirosAvaliados, uidPassageiro]);
      let numViagens = 0;
      let classificacaoAtual = 0;
      const reference_passageiro = firestore().collection('Users').doc(uidPassageiro);
      try{
        reference_passageiro.get().then((reference)=>{
          if (reference.exists){
            numViagens = reference.data().numViagensRealizadas;
            classificacaoAtual = reference.data().classificacao;
            if (numViagens != undefined && classificacaoAtual != undefined){
              reference_passageiro.update({
                classificacao: (defaultRating+classificacaoAtual)/2,
                numViagensRealizadas: numViagens+1
              })
            }else{
              reference_passageiro.update({
                classificacao: defaultRating,
                numViagensRealizadas: 1
              })
            }
          }
        })
      }catch(error){
        console.log('erro em getClassificacao');
      }
    }

    const excluiBancoMotorista = async()=>{
      const reference_motorista = database().ref(`${estado}/${cidade}/Motoristas/${currentUser}`);
      try{
        reference_motorista.remove();
      }catch(error){
        console.log('excluiBancoPassageiro');
      }
    }
    
 

    const finalizarViagem = async()=>{
      // let arrayPassageiros = []
      // arrayPassageiros = passageiros.split(', ');
      // console.log('teste');
      // console.log('passageiros:', passageiros);
      excluiBancoMotorista();
      navigation.navigate('ConfigurarCarona');
    }

    function CustomRatingBar() {
      return (
        <View style={styles.CustomRatingBarStyle}>
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
                    style={styles.StarImgStyle}
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

    useEffect(()=>{
      console.log('tela classificar passageiros:');
      console.log('passageiros:', passageiros);
    })

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        
        <Text style={{color:'#06444C', fontWeight:'700', fontSize: 20, lineHeight:24, marginTop: 20, marginBottom: 20, alignSelf:'center'}}>Você viajou com o(s) passageiro(s) abaixo.</Text>
          <ScrollView style={styles.scrollView}>
          {
              passageiros.map(passageiro=>(
                !passageirosAvaliados.includes(passageiro.uid)?
                <View style={styles.viewPassageiros}
                key={passageiro.uid}
                >
                    <Image 
                      source={{
                        uri: passageiro.url
                      }}
                      style={{height:70, width: 70, borderRadius: 100, marginBottom:5, alignSelf:'center', marginTop: 8}}  
                      />
                    <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, textAlign:'center'}}>Nome: {passageiro.nome}</Text>
                    <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, textAlign:'center', marginTop: 10}}>Classificação</Text>
                       {
                          maxRating.map((item, key) => {
                            <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            onPress={() => setDefaultRating(item)}
                              >
                                <Image
                                  style={styles.StarImgStyle}
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
                    <View style={{flexDirection:'row', alignSelf:'center'}}>
                    <TouchableOpacity
                      style={{backgroundColor: '#FF5F55', width: 180, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10}}
                      onPress={()=>{classificarPassageiro(passageiro.uid)}}
                      >
                      <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                        Avaliar
                      </Text>
                    </TouchableOpacity>
                    </View>
                  </View>:null
              ))
            }
            </ScrollView>
            <Text style={{color:'#06444C', fontWeight:'700', fontSize: 20, lineHeight:24, alignSelf:'center', marginBottom: 20, marginTop: 180}}>Caso não queira classificar o(s) passageiro(s), finalize a viagem pressionando no botão abaixo.</Text>
            <TouchableOpacity
              style={{backgroundColor: '#FF5F55', width: 240, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: 50}}
              onPress={finalizarViagem}
              >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Finalizar
            </Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: 300,
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
    width: 320, 
    height: 230, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    alignSelf:'center', 
    marginTop: 10,
    borderBottomWidth: 1, 
    borderBottomColor: '#FF5F55'
  },
  CustomRatingBarStyle:{
    justifyContent:'center',
    flexDirection:'row',
    marginTop:5
  },
  StarImgStyle:{
    width:30,
    height:30,
    resizeMode:'cover'
  },
});


export default ClassificarPassageiro;