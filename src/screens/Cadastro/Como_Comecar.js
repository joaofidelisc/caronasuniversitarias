import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  BackHandler,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Lottie from 'lottie-react-native';

const {height, width} = Dimensions.get('screen');

function Como_Comecar({navigation, route}) {
  const [carregando, setCarregando] = useState(true);

  const email = route.params?.email;
  const senha = route.params?.senha;
  const userID = auth().currentUser.uid;

  const signOutGoogle = async () => {
    GoogleSignin.signOut().catch(error => {
      setWarning('Algum erro ocorreu.');
      setModalVisible(true);
    });
  };

  const descartarAlteracoes = async () => {
    if (GoogleSignin.isSignedIn) {
      signOutGoogle();
    }
    navigation.navigate('Entrada');
  };

  useEffect(() => {
    console.log('email:', email);
    // navigation.navigate('ModoPassageiro', {userID: userID});
    // navigation.navigate('MenuTeste');

    const backAction = () => {
      Alert.alert(
        'Descartar alterações',
        'Tem certeza que deseja voltar e cancelar o cadastro?',
        [
          {
            text: 'Cancelar',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'Sim', onPress: () => descartarAlteracoes()},
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
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
          navigation.navigate('ModoPassageiro', {userID: userID});
        } else {
          console.error('Erro ao inserir:', postResponse.statusText);
        }
      } catch (error) {
        console.error('Erro ao receber ou enviar dados:', error);
      }
      setCarregando(false);
    };
    atualizaBanco();
  }, []);

  if (!carregando) {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View
          style={{
            backgroundColor: '#FFF',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              position: 'absolute',
              top: '10%',
              fontWeight: '700',
              fontSize: height * 0.03,
              lineHeight: 29,
              color: '#06444C',
              textAlign: 'center',
            }}>
            Como você quer{'\n'}começar?
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: '75%',
              height: '5.2%',
              top: '28%',
              backgroundColor: '#FF5F55',
              borderRadius: 12,
              justifyContent: 'center',
            }}
            onPress={() =>
              navigation.navigate('Forms_Passageiro', {
                email: email,
                senha: senha,
                userID: userID,
              })
            }>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: height * 0.02,
                lineHeight: 20,
                color: 'white',
              }}>
              Sou passageiro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: '75%',
              height: '5.2%',
              top: '37%',
              backgroundColor: '#FF5F55',
              borderRadius: 12,
              justifyContent: 'center',
            }}
            onPress={() =>
              navigation.navigate('Forms_Motorista', {
                email: email,
                senha: senha,
                userID: userID,
              })
            }>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: height * 0.02,
                lineHeight: 20,
                color: 'white',
              }}>
              Sou motorista
            </Text>
          </TouchableOpacity>
          <Lottie
            style={{height: height * 0.35, width: width * 0.35, top: '12%'}}
            source={require('../../assets/JSON/car.json')}
            autoPlay
            autoSize={false}
            loop={true}
            speed={1}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View
          style={{
            backgroundColor: '#FFF',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              position: 'absolute',
              top: '10%',
              fontWeight: '700',
              fontSize: height * 0.03,
              lineHeight: 29,
              color: '#06444C',
              textAlign: 'center',
            }}>
            Carregando...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default Como_Comecar;
