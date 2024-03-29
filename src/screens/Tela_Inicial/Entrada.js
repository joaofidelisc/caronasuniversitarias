import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database, {firebase} from '@react-native-firebase/database';

import serverConfig from '../../../config/config.json';

const {height, width} = Dimensions.get('window');

function Entrada({navigation}) {
  const [falhaLogin, setFalhaLogin] = useState(false);

  /*
  const redirecionamentoLogin = async(email)=>{  
    try{
      let reqs = await fetch(serverConfig.urlRootNode+`buscarPorEmail/${email}`,{
          method: 'GET',
          mode: 'cors',
          headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
          }
      });
      const res_user = await reqs.json();
      console.log('resposta:', res_user[0]);
      if (res_user[0] != undefined && res_user != 'Falha'){
        let reqs_veiculo = await fetch(serverConfig.urlRootNode+`buscarVeiculo/${res_user.id}`,{
          method: 'GET',
          mode: 'cors',
          headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
          }
        });
        const res_veiculo = await reqs_veiculo.json();
        if (res_veiculo != 'Falha'){
          //existe veiculo;
        }else{
          //não existe veiculo;
        }
          //encontrou
      }else{
        // n encontrou
      }
      // firestore().collection('Users').where('email', '==', email).get().then(querySnapshot=>{
      //   const valor = querySnapshot.docs;
      //   const motorista = (valor == "" || valor == undefined)? '' : valor[0].data().motorista;
      //   const cadastro_veiculo = (valor == "" || valor == undefined)? '' : valor[0].data().nome_veiculo;
      //   const nome = (valor == "" || valor == undefined)? '' : valor[0].data().nome;
      //   const cpf = (valor == "" || valor == undefined)? '' : valor[0].data().CPF;
      //   const data_nasc = (valor == "" || valor == undefined)? '' : valor[0].data().data_nasc;
      //   const num_cel = (valor == "" || valor == undefined)? '' : valor[0].data().num_cel;
      //   const universidade = (valor == "" || valor == undefined)? '' : valor[0].data().universidade;
      //   const email_banco = (valor == "" || valor == undefined)? '' : valor[0].data().email;
      //   console.log('informações:', nome, cpf, data_nasc, num_cel, universidade, email_banco);
      //   if (valor == ""){
      //     if (email_banco != ''){
      //       navigation.navigate("Como_Comecar", {email: email});
      //     }else{
      //       setFalhaLogin(true);
      //     }
      //   }
      //   else{
      //     if (motorista == true && cadastro_veiculo!=''){
      //       // navigation.navigate("ModoMotorista");
      //       navigation.navigate("MenuTeste");
      //     }else if (motorista == true && cadastro_veiculo == ''){
      //       console.log('navegando para a tela de cadastro de veículo');
      //       console.log('informações:', nome, cpf, data_nasc, num_cel, universidade, email_banco);
      //       navigation.navigate('Forms_Motorista_Veiculo', {trocaDeModo:true});
      //     } else{
      //       navigation.navigate("MenuTeste");
      //       // navigation.navigate("ModoPassageiro");
      //     }
      //   }
      // })
    }catch(error){
      if (error.code == 'auth/missing-identifier'){
        console.log('missing identifier!');
      }
      setFalhaLogin(true);
      Alert.alert(
        "Algum erro ocorreu",
        "Tente entrar novamente...",
        [
          // { text: "OKs", onPress: () => verificarConexao()}
        ]
      );
      console.log('erro no redirecionamento');
    }   
  }
  
  */

  const buscarEmail = async email => {
    console.log('Buscar Email');
    let reqs = await fetch(
      serverConfig.urlRootNode + `buscarPorEmail/${email}`,
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
    // console.log('resposta:', res[0]);
    if (res === 'Falha' || res === 'Não encontrou') {
      // if (res[0] == undefined || res == 'Falha'){
      return '';
    } else {
      return res;
    }
  };

  const buscarVeiculo = async userID => {
    console.log('Buscar Email');
    let reqs = await fetch(
      serverConfig.urlRootNode + `buscarVeiculo/${userID}`,
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

    console.log('res:', res);
    if (res !== 'Falha' && res !== 'Não encontrou') {
      console.log('encontrou!');
    } else {
      console.log('não encontrou!');
    }
    return res;
  };

  const redirecionamentoLogin = async email => {
    try {
      const objUsuario = await buscarEmail(email);
      if (objUsuario == 'Não encontrou') {
        navigation.navigate('Como_Comecar', {email: email});
      } else if (objUsuario == 'Falha') {
        console.log('Algo inesperado aconteceu, tente novamente!');
        Alert.alert('Algum erro ocorreu', 'Tente entrar novamente...', [
          // { text: "OKs", onPress: () => verificarConexao()}
        ]);
      } else {
        const objVeiculo = await buscarVeiculo(objUsuario[0].id);
        if (objUsuario[0].motorista == true && objVeiculo != 'Não encontrou') {
          // navigation.navigate("ModoMotorista");
          navigation.navigate('MenuTeste');
        } else if (
          objUsuario[0].motorista == true &&
          objVeiculo == 'Não encontrou'
        ) {
          console.log('navegando para a tela de cadastro de veículo');
          // console.log('informações:', nome, cpf, data_nasc, num_cel, universidade, email_banco);
          navigation.navigate('Forms_Motorista_Veiculo', {trocaDeModo: true});
        } else {
          navigation.navigate('MenuTeste');
          // navigation.navigate("ModoPassageiro");
        }
      }
    } catch (error) {
      if (error.code == 'auth/missing-identifier') {
        console.log('missing identifier!');
      }
      setFalhaLogin(true);
      Alert.alert('Algum erro ocorreu', 'Tente entrar novamente...', [
        // { text: "OKs", onPress: () => verificarConexao()}
      ]);
      console.log('erro no redirecionamento');
    }
  };

  // const redirecionamentoLogin = async(email)=>{
  //   try{
  //     firestore().collection('Users').where('email', '==', email).get().then(querySnapshot=>{
  //       const valor = querySnapshot.docs;
  //       console.log('--------------------------------------\n');
  //       console.log('printando valor:', valor);
  //       console.log('--------------------------------------\n');
  //       const motorista = (valor == "" || valor == undefined)? '' : valor[0].data().motorista;
  //       const cadastro_veiculo = (valor == "" || valor == undefined)? '' : valor[0].data().nome_veiculo;
  //       const nome = (valor == "" || valor == undefined)? '' : valor[0].data().nome;
  //       const cpf = (valor == "" || valor == undefined)? '' : valor[0].data().CPF;
  //       const data_nasc = (valor == "" || valor == undefined)? '' : valor[0].data().data_nasc;
  //       const num_cel = (valor == "" || valor == undefined)? '' : valor[0].data().num_cel;
  //       const universidade = (valor == "" || valor == undefined)? '' : valor[0].data().universidade;
  //       const email_banco = (valor == "" || valor == undefined)? '' : valor[0].data().email;
  //       console.log('informações:', nome, cpf, data_nasc, num_cel, universidade, email_banco);
  //       if (valor == ""){
  //         if (email_banco != ''){
  //           navigation.navigate("Como_Comecar", {email: email});
  //         }else{
  //           setFalhaLogin(true);
  //         }
  //       }
  //       else{
  //         if (motorista == true && cadastro_veiculo!=''){
  //           // navigation.navigate("ModoMotorista");
  //           navigation.navigate("MenuTeste");
  //         }else if (motorista == true && cadastro_veiculo == ''){
  //           console.log('navegando para a tela de cadastro de veículo');
  //           console.log('informações:', nome, cpf, data_nasc, num_cel, universidade, email_banco);
  //           navigation.navigate('Forms_Motorista_Veiculo', {trocaDeModo:true});
  //         } else{
  //           navigation.navigate("MenuTeste");
  //           // navigation.navigate("ModoPassageiro");
  //         }
  //       }
  //     })
  //   }catch(error){
  //     if (error.code == 'auth/missing-identifier'){
  //       console.log('missing identifier!');
  //     }
  //     setFalhaLogin(true);
  //     Alert.alert(
  //       "Algum erro ocorreu",
  //       "Tente entrar novamente...",
  //       [
  //         // { text: "OKs", onPress: () => verificarConexao()}
  //       ]
  //     );
  //     console.log('erro no redirecionamento');
  //   }
  // }

  const SignInToken = async () => {
    let token = await AsyncStorage.getItem('token');
    let email = await AsyncStorage.getItem('email');
    let password = await AsyncStorage.getItem('password');
    if (email == null) {
      setFalhaLogin(true);
    }
    try {
      if (token != null) {
        auth().signInWithCustomToken(token);
        await redirecionamentoLogin(email);
      } else if (email != null && password != null) {
        auth().signInWithEmailAndPassword(email, password);
        await redirecionamentoLogin(email);
      }
    } catch (error) {
      if (error.code == 'auth/missing-identifier') {
        console.log('missing identifier!');
      }
      console.log('erro no login automático');
      setFalhaLogin(true);
    }
  };

  //travar o botão voltar para evitar repetição indesejada da splash screen
  useEffect(() => {
    SignInToken();
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }, [falhaLogin]);

  return (
    <SafeAreaView>
      {falhaLogin && (
        <>
          <StatusBar barStyle={'light-content'} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              height: height * 0.3,
              width: width,
            }}>
            <Image
              source={require('../../assets/images/driver-car.png')}
              style={{
                height: height * 0.5,
                width: width,
                marginTop: 0,
                backgroundColor: 'white',
              }}
            />
          </View>
          <View Style={{width: width, backgroundColor: 'white'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: height * 0.038,
                backgroundColor: 'white',
                height: height * 0.3,
                width: width,
                fontWeight: 'bold',
                color: '#06444C',
                lineHeight: height * 0.055,
                marginTop: height * 0.06,
              }}>
              Caronas Universitárias, o{'\n'}
              seu app universitário!
            </Text>
          </View>
          <View
            style={{height: height, width: width, backgroundColor: '#ffffff'}}>
            <View
              Style={{
                height: height * 0.04,
                width: width,
                backgroundColor: '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.btnCadastrar}
                onPress={() => navigation.navigate('Cadastro_Inicio')}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: height * 0.026,
                    fontWeight: 'bold',
                    color: 'white',
                    alignItems: 'center',
                  }}>
                  Cadastre-se
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                // onPress={()=>{
                //   testeBanco();
                // }}
                style={{alignSelf: 'center'}}>
                <Text style={styles.txtBtnEntrar}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

export default Entrada;

const styles = StyleSheet.create({
  btnCadastrar: {
    backgroundColor: '#FF5F55',
    borderRadius: width * 0.05,
    padding: 10,
    width: width * 0.85,
    height: height * 0.064,
    alignItems: 'center',
    alignSelf: 'center',
  },
  txtBtnEntrar: {
    paddingTop: height * 0.0005,
    fontSize: height * 0.02,
    fontWeight: '700',
    lineHeight: height * 0.2,
    color: '#FF5F55',
    alignItems: 'center',
    textAlign: 'center',
  },
});
