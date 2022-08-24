import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal, TextInput} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import estilos from '../../estilos/estilos';

import FotoPerfil from '../../components/Perfil/FotoPerfil';
import auth, { firebase } from '@react-native-firebase/auth'


function Perfil_Conta({navigation}){
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [aviso, setAviso] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // //falta implementar aqui
  // const signOutGoogle = async() =>{
  //   GoogleSignin.signOut().then(()=>{
  //     console.log('saiu');
  //   }).catch(error =>{
  //     // console.log(error.code);
  //     setWarning('Algum erro ocorreu.');
  //     setModalVisible(true);
  //   })
  // }


  const changePassword = async()=>{
    setAviso('Digite a senha atual e a nova')
    setAlterarSenha(true);
    setModalVisible(true);
    const senha_atual = await auth().currentUser.uid;
    console.log(senha_atual);

  }

  const notificacoes = async()=>{

  }

  const endereco = async()=>{
    
  }

  useEffect(()=>{
    console.log('Perfil_Conta');
  })
  
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
          <View style={[estilos.styleOne, {flex:0, backgroundColor:'white', height: '100%'}]}>           
            <View style={estilos.retangulo}>
              <FotoPerfil/>
            </View>
            <Text style={[estilos.Style2, {color:'white', fontSize: 15}]}>Perfil</Text>
            <Text style={{position: 'absolute', left: 25, top: 200, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Avaliação</Text>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 230}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Avaliações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 260}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Feedback</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 290, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Preferências</Text>
              <TouchableOpacity 
                style={{position: 'absolute', left: 40, top: 320}}
                onPress={changePassword}
                >
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Alterar senha</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 350}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Notificações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 380}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Endereço</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 410, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 440}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Métodos de pagamento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 470}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
              </TouchableOpacity>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 500, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Sobre</Text>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 530}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Ajuda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 560}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Termos de uso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{position: 'absolute', left: 40, top: 590}}>
                <Text style={{fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Licença</Text>      
              </TouchableOpacity>
            <TouchableOpacity 
              style={[estilos.TouchbleOpct1, {top:640}]}
              // onPress={}
            >
              <Text style={estilos.Text14}>Sair</Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
            >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>{aviso}</Text>
                    {
                      alterarSenha &&
                      <>
                        <TextInput
                        style={{width: 200, height: 40, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 15, borderWidth: 1, color:'black'}}
                        placeholderTextColor='black'
                        placeholder='Senha atual'
                        secureTextEntry={true}
                        onChangeText={(password)=>setPassword(password)}
                        />
                         <TextInput
                        style={{width: 200, height: 40, alignSelf: 'center', borderRadius: 15, fontWeight: '400', fontSize: 15, borderWidth: 1, color:'black', marginTop: 15, marginBottom: 15}}
                        placeholderTextColor='black'
                        placeholder='Nova senha'
                        secureTextEntry={true}
                        onChangeText={(newPassword)=>setNewPassword(newPassword)}
                        />

                      </>
                      
                    }
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Confirmar</Text>
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

export default Perfil_Conta;
