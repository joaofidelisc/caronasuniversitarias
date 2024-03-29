import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Lottie from 'lottie-react-native';
import EstadoApp from '../../services/sqlite/EstadoApp';

import serverConfig from '../../../config/config.json';

/*
Ideias para essa tela:
  Aparecer modal com todos os passageiros a bordo;
  Quando o passageiro aperta finalizar viagem, ele desaparece de tela;
  O motorista e o passageiro podem finalizar a viagem;
  Assim que não tiver nenhum passageiro, ir para a tela de classificação;
  
*/

const {height, width} = Dimensions.get('screen');

function ViagemMotorista({route, navigation}) {
  const [atualizouPassageiros, setAtualizouPassageiros] = useState(false);
  const [numPassageirosABordo, setNumPassageirosABordo] = useState(0);
  const [passageirosABordo, setPassageirosABordo] = useState([]);
  const [UIDsPassageiros, setUIDsPassageiros] = useState([]);
  const [UIDsClassificar, setUIDsClassificar] = useState([]); //utilizado na próxima tela;
  const [atualizarNumPassageiros, setAtualizarNumPassageiros] = useState(true);
  const [definiuEstado, setDefiniuEstado] = useState(false);

  const [infoCarregadas, setInfoCarregadas] = useState(false);

  const [cidade, setCidade] = useState(null);
  const [estado, setEstado] = useState(null);

  const currentUser = auth().currentUser.uid;
  // const cidade = route.params?.cidade;
  // const estado = route.params?.estado;
  function carregarInformacoes() {
    if (
      route.params?.cidade == undefined ||
      route.params?.estado == undefined
    ) {
      //buscar do banco
      EstadoApp.findData(1)
        .then(info => {
          console.log(info);
          setCidade(info.cidade);
          setEstado(info.estado);
          setInfoCarregadas(true);
        })
        .catch(err => console.log(err));
    } else {
      console.log('info carregadas por default!');
      setCidade(route.params?.cidade);
      setEstado(route.params?.estado);
      setInfoCarregadas(true);
    }
  }

  async function getDadosPassageiros() {
    let listaPassageiros = '';
    let arrayUIDs = [];
    let jaExiste = false;
    if (jaExiste == true) {
      jaExiste = false;
    }
    const reference = database().ref(
      `${estado}/${cidade}/Motoristas/${currentUser}`,
    );
    try {
      reference.once('value', function (snapshot) {
        if (
          snapshot.exists() &&
          snapshot.val().caronistasAbordo != undefined &&
          snapshot.val().caronistasAbordo != ''
        ) {
          listaPassageiros = snapshot.val().caronistasAbordo;
        }
        arrayUIDs = listaPassageiros.split(', ');
        if (atualizarNumPassageiros) {
          setNumPassageirosABordo(arrayUIDs.length);
          setAtualizarNumPassageiros(false);
          setUIDsPassageiros(arrayUIDs);
        }
        arrayUIDs.forEach(async uid => {
          if (passageirosABordo.length == 0) {
            setPassageirosABordo([
              {
                url: await getFotoPassageiro(uid),
                uid: uid,
                nome: await getNomePassageiro(uid),
                classificacao: await getClassificacaoPassageiro(uid),
                destino: await getDestinoPassageiro(uid),
              },
            ]);
          } else {
            passageirosABordo.some(motorista => {
              if (motorista.uid == uid) {
                jaExiste = true;
              }
            });
            if (!jaExiste) {
              setPassageirosABordo([
                ...passageirosABordo,
                {
                  url: await getFotoPassageiro(uid),
                  uid: uid,
                  nome: await getNomePassageiro(uid),
                  classificacao: await getClassificacaoPassageiro(uid),
                  destino: await getDestinoPassageiro(uid),
                },
              ]);
            }
          }
        });
      });
      setAtualizouPassageiros(true);
    } catch (error) {
      console.log('error.code:', error.code);
    }
    // }
  }

  /*async function getDadosPassageiros(){
      let listaPassageiros = '';
      let arrayUIDs = [];
      let jaExiste = false;
      if (jaExiste == true){
        jaExiste = false;
      }
    
      const url = `${serverConfig.urlRootNode}api/rabbit/obterInfo/passageiro/${estado}/${cidade}/`;
      const eventSource = new EventSource(url);
    
      eventSource.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const snapshot = data.snapshot;
    
        if (snapshot.exists() && snapshot.val().caronistasAbordo != undefined && snapshot.val().caronistasAbordo != ''){
          listaPassageiros = snapshot.val().caronistasAbordo;
        }
        arrayUIDs = listaPassageiros.split(', ');
    
        if (atualizarNumPassageiros){
          setNumPassageirosABordo(arrayUIDs.length);
          setAtualizarNumPassageiros(false);
          setUIDsPassageiros(arrayUIDs);
        }
    
        arrayUIDs.forEach(async uid =>{
          if (passageirosABordo.length == 0){
            setPassageirosABordo([{
              url: await getFotoPassageiro(uid),
              uid: uid,
              nome: await getNomePassageiro(uid),
              classificacao: await getClassificacaoPassageiro(uid),
              destino: await getDestinoPassageiro(uid)
            }])
          }else{
            passageirosABordo.some(motorista=>{
              if (motorista.uid == uid){
                jaExiste = true;
              }
            })
            if (!jaExiste){
              setPassageirosABordo([...passageirosABordo, {
                url: await getFotoPassageiro(uid),
                uid: uid,
                nome: await getNomePassageiro(uid),
                classificacao: await getClassificacaoPassageiro(uid),
                destino: await getDestinoPassageiro(uid) 
              }])
            }
          }
        });
    
        setAtualizouPassageiros(true);
      };
    
      eventSource.onerror = (error) => {
        console.log('error:', error);
      };
    }*/

  /*const getNomePassageiro = async(uidPassageiro)=>{
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
    }*/

  async function getNomePassageiro(uidPassageiro) {
    let nomePassageiro = '';
    const eventSource = new EventSource(
      `${serverConfig.urlRootNode}api/rabbit/obterInfo/passageiro/${estado}/${cidade}/${uidPassageiro}`,
    );
    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      nomePassageiro = data.nome;
      eventSource.close();
    };
    return nomePassageiro;
  }

  const getFotoPassageiro = async uidPassageiro => {
    let caminhoFirebase = uidPassageiro.concat('Perfil');
    let url = '';
    try {
      url = await storage().ref(caminhoFirebase).getDownloadURL();
    } catch (error) {
      if (error.code == 'storage/object-not-found') {
        url = await storage().ref('user_undefined.png').getDownloadURL();
      }
    }
    return url;
  };

  const getDestinoPassageiro = async uidPassageiro => {
    console.log('rodando função getDestinoPassageiro');
    let destino = null;
    let docRef = database().ref(
      `${estado}/${cidade}/Passageiros/${uidPassageiro}`,
    );
    return docRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        if (snapshot.val().nomeDestino != null) {
          destino = snapshot.val().nomeDestino;
          return destino;
        }
      }
      return '';
    });
  };

  /*const getDestinoPassageiro = async(uidPassageiro)=>{
      console.log('rodando função getDestinoPassageiro');
      let destino = null;
      const eventSource = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obterInfo/passageiro/${estado}/${cidade}/${uidPassageiro}`);
    
      return new Promise((resolve, reject) => {
        eventSource.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          if (data.nomeDestino) {
            destino = data.nomeDestino;
            resolve(destino);
          } else {
            resolve('');
          }
        });
    
        eventSource.addEventListener('error', (event) => {
          console.error('Error', event);
          reject();
        });
      });
    }*/

  /*const getDestinoPassageiro = async () => {
      try {
        const events = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obterInfo/passageiro/SP/Sao_Carlos`);
        events.addEventListener('getInfoPassageiro', (event)=>{
        console.log('Atualização informações:\n');
        let objPassageiro = JSON.parse(event.data);
        console.log(objPassageiro.nomeDestino)
        return objPassageiro.nomeDestino;
      })
      }catch (error) {
        console.log('Error', error);
        return '';
      }
    }*/

  //exibir a classificação do passageiro ao oferecer carona!!!!!!!!!!!!!!!!!1111
  /*const getClassificacaoPassageiro = async(uidPassageiro)=>{
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
    }*/

  async function getClassificacaoPassageiro(uidPassageiro) {
    let reqs = await fetch(
      serverConfig.urlRootNode + `buscarUsuario/${uidPassageiro}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      },
    );
    const res = await reqs.json();
    if (res.classificacao == undefined) {
      res.classificacao = 0;
    } else if (res != 'Falha' && res.classificacao != undefined) {
      return parseFloat(res.classificacao.toFixed(2)); //parseF converte string em PF
    }
  }

  const dataAtualFormatada = async () => {
    var data = new Date(),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
      ano = data.getFullYear();
    return dia + '/' + mes + '/' + ano;
  };

  //corrigir lógica aqui!!
  //invés de uidMotorista, colocar uidPassageiro para salvar no banco, na versão motorista!
  //finalizar essa função passando como parametro o nome do passageiro, o url para a foto de perfil, e o destino.
  const escreveHistoricoViagem = async (
    destinoPassageiro,
    nomePassageiro,
    passageiroIMG,
  ) => {
    const data = await dataAtualFormatada();
    const reference_passageiro = firestore()
      .collection('Users')
      .doc(currentUser);
    try {
      reference_passageiro.update({
        historicoViagens: firebase.firestore.FieldValue.arrayUnion({
          uidMotorista: currentUser,
          dataViagem: data,
          nome: nomePassageiro,
          destino: destinoPassageiro,
          fotoPerfil: passageiroIMG,
          refViagem: Date.now(),
        }),
      });
    } catch (error) {
      console.log('erro em escreveHistoricoViagem');
    }
  };

  /*async function escreveHistoricoViagem(destinoPassageiro, nomePassageiro, passageiroIMG){
      const data = await dataAtualFormatada();
      let reqs = await fetch(serverConfig.urlRootNode+`buscarUsuario/${currentUser}`,{
        method: 'GET',
        mode: 'cors',
        headers:{
          'Accept':'application/json',
          'Content-type':'application/json'
        }
      });
      const res = await reqs.json();
      const reference_passageiro = ;
    }*/

  const finalizarViagemPassageiro = async (
    uidPassageiro,
    destinoPassageiro,
    nomePassageiro,
    passageiroIMG,
  ) => {
    setUIDsPassageiros(UIDsPassageiros.filter(uid => uid != uidPassageiro));
    const reference_passageiro = database().ref(
      `${estado}/${cidade}/Passageiros/${uidPassageiro}`,
    );
    //testar aqui se o banco ainda existe
    reference_passageiro.update({
      viagemTerminou: true,
    });
    console.log('num passageiros a bordo:', numPassageirosABordo);
    setPassageirosABordo(
      passageirosABordo.filter(uid => uid.uid != uidPassageiro),
    );
    // await escreveHistoricoViagem(uidPassageiro, destinoPassageiro, nomePassageiro, passageiroIMG);
    await escreveHistoricoViagem(
      destinoPassageiro,
      nomePassageiro,
      passageiroIMG,
    );
    if (numPassageirosABordo == 1) {
      const objString = JSON.stringify(passageirosABordo);
      EstadoApp.updateData({
        uidMotorista: 'att',
        nomeMotorista: 'att',
        veiculoMotorista: 'att',
        placaVeiculoMotorista: 'att',
        motoristaUrl: 'att',
        passageiros: objString,
      });
      navigation.navigate('ClassificarPassageiro', {
        cidade: cidade,
        estado: estado,
        passageiros: passageirosABordo,
        arrayClassificar: UIDsClassificar,
      });
    } else {
      setNumPassageirosABordo(numPassageirosABordo - 1);
    }
  };

  function removeListeners() {
    database()
      .ref(`${estado}/${cidade}/Motoristas/${currentUser}`)
      .onDisconnect()
      .cancel();
    database()
      .ref()
      .child(`${estado}/${cidade}/Passageiros`)
      .off('child_removed');
    database()
      .ref(`${estado}/${cidade}/Motoristas/${currentUser}/caronasAceitas`)
      .off('value');
    database()
      .ref(`${estado}/${cidade}/Passageiros/${currentUser}`)
      .off('child_added');
    database().ref().child(`${estado}/${cidade}/Passageiros`).off('value');
  }

  useEffect(() => {
    const defineEstadoAtual = async () => {
      await AsyncStorage.removeItem('Oferecer');
      await AsyncStorage.setItem('ViagemMotorista', 'true');
    };
    if (!definiuEstado) {
      defineEstadoAtual().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (infoCarregadas) {
      removeListeners();
    } else {
      carregarInformacoes();
    }
  }, [infoCarregadas]);

  useEffect(() => {
    if (infoCarregadas) {
      getDadosPassageiros();
    } else {
      carregarInformacoes();
    }
  }, [passageirosABordo, infoCarregadas]);

  // useEffect(()=>{
  //   console.log('teste!!!!');
  //   console.log('Passageiros a bordo:', passageirosABordo);
  //   console.log('tentando converter obj para string:');
  //   const objString = JSON.stringify(passageirosABordo);
  //   console.log('objString:', objString);

  //   const objJSON = JSON.parse(objString);
  //   console.log('objJSON:', objJSON);
  // })

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          height: '100%',
        }}>
        <Text
          style={{
            fontSize: height * 0.025,
            color: '#2f4f4f',
            fontWeight: 'bold',
            marginTop: '5%',
            marginBottom: 30,
          }}>
          Finalização da viagem{' '}
          <Icon name="car" size={18} color="#06444C">
            {' '}
          </Icon>
        </Text>
        {/* <Lottie 
            style={{height:height*0.31, width:width*0.20}}
            source={require('../../assets/JSON/passageiro3.json')} 
            autoPlay 
            autoSize={false}
            loop = {true}
            speed = {1.1}
        /> */}
        <Text
          style={{
            fontSize: height * 0.025,
            color: '#2f4f4f',
            fontWeight: 'bold',
            marginTop: '5%',
            marginBottom: 30,
          }}>
          Passageiros(as) a bordo...
        </Text>
        {/* <Text style={{fontSize:20, color:'#2f4f4f', paddingHorizontal:70, fontWeight:'600', marginTop: 30, marginBottom: 30}}>Ao finalizar a viagem de todos os passageiros(as), você será redirecionado(a) para a tela de classificação</Text> */}

        {!atualizouPassageiros && (
          <>
            <Text
              style={{
                color: '#06444C',
                position: 'absolute',
                top: 100,
                left: 24,
                fontWeight: '600',
                fontSize: 18,
                lineHeight: 24,
                textAlign: 'left',
              }}>
              Viagem do motorista em andamento...
            </Text>
            <Image
              source={require('../../assets/images/message.png')}
              style={{
                height: 350,
                width: 350,
                position: 'absolute',
                top: 220,
                alignSelf: 'center',
              }}
            />
          </>
        )}
        {
          <ScrollView style={styles.scrollView}>
            {passageirosABordo.map(passageiro =>
              UIDsPassageiros.includes(passageiro.uid) ? (
                <View style={styles.viewPassageiros} key={passageiro.uid}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '1%',
                    }}>
                    <Image
                      source={{
                        uri: passageiro.url,
                      }}
                      style={{
                        height: height * 0.05,
                        width: height * 0.05,
                        borderRadius: 100,
                        marginBottom: height * 0.01,
                        marginTop: '5%',
                        marginLeft: '5%',
                      }}
                    />
                    <Text
                      style={{
                        color: '#06444C',
                        fontWeight: '600',
                        fontSize: height * 0.02,
                        marginLeft: 10,
                      }}>
                      {passageiro.nome}
                    </Text>
                    <Text
                      style={{
                        color: '#06444C',
                        left: '30%',
                        fontWeight: '600',
                        fontSize: height * 0.02,
                      }}>
                      {passageiro.classificacao}
                    </Text>
                    <Icon
                      name="star"
                      size={18}
                      color="#06444C"
                      style={{alignSelf: 'center', marginLeft: '10%'}}
                    />
                  </View>
                  <Text
                    style={{
                      color: '#06444C',
                      fontWeight: '600',
                      fontSize: height * 0.017,
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    {passageiro.destino}
                  </Text>
                  <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#FF5F55',
                        width: '65%',
                        height: '50%',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderRadius: 15,
                        justifyContent: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        finalizarViagemPassageiro(
                          passageiro.uid,
                          passageiro.destino,
                          passageiro.nome,
                          passageiro.url,
                        );
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: height * 0.019,
                          lineHeight: 24,
                          textAlign: 'center',
                        }}>
                        Finalizar viagem
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null,
            )}
          </ScrollView>
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 10,
    width: '100%',
    height: '100%',
  },
  viewPassageiros: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    height: height * 0.22,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF5F55',
  },
});

export default ViagemMotorista;
