import React, {useEffect, useState} from 'react';
import { Text, View, Image, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import estilos from '../../estilos/estilos';

/*
  tentar inserir dados no firestore usando o UID, fica mais fácil depois pra fazer as operações de CRUD - João;
*/

function Perfil_Conta({navigation}){
  // const {token} = route.params;
  // const [profile, setProfile] = useState({} as Profile);
  
  // async function loadProfile() {
  //   const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${token}`);
  //   const userInfo = await response.json();
  //   setProfile(userInfo);
  // }
  // useEffect(()=>{
  //   loadProfile();
  // },[]);

  //   //CORRIGIR ESTILOS

  const returnName = async()=>{
    return documentSnapshot.get('nome');
  }

  //funciona
  const dadosBD = async()=>{
    const teste = auth().currentUser.uid;
    console.log('teste:', teste);

    firestore().collection('Passageiro').doc(teste).set({
      nome: 'JOAOZAO',
   }).then(()=>{
      // firestore().collection('Motorista').add({
      //     nome: nome,
      //     CPF: CPF,
      //     data_nasc: data_nasc,
      //     num_cel: num_cel,
      //     universidade: universidade,
      //     email: route.params?.email
      // });
      // navigation.navigate('MenuPrincipal');
      console.log('adicionou');
  });
    // const uid = 'sjKdq8kUoJCSiAT3iwOJ';
    // firestore().collection('Passageiro').doc(uid).get().then(doc=>{
    //   if (doc && doc.exists){
    //     const nome = doc.data().nome;
    //     console.log(nome);
    //   }
    // })

    // firestore().collection('Passageiro').get().then(querySnapshopt=>{
    //   console.log('Total users: ', querySnapshopt.size);

    //   querySnapshopt.forEach(documentSnapshot =>{
    //     console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //   })
    // })
  }


  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
        {/* <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}> */}
          <View style={[estilos.styleOne, {flex:0, backgroundColor:'white', height: '100%'}]}>
            <View style={estilos.retangulo}>
              <Text style={estilos.Style2}>Perfil</Text>
              {/* <Image source={{uri: profile.picture}} */}
              {/* style={estilos.imgPerfil}/> */}
              {/* <Text style={estilos.textoUsuario}>{profile.name}</Text> */}
            </View>
            <Text style={{position: 'absolute', left: 25, top: 200, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Avaliação</Text>
              <Text style={{position: 'absolute', left: 40, top: 230, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Avaliações</Text>
              <Text style={{position: 'absolute', left: 40, top: 260, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Feedback</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 290, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Preferências</Text>
              <Text style={{position: 'absolute', left: 40, top: 320, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Alterar senha</Text>
              <Text style={{position: 'absolute', left: 40, top: 350, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Notificações</Text>
              <Text style={{position: 'absolute', left: 40, top: 380, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Endereço</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 410, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
              <Text style={{position: 'absolute', left: 40, top: 440, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Métodos de pagamento</Text>
              <Text style={{position: 'absolute', left: 40, top: 470, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Dinheiro</Text>
            <Text style={{position: 'absolute', left: 25, right: 259, top: 500, fontWeight: '700', fontSize: 15, lineHeight: 15, color: '#06444C'}}>Sobre</Text>
              <Text style={{position: 'absolute', left: 40, top: 530, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Ajuda</Text>
              <Text style={{position: 'absolute', left: 40, top: 560, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Termos de uso</Text>
              <Text style={{position: 'absolute', left: 40, top: 590, fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'}}>Licença</Text>      
            <TouchableOpacity 
              style={{backgroundColor: 'red', width: 100, height:45, justifyContent: 'center', borderRadius: 15}}
              onPress={dadosBD}  
            >
              <Text style={{color:'white', textAlign: 'center'}}>Teste BD</Text>
            </TouchableOpacity>
          </View>
    {/* </View> */}
    </SafeAreaView>
  );
}

export default Perfil_Conta;
