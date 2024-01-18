import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {TextInputMask} from 'react-native-masked-text';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('screen');

function Forms_Passageiro({route, navigation}) {
  const [nome, setNome] = useState('');
  const [CPF, setCPF] = useState('');
  const [data_nasc, setDataNasc] = useState('');
  const [num_cel, setNumCel] = useState('');
  const [universidade, setUniversidade] = useState('');
  const CPFRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');

  const userID = route.params?.userID;

  const descartarAlteracoes = async () => {
    navigation.navigate('Como_Comecar', {
      email: route.params?.email,
      userID: route.params?.userID,
    });
  };

  useEffect(() => {
    // console.log(userID);
    const backAction = () => {
      Alert.alert(
        'Descartar informações',
        'Tem certeza que deseja voltar?\nSuas informações serão descartadas.',
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

  const insertDataNewUser = async () => {
    if (
      nome == '' ||
      CPF == '' ||
      data_nasc == '' ||
      num_cel == '' ||
      universidade == ''
    ) {
      setWarning('Preencha todos os campos!');
      setModalVisible(true);
    } else if (CPF.length != 14) {
      setWarning('CPF incorreto.');
      setModalVisible(true);
    } else if (data_nasc.length != 10) {
      setWarning('Data de nascimento incorreta.');
      setModalVisible(true);
    } else if (num_cel.length != 14) {
      setWarning('Número de celular incorreto.');
      setModalVisible(true);
    } else {
      try {
        await firestore().collection('private-users').doc(userID).set({
          nome: nome,
          CPF: CPF,
          data_nasc: data_nasc,
          num_cel: num_cel,
          universidade: universidade,
          email: route.params?.email,
        });
        await firestore()
          .collection('public-users')
          .doc(userID)
          .set({
            nome: nome,
            universidade: universidade,
            email: route.params?.email,
            placa_veiculo: '',
            ano_veiculo: '',
            cor_veiculo: '',
            nome_veiculo: '',
            motorista: false,
          })
          .then(() => {
            navigation.navigate('ModoPassageiro', {userID: userID});
          });
      } catch (error) {
        console.error('Erro inesperado:', error);
      }
    }
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
            fontSize: height * 0.02,
            lineHeight: 20,
            textAlign: 'center',
            color: 'white',
          }}>
          Formulário do passageiro
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
          <Image
            source={require('../../assets/icons/user_undefined.png')}
            style={{
              height: '7.5%',
              width: width * 0.159,
              position: 'absolute',
              top: '10%',
            }}
          />
          <Text
            style={{
              position: 'absolute',
              top: '19%',
              textAlign: 'center',
              fontWeight: '700',
              fontSize: height * 0.022,
              lineHeight: 20,
              color: '#06444C',
            }}>
            Dados pessoais
          </Text>
          <TextInput
            style={{
              position: 'absolute',
              width: '85%',
              height: '5%',
              top: '25%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.02,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            placeholder="Nome"
            onChangeText={nome => setNome(nome)}
          />
          <TextInputMask
            style={{
              position: 'absolute',
              width: '40%',
              height: '5%',
              top: '33%',
              left: '5%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.02,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            type="cpf"
            onChangeText={CPF => setCPF(CPF)}
            placeholder="CPF"
            ref={CPFRef}
          />
          <TextInputMask
            style={{
              position: 'absolute',
              width: '40%',
              height: '5%',
              top: '33%',
              left: '55%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.02,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            type="datetime"
            options={{
              format: 'DD/MM/YYYY',
            }}
            placeholder="Nascimento"
            onChangeText={data_nasc => setDataNasc(data_nasc)}
          />
          <TextInputMask
            style={{
              position: 'absolute',
              width: '75%',
              height: '5%',
              top: '42%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.02,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            type="cel-phone"
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99)',
            }}
            placeholder="Número de celular"
            onChangeText={num_cel => setNumCel(num_cel)}
          />
          <TextInput
            style={{
              position: 'absolute',
              width: '75%',
              height: '5%',
              top: '50%',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.02,
              borderWidth: 1,
              color: 'black',
            }}
            placeholderTextColor="black"
            placeholder="Universidade"
            onChangeText={universidade => setUniversidade(universidade)}
          />
          <TextInput
            style={{
              position: 'absolute',
              width: '85%',
              height: '5%',
              top: '58%',
              backgroundColor: '#D3D3D3',
              borderRadius: 12,
              textAlign: 'center',
              fontWeight: '400',
              fontSize: height * 0.019,
              color: 'black',
            }}
            placeholderTextColor="black"
            placeholder="E-mail"
            keyboardType="email-address"
            value={route.params?.email}
            editable={false}
          />
          <TouchableOpacity
            style={{position: 'absolute', top: '69%'}}
            onPress={insertDataNewUser}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: height * 0.022,
                color: '#06444C',
              }}>
              Salvar
            </Text>
          </TouchableOpacity>
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

export default Forms_Passageiro;
