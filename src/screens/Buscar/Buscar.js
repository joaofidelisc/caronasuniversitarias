import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import {useNetInfo} from '@react-native-community/netinfo';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import config from '../../config';
import serverConfig from '../../../config/config.json';
import Geocoder from 'react-native-geocoding';
import EstadoApp from '../../services/sqlite/EstadoApp';

const {width, height} = Dimensions.get('screen');

export default function Buscar({navigation}) {
  const [localDestino, setLocalDestino] = useState(null);
  const [nomeDestino, setNomeDestino] = useState('');
  const [localizacaoPassageiro, setlocalizacaoPassageiro] = useState(null);
  const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [aplicativoEstavaAtivo, setAplicativoEstavaAtivo] = useState(true);
  const [criouTabela, setCriouTabela] = useState(false);
  const [recuperouEstado, setRecuperouEstado] = useState(false);
  const [definiuEstado, setDefiniuEstado] = useState(false);

  const netInfo = useNetInfo();

  async function enviarLocalizacaoPassageiro(latitude, longitude) {
    const currentUser = auth().currentUser.uid;
    var response = await Geocoder.from(latitude, longitude);
    var filtro_cidade = response.results[0].address_components.filter(function (
      address_component,
    ) {
      return address_component.types.includes('administrative_area_level_2');
    });

    var filtro_estado = response.results[0].address_components.filter(function (
      address_component,
    ) {
      return address_component.types.includes('administrative_area_level_1');
    });

    var cidade = filtro_cidade[0].short_name;
    var estado = filtro_estado[0].short_name;
    await EstadoApp.removeData(1)
      .then(console.log('dados removidos!'))
      .catch(console.log('algum erro ocorreu!'));
    console.log('dados inseridos!');

    const reference = database().ref(
      `${estado}/${cidade}/Passageiros/${currentUser}`,
    );
    try {
      reference
        .set({
          latitudePassageiro: latitude,
          longitudePassageiro: longitude,
          latitudeDestino: localDestino.latitude,
          longitudeDestino: localDestino.longitude,
          nomeDestino: nomeDestino,
          ativo: true,
          ofertasCaronas: '',
          caronasAceitas: '',
        })
        .then(() => console.log('coordenadas passageiro enviadas!'));

      //'abrir' local destino para enviar para o banco de dados
      await EstadoApp.insertData({
        cidade: cidade,
        estado: estado,
        nomeDestino: nomeDestino,
        uidMotorista: 'alterar',
        nomeMotorista: 'alterar',
        veiculoMotorista: 'alterar',
        placaVeiculoMotorista: 'alterar',
        motoristaUrl: 'alterar',
        numVagas: 0,
        passageiros: 'alterar',
        id: 1,
      });
      navigation.navigate('Buscando_Carona', {
        nomeDestino: nomeDestino,
        localDestino: localDestino,
        cidade: cidade,
        estado: estado,
      });
    } catch (error) {
      console.log('ERRO:', error.code);
    }
  }

  async function getLocalPassageiro() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(() => {
      ligarLocalizacao();
    });
    if (localizacaoAtiva == true) {
      if (nomeDestino != '') {
        try {
          Geolocation.getCurrentPosition(
            info => {
              setlocalizacaoPassageiro({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              enviarLocalizacaoPassageiro(
                info.coords.latitude,
                info.coords.longitude,
              );
            },
            () => {
              console.log('erro');
            },
            {
              enableHighAccuracy: false,
              timeout: 2000,
            },
          );
        } catch (error) {
          console.log(error.code);
        }
        console.log('deu bom\n');
      } else {
        setModalVisible(true);
      }
    } else {
      console.log('localizacao desativada');
    }
  }

  //implementando
  const ligarLocalizacao = async () => {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        "<h2 style='color: #0af13e'>Usar localização</h2><br/>Deseja permitir que o aplicativo <b>Caronas Universitárias</b> acesse a sua localização?<br/><br/>",
      ok: 'Permitir',
      cancel: 'Negar',
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
      providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
    })
      .then(function (success) {
        setLocalizacaoAtiva(true);
        estadoInicial();
        // console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
      })
      .catch(error => {
        setLocalizacaoAtiva(false);
        console.log(error.message); // error.message => "disabled"
      });
  };

  const estadoInicial = async () => {
    try {
      Geolocation.getCurrentPosition(
        info => {
          setlocalizacaoPassageiro({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        () => {
          console.log('erro');
        },
        {
          enableHighAccuracy: false,
          timeout: 2000,
        },
      );
    } catch (error) {
      console.log(error.code);
    }
  };

  useEffect(() => {
    const recuperaEstadoApp = async () => {
      console.log('rodando recuperaEstadoApp...');
      let BuscandoCarona = await AsyncStorage.getItem('BuscandoCarona');
      let CaronaEncontrada = await AsyncStorage.getItem('CaronaEncontrada');
      let AguardandoMotorista = await AsyncStorage.getItem(
        'AguardandoMotorista',
      );
      let ViagemEmAndamento = await AsyncStorage.getItem('ViagemEmAndamento');
      let Classificacao = await AsyncStorage.getItem('Classificacao');

      (BuscandoCarona != null && BuscandoCarona != undefined) ||
      (CaronaEncontrada != null && CaronaEncontrada != undefined) ||
      (AguardandoMotorista != null && AguardandoMotorista != undefined) ||
      (ViagemEmAndamento != null && ViagemEmAndamento != undefined) ||
      (Classificacao != null && Classificacao != undefined)
        ? setAplicativoEstavaAtivo(true)
        : setAplicativoEstavaAtivo(false);

      if (BuscandoCarona != null && BuscandoCarona != undefined) {
        navigation.navigate('Buscando_Carona');
      } else if (CaronaEncontrada != null && CaronaEncontrada != undefined) {
        navigation.navigate('CaronaEncontrada');
      } else if (
        AguardandoMotorista != null &&
        AguardandoMotorista != undefined
      ) {
        navigation.navigate('AguardandoMotorista');
      } else if (ViagemEmAndamento != null && ViagemEmAndamento != undefined) {
        navigation.navigate('ViagemEmAndamento');
      } else if (Classificacao != null && Classificacao != undefined) {
        navigation.navigate('Classificacao');
      }
      setRecuperouEstado(true);
    };
    if (!recuperouEstado) {
      recuperaEstadoApp().catch(console.error);
    }
  });

  useEffect(() => {
    const defineEstadoAtual = async () => {
      console.log('rodando defineEstado...');
      await AsyncStorage.removeItem('BuscandoCarona');
    };
    if (!definiuEstado) {
      defineEstadoAtual().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (netInfo.isConnected == false) {
      Alert.alert(
        'Sem conexão',
        'Para continuar a utilizar o aplicativo, conecte-se à internet!',
        [{text: 'OK'}],
      );
    }
  });

  useEffect(() => {
    console.log('TELA: Buscar');
    Geocoder.init(config.googleAPI, {language: 'pt-BR'});
    ligarLocalizacao();
  }, []);

  useEffect(() => {
    const currentUser = auth().currentUser.uid;
    const atualizaBanco = async () => {
      try {
        let response = await fetch(
          `${serverConfig.urlRootNode}api/rabbit/consumirInfo/cadastroUsuario/${currentUser}`,
        );
        if (!response.ok) {
          throw new Error('Falha na requisição');
        }
        const responseData = await response.json();
        const postResponse = await fetch(
          serverConfig.urlRootNode + 'cadastrarUsuario',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              id: responseData.data.id,
              nome: responseData.data.nome,
              CPF: responseData.data.CPF,
              data_nasc: responseData.data.data_nasc,
              num_cel: responseData.data.num_cel,
              universidade: responseData.data.universidade,
              email: responseData.data.email,
              placa_veiculo: responseData.data.placa_veiculo,
              ano_veiculo: responseData.data.ano_veiculo,
              cor_veiculo: responseData.data.cor_veiculo,
              nome_veiculo: responseData.data.nome_veiculo,
              motorista: responseData.data.motorista,
            }),
          },
        );
        if (postResponse.ok) {
          const resultado = await postResponse.json(); // Ou .text(), dependendo do que você espera receber
          console.log('Inseriu com sucesso:', resultado);
        } else {
          console.error('Erro ao inserir:', postResponse.statusText);
        }
      } catch (error) {
        console.error('Erro ao receber ou enviar dados:', error);
      }
    };
    atualizaBanco();
  }, []);

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
        <Image
          source={require('../../assets/images/buscar-carona.png')}
          style={{
            height: height * 0.5,
            width: width * 0.9,
            position: 'absolute',
            top: height * 0.24,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            fontSize: height * 0.025,
            color: '#2f4f4f',
            fontWeight: 'bold',
            position: 'absolute',
            top: height * 0.05,
            textDecorationLine: 'underline',
          }}>
          Para onde pretende ir?
        </Text>
        <Text
          style={{
            fontSize: height * 0.019,
            color: '#c0c0c0',
            fontWeight: 'normal',
            position: 'absolute',
            marginVertical: height * 0.04,
            top: height * 0.16,
            fontWeight: '600',
          }}>
          Ex: Universidade Federal de São Carlos
        </Text>
        {localizacaoPassageiro && (
          <GooglePlacesAutocomplete
            minLength={2}
            autoFocus={false}
            fetchDetails={true}
            onPress={(data, details = null) => {
              setNomeDestino(data.description);
              setLocalDestino({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }}
            textInputProps={{
              onChangeText: nomeDestino => {
                setNomeDestino(nomeDestino);
              },
            }}
            query={{
              key: config.googleAPI,
              language: 'pt-br',
              components: 'country:br',
              location: `${localizacaoPassageiro.latitude}, ${localizacaoPassageiro.longitude}`, //alterar aqui para coordenadas atuais
              radius: '15000', //15km
              strictbounds: true,
            }}
            GooglePlacesSearchQuery={{
              rankby: 'distance',
            }}
            styles={{
              container: {
                position: 'absolute',
                alignItems: 'center',
                top: height * 0.12,
                width: width,
                justifyContent: 'center',
              },
              textInputContainer: {
                width: width * 0.75,
                height: height * 0.06,
                borderColor: 'rgba(83, 83, 83, 0.8)',
                borderWidth: 2,
                borderRadius: 8,
                backgroundColor: 'white',
              },
              textInput: {
                color: 'black',
              },
              description: {
                color: 'black',
              },
              listView: {
                elevation: 1,
                height: height * 0.5,
                width: width,
              },
            }}
          />
        )}

        <View style={{marginVertical: 50}}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              backgroundColor: '#FF5F55',
              top: height * 0.28,
              width: width * 0.7,
              height: height * 0.055,
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 15,
              justifyContent: 'center',
            }}
            onPress={getLocalPassageiro}>
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: height * 0.02,
                lineHeight: 24,
                textAlign: 'center',
              }}>
              Buscar Carona
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '50%',
              position: 'absolute',
              alignSelf: 'center',
            }}>
            <View style={styles.modalView}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  marginBottom: '5%',
                  fontWeight: '600',
                }}>
                Informações incompletas
              </Text>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  marginBottom: '5%',
                }}>
                Preencha o local de destino antes de prosseguir para a próxima
                etapa!
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#FF5F55',
                  width: width * 0.5,
                  height: height * 0.04,
                  borderRadius: 15,
                  justifyContent: 'center',
                }}
                onPress={() => setModalVisible(!modalVisible)}
                // onPress={buscarCarona}
              >
                <Text style={styles.textStyle}>Entendi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: height * 0.015,
  },
});
