import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import dominios from '../../dominios/dominios.json';
import Icon from 'react-native-vector-icons/FontAwesome';
//import validateEmail from '../../distribuicao/ValidadeEmail_FetchFunctions'

GoogleSignin.configure({
  webClientId:
    '97527742455-7gie5tgugbocjpr1m0ob9sdua49au1al.apps.googleusercontent.com',
});

function Cadastro_Email({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('randomRandomrandomRR');
  const [tokenEmailEnviado, setTokenEmailEnviado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(true);
  const [secondEmail, setSecondEmail] = useState('');

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@(estudante\.ufscar\.br|gmail\.com)$/;

  //   if (!email) {
  //     return { isValid: false, errorMessage: 'Por favor, insira um email.' };
  //   } else if (email.length > 100) {
  //     return {
  //       isValid: false,
  //       errorMessage:
  //         'O email inserido é muito longo. Por favor, insira um email mais curto.',
  //     };
  //   } else if (!emailRegex.test(email)) {
  //     return {
  //       isValid: false,
  //       errorMessage:
  //         'Email inválido! Por favor, insira um email válido @estudante.ufscar.br ou @gmail.com.',
  //     };
  //   }

  //   return { isValid: true };
  // };
  

  // const InsertUserWithEmail = async () => {
  //   if (email == '' && password == '') {
  //     setWarning('Os campos de e-mail e senha\n não podem estar vazios!');
  //     setModalVisible(true);
  //   } else if (email == '') {
  //     setWarning('O campo e-mail \nnão pode estar vazio!');
  //     setModalVisible(true);
  //   } else if (password == '') {
  //     setWarning('O campo senha \nnão pode estar vazio!');
  //     setModalVisible(true);
  //   } else {
  //     if (tokenEmailEnviado == false) {
  //       const dominio = email.split('@');
  //       if (dominios.dominios_permitidos.includes(dominio[1]) == false) {
  //         setWarning(
  //           'Você pode se cadastrar\n apenas com e-mails institucionais!',
  //         );
  //         setModalVisible(true);
  //       } else {
  //         auth()
  //           .createUserWithEmailAndPassword(email, password)
  //           .then(result => {
  //             setEmailCadastro(email);
  //             result.user.sendEmailVerification();
  //             setTokenEmailEnviado(true);
  //             setWarning(
  //               'Foi enviado um link de confirmação de cadastro para o seu e-mail.\n\nVerifique para prosseguir.',
  //             );
  //             setModalVisible(true);
  //           })
  //           .catch(error => {
  //             if (error.code === 'auth/email-already-in-use') {
  //               setWarning('Este email já está em uso, escolha outro!');
  //               setModalVisible(true);
  //             }
  //             if (error.code === 'auth/invalid-email') {
  //               setWarning('E-mail inválido!');
  //               setModalVisible(true);
  //             }
  //           });
  //       }
  //     } else {
  //       if (auth().currentUser.emailVerified == false) {
  //         setWarning(
  //           'Link de verificação enviado.\n\nVerifique e faça login para continuar.',
  //         );
  //         setModalVisible(true);
  //       }
  //     }
  //   }
  // };
   

  async function validateEmail(email) {
    console.log('Chegou na validateEmail antes do fetch');

    try {
      const response = await fetch('http://192.168.0.121:3001/validateEmail?email=' + email);
        console.log('Depois do fetch');

        const { result } = await response.json();
        return result;
    } catch (error) {
        console.log('Erro que deu: ' + error);
        throw error;
    }
}

const InsertUserWithEmail = async () => {
    // Validação do email
    console.log("Entrou na função de cadastro e validacao")
    const validation = await validateEmail(email);
    console.log(JSON.stringify(validation) + " VALIDACAO ")
    if (!validation.isValid) {
      Alert.alert(validation.errorMessage);
      return;
    }

    // Validação do campo de senha
    if (password === '') {
      setWarning('O campo senha não pode estar vazio!');
      setModalVisible(true);
      return;
    }

    try {
      // Criação do usuário com email e senha
      const result = await auth().createUserWithEmailAndPassword(email, password);
      
      // Envio do email de verificação
      setEmailCadastro(email);
      await result.user.sendEmailVerification();
      setTokenEmailEnviado(true);
      setWarning(
        'Foi enviado um link de confirmação de cadastro para o seu e-mail.\n\nVerifique para prosseguir.',
      );
      console.log('Foi enviado um link de confirmação de cadastro para o seu e-mail. Verifique para prosseguir.')
      setModalVisible(true);
    } catch (error) {
     // Tratamento de erros de autenticação
      if (error.code === 'auth/email-already-in-use') {
        setWarning('Este email já está em uso, escolha outro!');
        setModalVisible(true);
      } else if (error.code === 'auth/invalid-email') {
        setWarning('E-mail inválido!');
        setModalVisible(true);
      } else {
        console.log('Erro desconhecido:', error);
      }
    }
};


  const { height, width } = Dimensions.get('screen');
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{ backgroundColor: '#FFF', height: '100%' }}>
        <TouchableOpacity
          style={styles.btnFechar}
          onPress={() => navigation.navigate('Entrada')}>
          <Image
            source={require('../../assets/icons/close.png')}
            style={{ height: '80%', width: '100%' }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#06444C',
            top: height * 0.08,
            fontWeight: '700',
            fontSize: height * 0.025,
            lineHeight: height * 0.03,
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          Digite um e-mail institucional{'\n'} e uma senha para se cadastrar
        </Text>
        <TextInput
          style={{
            width: width * 0.75,
            height: height * 0.05,
            top: height * 0.15,
            alignSelf: 'center',
            borderRadius: 15,
            fontWeight: '400',
            fontSize: height * 0.02,
            lineHeight: 22,
            borderWidth: 1,
            color: 'black',
          }}
          placeholderTextColor="black"
          placeholder="Digite aqui o e-mail"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={{
            width: width * 0.75,
            height: height * 0.05,
            top: height * 0.2,
            alignSelf: 'center',
            borderRadius: 15,
            fontWeight: '400',
            fontSize: height * 0.02,
            lineHeight: height * 0.03,
            borderWidth: 1,
            color: 'black',
          }}
          placeholderTextColor="black"
          placeholder="Digite aqui a senha"
          secureTextEntry={senhaVisivel}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={{ top: height * 0.32, left: width * 0.76, position: 'absolute' }}
          onPress={() => {
            setSenhaVisivel(!senhaVisivel);
          }}>
          {senhaVisivel ? (
            <Icon name="eye" size={26} color="gray" />
          ) : (
            <Icon name="eye-slash" size={26} color="gray" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: width * 0.75,
            height: height * 0.05,
            top: height * 0.25,
            backgroundColor: '#FF5F55',
            borderRadius: 15,
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: height * 0.04,
          }}
          onPress={InsertUserWithEmail}>
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: height * 0.02,
              lineHeight: height * 0.03,
              textAlign: 'center',
            }}>
            Continuar
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
                style={{ color: 'black', textAlign: 'center', marginBottom: 15 }}>
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
  btnFechar: {
    position: 'absolute',
    width: 14,
    height: 29,
    left: 22,
    top: 20,
  },
});

export default Cadastro_Email;
