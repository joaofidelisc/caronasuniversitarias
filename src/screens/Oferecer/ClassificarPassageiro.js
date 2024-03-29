import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import Lottie from 'lottie-react-native';
import EstadoApp from '../../services/sqlite/EstadoApp';
import auth from '@react-native-firebase/auth';

// console.log('objString:', objString);

// const objJSON = JSON.parse(objString);
// console.log('objJSON:', objJSON);
import serverConfig from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function ClassificarPassageiro({route, navigation}) {
  const [descricaoViagem, setDescricaoViagem] = useState('');
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [passageirosAvaliados, setPassageirosAvaliados] = useState([]);
  const [definiuEstado, setDefiniuEstado] = useState(false);

  const [infoCarregadas, setInfoCarregadas] = useState(false);
  const [renderizarTela, setRenderizarTela] = useState(false);
  const [cidade, setCidade] = useState(null);
  const [estado, setEstado] = useState(null);
  const [passageiros, setPassageiros] = useState(null);
  const currentUser = auth().currentUser.uid;

  // const passageiros = route.params?.passageiros;
  // const currentUser = route.params?.currentUser;
  // const cidade = route.params?.cidade;
  // const estado = route.params?.estado;

  function carregarInformacoes() {
    if (
      route.params?.cidade == undefined ||
      route.params?.estado == undefined
    ) {
      EstadoApp.findData(1)
        .then(info => {
          const objJSON = JSON.parse(info.passageiros);
          console.log(info);
          setCidade(info.cidade);
          setEstado(info.estado);
          setPassageiros(objJSON);
          setInfoCarregadas(true);
        })
        .catch(err => console.log(err));
    } else {
      setCidade(route.params?.cidade);
      setEstado(route.params?.estado);
      setPassageiros(route.params?.passageiros);
      setInfoCarregadas(true);
    }
  }

  const contarViagemPassageiro = async uidPassageiro => {
    let reqs = await fetch(
      serverConfig.urlRootNode + `contarViagensPassageiro/${uidPassageiro}`,
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
    return res.count;
  };

  const retornaClassificacao = async uidPassageiro => {
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
    if (res != 'Falha') {
      return res.classificacao;
    } else {
      return 0;
    }
  };

  const atualizarClassificacao = async (novaClassificacao, uidPassageiro) => {
    console.log('atualizarClassificacao');
    let reqs = await fetch(
      serverConfig.urlRootNode + 'atualizarClassificacao',
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: uidPassageiro,
          classificacao: novaClassificacao,
        }),
      },
    );

    let res = await reqs.json();

    //  console.log('req:', res);
    // console.log('passou!');
  };

  const classificarPassageiro = async uidPassageiro => {
    setPassageirosAvaliados([...passageirosAvaliados, uidPassageiro]);
    let numViagens = await contarViagemPassageiro(uidPassageiro);
    let classificacaoAtual = await retornaClassificacao(uidPassageiro);
    // const reference_passageiro = firestore().collection('Users').doc(uidPassageiro);
    try {
      if (numViagens > 0) {
        await atualizarClassificacao((defaultRating + classificacaoAtual) / 2);
      } else {
        await atualizarClassificacao(defaultRating);
      }
      // reference_passageiro.get().then((reference)=>{
      //   if (reference.exists){
      //     numViagens = reference.data().numViagensRealizadas;
      //     classificacaoAtual = reference.data().classificacao;
      //     if (numViagens != undefined && classificacaoAtual != undefined){
      //       reference_passageiro.update({
      //         classificacao: (defaultRating+classificacaoAtual)/2,
      //         numViagensRealizadas: numViagens+1
      //       })
      //     }else{
      //       reference_passageiro.update({
      //         classificacao: defaultRating,
      //         numViagensRealizadas: 1
      //       })
      //     }
      //   }
      // })
    } catch (error) {
      console.log('erro em getClassificacao');
    }
  };

  const excluiBancoMotorista = async () => {
    const reference_motorista = database().ref(
      `${estado}/${cidade}/Motoristas/${currentUser}`,
    );
    try {
      reference_motorista.remove();
    } catch (error) {
      console.log('excluiBancoPassageiro');
    }
  };

  const finalizarViagem = async () => {
    excluiBancoMotorista();
    await AsyncStorage.removeItem('ClassificarPassageiro');
    navigation.navigate('ConfigurarCarona');
  };

  useEffect(() => {
    if (!infoCarregadas) {
      carregarInformacoes();
    } else {
      setRenderizarTela(true);
    }
  }, [infoCarregadas, renderizarTela]);

  function CustomRatingBar() {
    return (
      <View style={styles.CustomRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => {
                console.log('defaultRating:', defaultRating);
                setDefaultRating(item);
              }}>
              <Image
                style={styles.StarImgStyle}
                source={
                  item <= defaultRating
                    ? require('../../assets/icons/star_filled.png')
                    : require('../../assets/icons/star_corner.png')
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  useEffect(() => {
    const defineEstadoAtual = async () => {
      await AsyncStorage.removeItem('ViagemMotorista');
      await AsyncStorage.setItem('ClassificarPassageiro', 'true');
    };
    if (!definiuEstado) {
      defineEstadoAtual().catch(console.error);
    }
  }, []);

  useEffect(() => {
    console.log('tela classificar passageiros:');
    console.log('passageiros:', passageiros);
  });

  return (
    <SafeAreaView style={{marginHorizontal: '2%'}}>
      <StatusBar barStyle={'light-content'} />

      <Text
        style={{
          color: '#06444C',
          fontWeight: '700',
          textAlign: 'center',
          fontSize: height * 0.025,
          lineHeight: 24,
          top: '2.5%',
          alignSelf: 'center',
          textDecorationLine: 'underline',
        }}>
        Você viajou com o(s) passageiro(s) abaixo. Classifique-os!
      </Text>
      <Lottie
        style={{
          height: height * 0.5,
          width: width,
          top: '-9%',
          alignSelf: 'center',
          position: 'relative',
        }}
        source={require('../../assets/JSON/star.json')}
        autoPlay
        autoSize={false}
        loop={true}
        speed={1}
      />
      <ScrollView style={styles.scrollView}>
        {renderizarTela &&
          passageiros.map(passageiro =>
            !passageirosAvaliados.includes(passageiro.uid) ? (
              <View style={styles.viewPassageiros} key={passageiro.uid}>
                <Image
                  source={{
                    uri: passageiro.url,
                  }}
                  style={{
                    height: '30%',
                    width: '30%',
                    borderRadius: 100,
                    alignSelf: 'center',
                    marginTop: '5%',
                  }}
                />
                <Text
                  style={{
                    color: '#06444C',
                    fontWeight: '600',
                    fontSize: height * 0.02,
                    textAlign: 'center',
                  }}>
                  Nome: {passageiro.nome}
                </Text>
                <Text
                  style={{
                    color: '#06444C',
                    fontWeight: '600',
                    fontSize: height * 0.02,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Classificação
                </Text>
                {maxRating.map((item, key) => {
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                    onPress={() => setDefaultRating(item)}>
                    <Image
                      style={styles.StarImgStyle}
                      source={
                        item <= defaultRating
                          ? require('../../assets/icons/star_filled.png')
                          : require('../../assets/icons/star_corner.png')
                      }
                    />
                  </TouchableOpacity>;
                })}
                <CustomRatingBar />
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FF5F55',
                      width: '65%',
                      height: '40%',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRadius: 15,
                      justifyContent: 'center',
                      marginTop: '2%',
                    }}
                    onPress={() => {
                      classificarPassageiro(passageiro.uid);
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: height * 0.019,
                        lineHeight: 24,
                        textAlign: 'center',
                      }}>
                      Avaliar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null,
          )}
      </ScrollView>
      <Text
        style={{
          color: '#06444C',
          fontWeight: '700',
          fontSize: height * 0.02,
          lineHeight: 24,
          alignSelf: 'center',
          top: '-29%',
        }}>
        Caso não queira classificar o(s) passageiro(s), finalize a viagem
        pressionando no botão abaixo.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#FF5F55',
          width: '50%',
          height: '5%',
          alignItems: 'center',
          alignSelf: 'center',
          borderRadius: 15,
          justifyContent: 'center',
          top: '-26%',
        }}
        onPress={finalizarViagem}>
        <Text
          style={{
            color: 'white',
            fontWeight: '600',
            fontSize: height * 0.02,
            lineHeight: 24,
            textAlign: 'center',
          }}>
          Finalizar
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '50%',
    top: '-28%',
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
    width: '75%',
    height: height * 0.35,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FF5F55',
    marginTop: '0%',
  },
  CustomRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  StarImgStyle: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
});

export default ClassificarPassageiro;
