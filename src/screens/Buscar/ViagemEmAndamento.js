import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions, Modal, StyleSheet} from 'react-native';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";


const {height, width} = Dimensions.get('screen')

function ViagemEmAndamento({navigation, route}) {
    
    const [modalVisible, setModalVisible] = useState(false);

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
      escreveHistoricoViagem();
      navigateToClassificacao();
      // await removeUIDCaronista();
    }
    
    const navigateToClassificacao = async()=>{
      navigation.navigate('Classificacao', {uidMotorista: uidMotorista, currentUser: currentUser, cidade: cidade, estado: estado});
    }

    const entrarEmContatoMotorista = async()=>{
      console.log('entrando em contato com o motorista...');
    }

    useEffect(()=>{

    }, []);


    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
        <Image source={
              require('../../assets/images/viagem-em-andamento.png')} 
              style={{height:300, width: width }}  
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 280, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                <Text style={{color:'#06444C', fontWeight:'700', fontSize: 20, lineHeight:24}}>Viagem em andamento...</Text>
                <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, lineHeight:24, marginTop: 18}}>Motorista: {nomeMotorista}</Text>
                <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, lineHeight:24, marginTop: 6}}>Veículo: {veiculoMotorista}</Text>
                <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, lineHeight:24, marginTop: 6}}>Placa: {placaVeiculoMotorista}</Text>
                <Text style={{color:'#06444C', fontWeight:'700', fontSize: 20, lineHeight:24, marginTop: 18}}>Com problemas?</Text>
                <TouchableOpacity
                  style={{ width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 6}}
                  onPress={entrarEmContatoMotorista}
                >
                  <Text style={{color: '#FF5F55', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
                    Entre em contato com o(a) motorista
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{backgroundColor: '#FF5F55', width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 18}}
                  onPress={fimDaViagem}
                >
                  <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
                    Confirmar fim da viagem
                  </Text>
                  {/* Esse botão de fechar modal não vai ter, só coloquei porque tava dando bug ao renderizar a tela de Oferecer.js */}
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={{backgroundColor: '#FF5F55', width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 18}}
                    onPress={()=>{
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
                      Fechar modal
                    </Text>
                  </TouchableOpacity> */}

                  {/* {
                    oferecerMaisCaronas && exibeModalOferecer &&
                    <>
                      <Image 
                        source={imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                      />
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
                      <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                          onPress={()=>{oferecerCarona()}}
                      >
                          <Text style={styles.textStyle}>Oferecer carona</Text>
                      </TouchableOpacity>
                     <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                          onPress={() => {
                            setModalVisible(!modalVisible)}}
                      >
                        <Text style={styles.textStyle}>Cancelar</Text>
                    </TouchableOpacity>
                    </>
                  }
                  {
                    !oferecerMaisCaronas && alertaVagas &&
                    <>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '700'}}>Você atingiu o número máximo de caronistas!</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>
                        Para buscar um(a) passageiro(a), pressione uma vez no ícone em verde e clique em buscar passageiro(a).
                      </Text>
                      <TouchableOpacity
                            style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                            onPress={() => {
                              setModalVisible(!modalVisible);
                              setAlertaVagas(!alertaVagas);
                            }}
                        >
                          <Text style={styles.textStyle}>Entendi</Text>
                      </TouchableOpacity>
                    </>
                  }
                  {
                    !exibeModalOferecer &&
                    <>
                      <Image 
                        source={imageUser!=''?{uri:imageUser}:null}
                        style={{height:70, width: 70, borderRadius: 100, marginBottom:10}}  
                      />
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>{nomeCaronista}</Text>
                      <Text style={{color: '#06444C', textAlign: 'center', marginBottom: 10, fontWeight: '500'}}>Destino: {nomeDestinoCaronista}</Text>
                      <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                          onPress={()=>{rotaPassageiro(latitudePassageiro, longitudePassageiro, nomeCaronista, uidPassageiro)}}
                      >
                          <Text style={styles.textStyle}>Buscar passageiro(a)</Text>
                      </TouchableOpacity>
                    <TouchableOpacity
                          style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center', marginTop: 15}}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                          }}
                      >
                        <Text style={styles.textStyle}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                  }   */}
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.03}}
            onPress={()=>{
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Abrir modal
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#FF5F55",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10
  },
});


export default ViagemEmAndamento;