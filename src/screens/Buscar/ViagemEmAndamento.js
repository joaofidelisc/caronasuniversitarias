import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions, Modal, StyleSheet} from 'react-native';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import firebase from "@react-native-firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import EstadoApp from '../../services/sqlite/EstadoApp';

import serverConfig from '../../../config/config.json';


const {height, width} = Dimensions.get('screen')

function ViagemEmAndamento({navigation, route}) {
    
    const [modalVisible, setModalVisible] = useState(false);


    const [infoCarregadas, setInfoCarregadas] = useState(false);

    const [cidade, setCidade] = useState(null);
    const [estado, setEstado] = useState(null);
    const [nomeMotorista, setNomeMotorista] = useState(null);
    const [veiculoMotorista, setVeiculoMotorista] = useState(null);
    const [placaVeiculoMotorista, setPlacaVeiculoMotorista] = useState(null);
    const [motoristaURL, setMotoristaURL] = useState(null);
    const [nomeDestino, setNomeDestino] = useState(null);
    const [uidMotorista, setUidMotorista] = useState(null);
    const currentUser = auth().currentUser.uid;

    // const uidMotorista = route.params?.uidMotorista;
    // const currentUser = route.params?.currentUser;
    // const cidade = route.params?.cidade; //ok
    // const estado = route.params?.estado; //ok
    // const nomeMotorista = route.params?.nomeMotorista; //ok
    // const veiculoMotorista = route.params?.veiculoMotorista; //ok
    // const placaVeiculoMotorista = route.params?.placaVeiculoMotorista; //ok
    // const motoristaURL = route.params?.motoristaUrl; //OK
    // const nomeDestino = route.params?.nomeDestino; //OK

    //cidade, estado, currentUser, uidMotorista, nomeMotorista, nomeDestino, motoristaURL

    function carregarInformacoes(){
      if (route.params?.cidade == undefined || route.params?.estado == undefined){
        //buscar do banco
        EstadoApp.findData(1).then(
          info => {
            console.log(info)
            setCidade(info.cidade);
            setEstado(info.estado);
            setNomeMotorista(info.nomeMotorista);
            setVeiculoMotorista(info.veiculoMotorista);
            setPlacaVeiculoMotorista(info.placaVeiculoMotorista);
            setMotoristaURL(info.motoristaUrl);
            setNomeDestino(info.nomeDestino);
            setUidMotorista(info.uidMotorista);
            setInfoCarregadas(true);
          }
        ).catch(err=> console.log(err));
      }else{
        console.log('info carregadas por default!');
        setCidade(route.params?.cidade);
        setEstado(route.params?.estado);
        setNomeMotorista(route.params?.nomeMotorista);
        setVeiculoMotorista(route.params?.veiculoMotorista);
        setPlacaVeiculoMotorista(route.params?.placaVeiculoMotorista);
        setMotoristaURL(route.params?.motoristaUrl);
        setNomeDestino(route.params?.nomeDestino);
        setUidMotorista(route.params?.uidMotorista);
        setInfoCarregadas(true);
      }
    }

    const buscaChat = async(secondUser)=>{
      let idChatKey = null;
      try{
        await database().ref().child('chatrooms/').once('value', snapshot=>{
          if (snapshot.exists()){
            snapshot.forEach(idChat=>{
              if (idChat.val().firstUser == currentUser && idChat.val().secondUser == secondUser || idChat.val().firstUser == secondUser && idChat.val().secondUser == currentUser){
                idChatKey = idChat.key;
                return idChatKey;
              }
            })
          }
        })
      }catch(error){
        console.log('erro em buscaChat');
      }
      return idChatKey;
    }

     //ref.push cria um chat com uma chave única
    const newChatroom = (user2)=>{
      const ref = database().ref(`chatrooms/`);
      try{
        ref.push({
          firstUser: currentUser,
          secondUser: user2,
          messages: [],
        })
      }catch(error){
        console.log('erro em newChatRoom');
      }
    }
    
    const viagemTerminou = async()=>{
      const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`); 
      const reference_motorista = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
      try{
        reference_motorista.once('value', function(snapshot){
          if (snapshot.exists()){
            console.log("ainda existe!!!!")
          }else{
            console.log("apagou!");
            fimDaViagem();
          }
        })
      }catch(error){
        console.log(error);
      }
      try{
        reference.on('value', function(snapshot){
          if(snapshot.child('viagemTerminou').exists()){
            if (snapshot.val().viagemTerminou != false && snapshot.val().viagemTerminou != undefined){
              fimDaViagem();
            } 
          }
        })
      } catch(error){
        console.log('Error', error.code);
      }  
    }

    //Versão RABBITMQ
    /*const viagemTerminou = async () => {
      const url_motorista = `http://${rabbitMQHost}/motoristas/${uidMotorista}`;
      const url_passageiro = `http://${rabbitMQHost}/passageiros/${currentUser}`;
      
      try {
        const response_motorista = await fetch(url_motorista);
        const json_motorista = await response_motorista.json();
        if (!json_motorista) {
          console.log("apagou!");
          fimDaViagem();
          return;
        }
      } catch (error) {
        console.log(error);
      }
    
      try {
        const response_passageiro = await fetch(url_passageiro);
        const json_passageiro = await response_passageiro.json();
        if (json_passageiro.viagemTerminou) {
          fimDaViagem();
        }
      } catch (error) {
        console.log('Error', error.code);
      }
    }*/
    

    /*const viagemTerminou = async()=>{
      try {
        const events_motorista = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obterInfo/motorista/${estado}/${cidade}`);
        events_motorista.addEventListener('getInfoMotorista', (event)=>{
          console.log('Atualização informações motorista:\n');
          let objMotorista = JSON.parse(event.data);
          if (!objMotorista) {
            console.log("apagou!");
            fimDaViagem();
          } else {
            console.log("ainda existe!!!!");
          }
        });
      
        const events_passageiro = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obterInfo/passageiro/${estado}/${cidade}`);
        events_passageiro.addEventListener('getInfoPassageiro', (event)=>{
          console.log('Atualização informações passageiro:\n');
          let objPassageiro = JSON.parse(event.data);
          if(objPassageiro.viagemTerminou){
            fimDaViagem();
          }
        });
      } catch(error){
        console.log('Error', error.code);
      }  
    };*/
    
    
    // const excluiBancoPassageiro = async()=>{
    //   const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    //   try{
    //     reference_passageiro.remove();
    //   }catch(error){
    //     console.log('excluiBancoPassageiro');
    //   }
    // }
    
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


    //cadastrar viagem;
    //viagem em andamento do passageiro
    // const escreveHistoricoViagem = async()=>{
      // let reqs = await fetch(serverConfig.urlRootNode+'cadastrarViagem',{
      //     method: 'POST',
      //     headers:{
      //       'Accept':'application/json',
      //       'Content-type':'application/json'
      //     },
      //     body: JSON.stringify({
      //       nomeMotorista: 'João Cardozo',
      //       uidPassageiro2: '0VtQXRifF8PdbcKCrthdOtlnah12',
      //       uidMotorista: '0VtQXRifF8PdbcKCrthdOtlnah12',
      //       fotoPerfil: 'linkFoto',
      //       destino: 'UFSCar',
      //       dataViagem: "2023-01-10"
      //     })
      // });

      // let res = await reqs.json();
      // console.log('req:', res);
    
      //buscar a viagem mais recente que linka com o uid do passageiro e atualizar viagem;
      
    // }

    // const escreveHistoricoViagem = async()=>{
    //   const data = await dataAtualFormatada();
    //   const reference_passageiro = firestore().collection('Users').doc(currentUser); 
    //   try{
    //     reference_passageiro.update({
    //       historicoViagens: firebase.firestore.FieldValue.arrayUnion({
    //         uidMotorista: uidMotorista,
    //         dataViagem: data,
    //         nome: nomeMotorista,
    //         destino: nomeDestino,
    //         fotoPerfil: motoristaURL,
    //         refViagem: Date.now()
    //       })
    //     })
    //   }catch(error){
    //     console.log('erro em escreveHistoricoViagem');
    //   }
    // }

    
  // async function defineEstadoAtual(){
  //   await AsyncStorage.removeItem('ViagemEmAndamento');
  //   await AsyncStorage.setItem('Classificacao', true);
  // }

  const retornaIdUltimaViagem = async()=>{
    console.log('Buscar Viagem');
    let reqs = await fetch(serverConfig.urlRootNode+`buscarUltimaViagem/${uidMotorista}`,{
        method: 'GET',
        mode: 'cors',
        headers:{
          'Accept':'application/json',
          'Content-type':'application/json'
        }
    });
    const res = await reqs.json();
    return res.idViagem;
  }


  
  const cadastrarViagemPassageiro = async(idViagem)=>{
    console.log('currentUser:', currentUser);
    console.log('idViagem:', idViagem);
    console.log('destino:', nomeDestino);
    let reqs = await fetch(serverConfig.urlRootNode+'cadastrarViagemPassageiro',{
        method: 'POST',
        headers:{
          'Accept':'application/json',
          'Content-type':'application/json'
        },
        body: JSON.stringify({
          userId:currentUser,
          idViagem: idViagem,
          destino:nomeDestino
        })
    });

    let res = await reqs.json();
    console.log('req:', res);
}
  
  const escreveHistoricoViagem = async()=>{
    const idViagem = await retornaIdUltimaViagem(uidMotorista);
    await cadastrarViagemPassageiro(idViagem);
  }

    const fimDaViagem = async()=>{
      // await excluiBancoPassageiro();
      // await defineEstadoAtual();
      escreveHistoricoViagem();
      navigateToClassificacao();
      // await removeUIDCaronista();
    }
    
    const navigateToClassificacao = async()=>{
      navigation.navigate('Classificacao', {uidMotorista: uidMotorista, currentUser: currentUser, cidade: cidade, estado: estado});
    }

    //CORRIGIR BUG AQUI, NÃO É POSSÍVEL NAVEGAR PARA ENTRAR EM CONTATO MOTORISTA
    /*

    The action 'NAVIGATE' with payload {"name":"Mensagens","params":{"ocultarChat":false,"idChat":"-NGwrYODPph157zIdChq"}} was not handled by any navigator.
    Do you have a screen named 'Mensagens'?
    If you're trying to navigate to a screen in a nested navigator, see https://reactnavigation.org/docs/nesting-navigators#navigating-to-a-screen-in-a-nested-navigator.
    This is a development-only warning and won't be shown in production.  

    */
    const entrarEmContatoMotorista = async()=>{
      let idChat = null;
      idChat = await buscaChat(uidMotorista);
      if (idChat == null){
          newChatroom(uidMotorista);
          navigation.navigate('Mensagens');
      }else{
          navigation.navigate('Mensagens', {ocultarChat: false, idChat: idChat});
      }
      setModalVisible(!modalVisible);
    }

    useEffect(()=>{
      const defineEstadoAtual = async()=>{
        await AsyncStorage.removeItem('AguardandoMotorista');
        await AsyncStorage.setItem('ViagemEmAndamento', 'true');
      }
      defineEstadoAtual().catch(console.error);
    }, [])

    useEffect(()=>{
      if (infoCarregadas){
        viagemTerminou(); 
      }else{
        console.log('carregando informações!');
        carregarInformacoes();
      }
    }, [infoCarregadas]);

    useEffect(()=>{
      console.log('---------------------------------------------------------------------');
      console.log('imagem motorista:', motoristaURL);
      console.log('imagem motorista PARAMS VIAGEM MOTORISTA:', route.params?.motoristaUrl);
      console.log('---------------------------------------------------------------------');
    });

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
            <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: height*0.31, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                <Text style={{color:'#06444C', fontWeight:'700', fontSize: 20, lineHeight:24}}>Viagem em andamento...</Text>
                <Image 
                    source={{
                      uri: motoristaURL
                    }}
                    style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
                />
                <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, lineHeight:24, marginTop: 18}}>Motorista: {nomeMotorista}</Text>
                <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, lineHeight:24, marginTop: 6}}>Veículo: {veiculoMotorista}</Text>
                <Text style={{color:'#06444C', fontWeight:'600', fontSize: 18, lineHeight:24, marginTop: 6}}>Placa: {placaVeiculoMotorista}</Text>
                <Text style={{color:'#06444C', fontWeight:'700', fontSize: 20, lineHeight:24, marginTop: 18}}>Ainda não está no carro?</Text>
                <TouchableOpacity
                  style={{ width: width*0.7, height: height*0.05, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: height*0.012}}
                  onPress={entrarEmContatoMotorista}
                >
                  <Text style={{color: '#FF5F55', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
                    Entre em contato com o(a) motorista
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{backgroundColor: '#FF5F55', width: width*0.6, height: height*0.05, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginBottom: height*0.01, marginTop: height*0.018}}
                  onPress={()=>{
                    // fimDaViagem();
                    console.log('finalizando viagem...');
                  }}
                >
                  <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
                    Finalizar viagem
                  </Text>
                </TouchableOpacity>
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
    borderRadius: height*0.04,
    padding: height*0.04,
    height:height*0.5,
    alignItems: "center",
    shadowColor: "#FF5F55",
    shadowOffset: {
      height: height*0.002
    },
    shadowOpacity: 0.05,
    shadowRadius: height*0.03,
    elevation: height*0.01
  },
});


export default ViagemEmAndamento;