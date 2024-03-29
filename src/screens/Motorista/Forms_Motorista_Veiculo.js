import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const {height, width} = Dimensions.get('screen');

function Forms_Motorista_Veiculo({navigation, route}) {
  const [placa_veiculo, setPlacaVeiculo] = useState('');
  const [ano_veiculo, setAnoVeiculo] = useState('');
  const [cor_veiculo, setCorVeiculo] = useState('');
  const [nome_veiculo, setNomeVeiculo] = useState('');
  const [imagemPlaca, setImagemPlaca] = useState('');
  const [imagemAnexada, setImagemAnexada] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');

  const userID =
    route.params?.userID == null ||
    route.params?.userID == undefined ||
    route.params?.userID == ''
      ? auth().currentUser.uid
      : route.params?.userID;
  const nome = route.params?.nome;
  const CPF = route.params?.cpf;
  const data_nasc = route.params?.data_nasc;
  const num_cel = route.params?.num_cel;
  const universidade = route.params?.universidade;
  const email = route.params?.email;

  const trocaDeModo = route.params?.trocaDeModo;

  const cadastrarUsuario = async () => {
    let reqs = await fetch(serverConfig.urlRootNode + 'cadastrarUsuario', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: userID,
        nome: nome,
        CPF: CPF,
        dataNasc: data_nasc, //conferir se data está no formato "xxxx-xx-xx"
        email: email,
        numCel: num_cel,
        token: 'atualizar',
        universidade: universidade,
        classificacao: 0,
        fotoPerfil: 'atualizar',
        motorista: true,
      }),
    });

    let res = await reqs.json();
    console.log('req:', res);
  };

  const cadastrarVeiculo = async () => {
    let reqs = await fetch(serverConfig.urlRootNode + 'cadastrarVeiculo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        userId: userID,
        nomeVeiculo: nome_veiculo,
        anoVeiculo: ano_veiculo,
        corVeiculo: cor_veiculo,
        placaVeiculo: placa_veiculo,
      }),
    });

    let res = await reqs.json();
    console.log('req:', res);
  };

  const insertDataNewUser = async () => {
    if (
      placa_veiculo == '' ||
      ano_veiculo == '' ||
      cor_veiculo == '' ||
      nome_veiculo == ''
    ) {
      setWarning('Preencha todos os campos!');
      setModalVisible(true);
    } else if (placa_veiculo.length != 7) {
      setWarning('Placa de veículo incorreta.');
      setModalVisible(true);
    } else if (ano_veiculo.length != 4) {
      setWarning('Digite o ano com 4 números.');
      setModalVisible(true);
    } else if (imagemAnexada == false) {
      setWarning(
        'Você precisa anexar a foto da placa do seu veículo para prosseguir.',
      );
      setModalVisible(true);
    } else {
      if (
        trocaDeModo == false ||
        trocaDeModo == undefined ||
        trocaDeModo == ''
      ) {
        await cadastrarUsuario();
        await enviarFotoStorage(imagemPlaca);
        // await firestore().collection('Users').doc(userID).set({
        //     nome: nome,
        //     CPF: CPF,
        //     data_nasc: data_nasc,
        //     num_cel: num_cel,
        //     universidade: universidade,
        //     email: email,
        //     placa_veiculo: placa_veiculo,
        //     ano_veiculo: ano_veiculo,
        //     cor_veiculo: cor_veiculo,
        //     nome_veiculo: nome_veiculo,
        //     motorista: true,
        // }).then(()=>{
        //     enviarFotoStorage(imagemPlaca);
        // });
      } else {
        await cadastrarVeiculo();
        await enviarFotoStorage(imagemPlaca);
        //     await firestore().collection('Users').doc(userID).update({
        //         placa_veiculo: placa_veiculo,
        //         ano_veiculo: ano_veiculo,
        //         cor_veiculo: cor_veiculo,
        //         nome_veiculo: nome_veiculo,
        //     }).then(()=>{
        //         enviarFotoStorage(imagemPlaca);
        //     });
      }
      navigation.navigate('ModoMotorista');
    }
  };

  const enviarFotoStorage = async local => {
    const currentUser = auth().currentUser.uid;
    var caminhoFirebase = currentUser.concat(`Placa${nome_veiculo}`);
    const reference = storage().ref(caminhoFirebase);
    await reference.putFile(local);
  };

  const pickImageFromGalery = async () => {
    const options = {
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);
    if (result?.assets) {
      setImagemPlaca(result.assets[0].uri);
      setImagemAnexada(true);
    }
  };

  // const modoPassageiro = async()=>{
  //     const userID = auth().currentUser.uid;
  //     try{
  //       await firestore().collection('Users').doc(userID).update({
  //         motorista: false
  //       })
  //     }catch(error){
  //       console.log('erro em navegarParaPassageiro');
  //     }
  //     console.log('voltando ao modo passageiro!');
  // }

  const modoPassageiro = async () => {
    console.log('atualizarModoApp');
    let reqs = await fetch(serverConfig.urlRootNode + 'atualizarModoApp', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: userID,
        motorista: false,
      }),
    });
    // let res = await reqs.json();
    // console.log('req:', res);
    // console.log('passou!');
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View
        style={{
          backgroundColor: '#FF5F55',
          width: '100%',
          height: height * 0.05,
          justifyContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontWeight: '700',
            fontSize: 16,
            lineHeight: 20,
            textAlign: 'center',
            color: 'white',
          }}>
          Formulário do motorista
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            backgroundColor: '#FFF',
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {trocaDeModo != undefined ? (
            <Text
              style={{
                position: 'absolute',
                top: '4%',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: height * 0.022,
                lineHeight: 20,
                color: '#06444C',
              }}>
              Só mais algumas informações...
            </Text>
          ) : null}
          <Image
            source={require('../../assets/icons/car.png')}
            style={{
              height: '8%',
              width: '20%',
              position: 'absolute',
              top: '8%',
            }}
          />
          <Text
            style={{
              position: 'absolute',
              top: '18%',
              textAlign: 'center',
              fontWeight: '700',
              fontSize: height * 0.022,
              lineHeight: 20,
              color: '#06444C',
            }}>
            Dados do veículo
          </Text>
          <TextInput
            style={{
              position: 'absolute',
              width: '80%',
              height: '4.8%',
              top: '25%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.019,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            placeholder="Nome do veículo"
            onChangeText={nome_veiculo => setNomeVeiculo(nome_veiculo)}
          />
          <TextInput
            style={{
              position: 'absolute',
              width: '35%',
              height: '4.8%',
              top: '32%',
              left: '10%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.019,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            placeholder="Ano"
            keyboardType="numeric"
            maxLength={4}
            onChangeText={ano_veiculo => setAnoVeiculo(ano_veiculo)}
          />
          <TextInput
            style={{
              position: 'absolute',
              width: '35%',
              height: '4.8%',
              top: '32%',
              left: '54.3%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.019,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            placeholder="Cor"
            maxLength={15}
            onChangeText={cor_veiculo => setCorVeiculo(cor_veiculo)}
          />
          <TextInput
            style={{
              position: 'absolute',
              width: '80%',
              height: '4.8%',
              top: '39%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.019,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            placeholder="Placa"
            maxLength={7}
            onChangeText={placa_veiculo => setPlacaVeiculo(placa_veiculo)}
          />
          <TouchableOpacity
            style={{position: 'absolute', top: '47%'}}
            onPress={pickImageFromGalery}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: height * 0.022,
                color: '#06444C',
              }}>
              Anexar foto
            </Text>
          </TouchableOpacity>
          {!imagemAnexada && (
            <Image
              source={require('../../assets/icons/anexar.png')}
              style={{
                height: '7.2%',
                width: '15%',
                position: 'absolute',
                top: '53%',
              }}
            />
          )}
          {imagemAnexada && (
            <Text
              style={{
                fontWeight: '700',
                fontSize: height * 0.019,
                lineHeight: 20,
                textAlign: 'center',
                color: 'black',
                marginTop: 150,
              }}>
              Imagem anexada
            </Text>
          )}
          <TouchableOpacity
            style={{position: 'absolute', top: '65%'}}
            onPress={insertDataNewUser}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: height * 0.022,
                color: '#06444C',
              }}>
              Avançar
            </Text>
          </TouchableOpacity>
          {trocaDeModo != undefined ? (
            <TouchableOpacity
              style={{position: 'absolute', top: '72%'}}
              onPress={() => {
                modoPassageiro();
                RNRestart.Restart();
              }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: height * 0.022,
                  color: '#FF5F55',
                }}>
                Voltar ao modo passageiro
              </Text>
            </TouchableOpacity>
          ) : null}
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
                marginTop: 22,
                position: 'absolute',
                top: 190,
                alignSelf: 'center',
              }}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    marginBottom: 15,
                  }}>
                  {warning}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FF5F55',
                    width: 200,
                    height: 35,
                    borderRadius: 15,
                    justifyContent: 'center',
                  }}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Entendi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
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
  },
});

export default Forms_Motorista_Veiculo;
