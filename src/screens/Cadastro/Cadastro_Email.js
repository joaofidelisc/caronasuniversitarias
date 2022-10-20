import React, {useState, useEffect} from 'react';
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
  BackHandler,
  Image
} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';

// incluir aqui dominios permitidos (válido para email e autenticação com Google)
const dominios_permitidos = ["estudante.ufscar.br"];

GoogleSignin.configure({
  webClientId: '97527742455-7gie5tgugbocjpr1m0ob9sdua49au1al.apps.googleusercontent.com',
});

function Cadastro_Email({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [warning, setWarning] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('randomRandomrandomRR');
  const [tokenEmailEnviado, setTokenEmailEnviado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(true);

  const VerificationCode = async() =>{
    if (email == ''){
      setWarning('O campo e-mail \nnão pode estar vazio!');
      setModalVisible(true);
    }
    else{
      console.log('current user:', email);
      console.log(auth().currentUser);
      await auth().currentUser.sendEmailVerification().then(()=>{
        setWarning('Um novo código de verificação foi enviado para');
        setModalVisible(true);
      }).catch(error =>{
        console.log(error.code);
      })
    }
    // else{
    // }
  }

  
  const InsertUserWithEmail = async() =>{
    if (email == '' && password == ''){
      setWarning('Os campos de e-mail e senha\n não podem estar vazios!');
      setModalVisible(true);
    }
    else if (email == ''){
      setWarning('O campo e-mail \nnão pode estar vazio!')
      setModalVisible(true);
    }
    else if (password == ''){
      setWarning('O campo senha \nnão pode estar vazio!')
      setModalVisible(true);
    }
    else{
      if (tokenEmailEnviado == false){
        const dominio = email.split("@")
        if (dominios_permitidos.includes(dominio[1]) == false){
          setWarning('Você pode se cadastrar\n apenas com e-mails institucionais!');
          setModalVisible(true);
        }
        else{
          auth().createUserWithEmailAndPassword(email, password).then((result) => {
            setEmailCadastro(email);
            result.user.sendEmailVerification();
            setTokenEmailEnviado(true);
            setWarning('Verifique seu e-mail para prosseguir.\nApós confirmar, faça login para continuar.');
            setModalVisible(true);
          }).catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              setWarning('Este email já está em uso, escolha outro!')
              setModalVisible(true);
            }
            if (error.code === 'auth/invalid-email') {
              setWarning('E-mail inválido!')
              setModalVisible(true);
            }
          });
        }
      }
      else{
        if (auth().currentUser.emailVerified == false){
          setWarning('Link de verificação enviado.\nVerifique e faça login para continuar.');
          setModalVisible(true);
        }
      }
    }
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
        <View style={{backgroundColor: '#FFF', height: '100%'}}>
          <TouchableOpacity 
              style={styles.btnFechar}
              onPress={()=>navigation.navigate('Entrada')}
          >
             <Image source={
              require('../../assets/icons/close.png')} 
              style={{height:22, width: 22}}  
            />
          </TouchableOpacity>
          <Text style={{color: '#06444C', position: 'absolute', top: 65, fontWeight: '700', fontSize: 20, lineHeight: 29, alignSelf: 'center', textAlign: 'center'}}>Digite um e-mail institucional{'\n'}  e uma senha para se cadastrar</Text>
          <TextInput
            style={{width: 291, height: 47, top: 167, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 18, lineHeight: 22, borderWidth:1, color:'black'}}
            placeholderTextColor='black'
            placeholder='Digite aqui o e-mail'
            keyboardType='email-address'
            onChangeText={(email)=>setEmail(email)}
            />
          <TextInput
            style={{width: 291, height: 47, top: 200, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 18, lineHeight: 22, borderWidth:1, color:'black'}}
            placeholderTextColor='black'
            placeholder='Digite aqui a senha'
            secureTextEntry={senhaVisivel}
            onChangeText={(password)=>setPassword(password)}
          />
          <TouchableOpacity 
            style={{top: 205, left: 265}}
            onPress={()=>{setSenhaVisivel(!senhaVisivel)}}
          >
            <Text style={{color: 'black'}}>Ver senha</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{position: 'absolute', width: 291, height: 47, top: 352, backgroundColor: '#FF5F55', borderRadius: 15, alignSelf: 'center', justifyContent: 'center'}}
            onPress={InsertUserWithEmail}
            >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 20, lineHeight: 24, textAlign: 'center'}}>Continuar</Text>
          </TouchableOpacity>
          <Text style={{color:'#FF5F55', position: 'absolute', top: 460, alignSelf:'center', fontWeight: '600', fontSize: 15}}>Perdeu o código de autenticação?</Text>
          {/* <TouchableOpacity 
            style={{position: 'absolute', width: 210, height: 45, top: 500, backgroundColor: '#FF5F55', borderRadius: 15, alignSelf: 'center', justifyContent: 'center'}}
            onPress={VerificationCode}
            >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 15, lineHeight: 24, textAlign: 'center'}}>Obter novo código</Text>
          </TouchableOpacity> */}
          <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>{warning}</Text>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Entendi</Text>
                    </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  btnFechar:{
    position: 'absolute',
    width: 14,
    height: 29,
    left: 22,
    top: 20,
  },
  txtBtnFechar:{
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 29,
    alignItems: 'center',
    color: '#FF5F55',
  },
});

export default Cadastro_Email;
