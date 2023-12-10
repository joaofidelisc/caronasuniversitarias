import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  PermissionsAndroid,
  Dimensions,
  StyleSheet,
} from 'react-native';
import database from '@react-native-firebase/database';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import EstadoApp from '../../services/sqlite/EstadoApp';
import serverConfig from '../../../config/config.json';
import EventSource from 'react-native-event-source';

const {width, height} = Dimensions.get('screen');

function AguardandoMotorista({navigation, route}) {
  const [motoristaAcaminho, setMotoristaAcaminho] = useState(false);
  const [posicaoMotorista, setPosicaoMotorista] = useState(null);
  const [posicaoPassageiro, setPosicaoPassageiro] = useState(null);
  const [viagemEmAndamento, setViagemEmAndamento] = useState(null);

  const [infoCarregadas, setInfoCarregadas] = useState(false);

  const [cidade, setCidade] = useState(null);
  const [estado, setEstado] = useState(null);
  const [nomeDestino, setNomeDestino] = useState(null);
  const [uidMotorista, setUidMotorista] = useState(null);
  const [nomeMotorista, setNomeMotorista] = useState(null);
  const [veiculoMotorista, setVeiculoMotorista] = useState(null);
  const [placaVeiculoMotorista, setPlacaVeiculoMotorista] = useState(null);
  const [motoristaUrl, setMotoristaUrl] = useState(null);

  const currentUser = auth().currentUser.uid;

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
          setNomeDestino(info.nomeDestino);
          setUidMotorista(info.uidMotorista);
          setNomeMotorista(info.nomeMotorista);
          setVeiculoMotorista(info.veiculoMotorista);
          setPlacaVeiculoMotorista(info.placaVeiculoMotorista);
          setMotoristaUrl(info.motoristaUrl);
          setInfoCarregadas(true);
        })
        .catch(err => console.log(err));
    } else {
      console.log('info carregadas por default!');
      setCidade(route.params?.cidade);
      setEstado(route.params?.estado);
      setNomeMotorista(route.params?.nomeMotorista);
      setVeiculoMotorista(route.params?.veiculoMotorista);
      setPlacaVeiculoMotorista(route.params?.placaVeiculoMotorista);
      setMotoristaUrl(route.params?.motoristaUrl);
      setNomeDestino(route.params?.nomeDestino);
      setUidMotorista(route.params?.uidMotorista);
      setInfoCarregadas(true);
    }
  }

  //Função responsável por solicitar ao motorista para ligar sua localização.
  const localizacaoLigada = async () => {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        "<h2 style='color: #0af13e'>Usar localização</h2><br/>Deseja permitir que o aplicativo <b>Caronas Universitárias</b> acesse a sua localização?<br/><br/>",
      ok: 'Permitir',
      cancel: 'Negar',
      enableHighAccuracy: true,
      showDialog: true,
      openLocationServices: true,
      preventOutSideTouch: false,
      preventBackClick: false,
      providerListener: false,
    }).catch(error => {
      console.log(error.message); // error.message => "disabled"
    });
  };

  const motoristaMeBuscando = async () => {
    try {
      const events = new EventSource(
        `${serverConfig.urlRootNode}motoristaMeBuscando/${estado}/${cidade}/${currentUser}/${uidMotorista}/${motoristaAcaminho}`,
      );
      events.addEventListener('motoristaMeBuscando', event => {
        const data = JSON.parse(event.data);
        const motoristaAcaminho = data.motoristaAcaminho;
        setMotoristaAcaminho(motoristaAcaminho);
      });
    } catch (error) {
      console.log(error.code);
    }
  };

  const navigateToViagemEmAndamento = async () => {
    const reference_motorista = database().ref(
      `${estado}/${cidade}/Motoristas/${uidMotorista}`,
    );
    if (viagemEmAndamento) {
      reference_motorista.off('value');
      console.log('--------------------------------------------');
      console.log('uidMOTORISTA::::', uidMotorista);
      console.log('MOTORISTAURL AGUARDANDO MOTORISTA:', motoristaUrl);
      console.log('--------------------------------------------');
      navigation.navigate('ViagemEmAndamento', {
        uidMotorista: uidMotorista,
        currentUser: currentUser,
        cidade: cidade,
        estado: estado,
        nomeMotorista: nomeMotorista,
        veiculoMotorista: veiculoMotorista,
        placaVeiculoMotorista: placaVeiculoMotorista,
        motoristaUrl: motoristaUrl,
        nomeDestino: nomeDestino,
      });
    }
  };

  const viagemIniciada = async () => {
    const reference = database().ref(
      `${estado}/${cidade}/Motoristas/${uidMotorista}`,
    );
    try {
      reference.on('value', function (snapshot) {
        if (snapshot.child('caronistasAbordo').exists()) {
          if (
            snapshot.val().caronistasAbordo.includes(currentUser) &&
            !viagemEmAndamento
          ) {
            setViagemEmAndamento(true);
            navigateToViagemEmAndamento();
          } else {
            console.log('viagem ainda não começou!');
            if (viagemEmAndamento) {
              navigateToViagemEmAndamento();
            }
          }
        }
      });
    } catch (error) {
      console.log('erro em viagemIniciada');
    }
  };

  function atualizaEstado() {
    const reference = database().ref(
      `${estado}/${cidade}/Passageiros/${currentUser}`,
    );
    try {
      reference.update({
        latitudePassageiro: posicaoPassageiro.latitude,
        longitudePassageiro: posicaoPassageiro.longitude,
        ativo: true,
      });
    } catch (error) {
      console.log('atualizaEstado, ERRO:', error.code);
    }
  }

  function getMyLocation() {
    try {
      Geolocation.getCurrentPosition(
        info => {
          setPosicaoPassageiro({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        () => {
          console.log('Atualizando...');
        },
        {
          enableHighAccuracy: false,
          timeout: 2000,
        },
      );
      atualizaEstado();
    } catch (error) {
      console.log(error.code);
    }
  }

  function getPosicaoMotorista() {
    console.log('----------------------------------');
    console.log('dentro de getPosicaoMotorista:');
    console.log('uidMotorista:', uidMotorista);
    //UIDMOTORISTA NÃO ESTÁ ATUALIZANDO...
    console.log('cidade:', cidade, 'estado:', estado);
    const reference = database().ref(
      `${estado}/${cidade}/Motoristas/${uidMotorista}`,
    );
    try {
      //bug aqui
      reference.on('value', function (snapshot) {
        if (snapshot.exists()) {
          setPosicaoMotorista({
            latitude: snapshot.val().latitudeMotorista,
            longitude: snapshot.val().longitudeMotorista,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      });
    } catch (error) {
      console.log('erro em getPosicaoMotorista');
    }
    console.log('----------------------------------');
  }

  useEffect(() => {
    const defineEstadoAtual = async () => {
      await AsyncStorage.removeItem('CaronaEncontrada');
      await AsyncStorage.setItem('AguardandoMotorista', 'true');
    };
    defineEstadoAtual().catch(console.error);
  }, []);

  useEffect(() => {
    getMyLocation();
    if (infoCarregadas) {
      getPosicaoMotorista();
      motoristaMeBuscando();
      viagemIniciada();
    } else {
      console.log('é necessário carregar as informações');
      carregarInformacoes();
    }
  }, [motoristaAcaminho, viagemEmAndamento, infoCarregadas]);

  //   useEffect(()=>{
  //     getMyLocation();
  //     getPosicaoMotorista();
  //     motoristaMeBuscando();
  //     viagemIniciada();
  //     // if (infoCarregadas){
  //     // }else{
  //     //   console.log('é necessário carregar as informações');
  //     //   carregarInformacoes();
  //     // }
  // }, [motoristaAcaminho, viagemEmAndamento])

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
        {posicaoMotorista && (
          <MapView
            onMapReady={() => {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              ).then(() => {
                console.log('Permissão aceita');
                localizacaoLigada();
              });
            }}
            provider={PROVIDER_GOOGLE}
            style={{width: width, height: height, flex: 1}}
            region={posicaoPassageiro}
            zoomEnabled={true}
            minZoomLevel={17}
            showsUserLocation={true}
            loadingEnabled={false}
            // onRegionChange={getMyLocation}
            initialRegion={{
              latitude: -21.983311,
              longitude: -47.883154,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              key={uidMotorista}
              coordinate={{
                latitude: posicaoMotorista.latitude,
                longitude: posicaoMotorista.longitude,
              }}
              tappable={false}
              // icon={
              //     require('../../assets/icons/motorista.png')
              //   }
            >
              <Image
                source={require('../../assets/icons/motorista.png')}
                style={{width: width * 0.065, height: width * 0.065}}
                resizeMode="contain"
              />
            </Marker>
          </MapView>
        )}
        <View style={styles.viewCancelar}>
          <Text
            style={{
              color: '#06444C',
              fontWeight: '600',
              fontSize: height * 0.015,
              lineHeight: 24,
              textAlign: 'center',
            }}>
            Caso deseje cancelar a viagem...{'\n'} Pressione no botão abaixo.
            {'\n'}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#FF5F55',
              width: '75%',
              height: '30%',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 15,
              justifyContent: 'center',
              top: '5%',
            }}
            onPress={() => {
              console.log('cancelando viagem...');
              // embarquePassageiro(embarcarPassageiro);
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: height * 0.019,
                lineHeight: 24,
                textAlign: 'center',
              }}>
              Cancelar viagem
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewCancelar: {
    position: 'absolute',
    width: width * 0.8,
    height: height * 0.15,
    bottom: '2%',
    justifyContent: 'center',
    borderBottomColor: '#FF5F55',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
    alignContent: 'center',
  },
});
export default AguardandoMotorista;
