import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, TouchableOpacity, Alert, BackHandler, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Lottie from 'lottie-react-native';

const {height,width} = Dimensions.get('screen')

function Como_Comecar({navigation, route}) {
  const email = route.params?.email;
  const senha = route.params?.senha;
  const userID = auth().currentUser.uid;
  
  const signOutGoogle = async() =>{
    GoogleSignin.signOut().then(()=>{
      // console.log('saiu');
    }).catch(error =>{
      // console.log(error.code);
      setWarning('Algum erro ocorreu.');
      setModalVisible(true);
    })
  }

  const descartarAlteracoes = async() =>{
    // auth().currentUser.delete();
    if (GoogleSignin.isSignedIn){
      signOutGoogle();
    }
    navigation.navigate('Entrada');
  }

  useEffect(() => {
    console.log('email:', email);
    // navigation.navigate('ModoPassageiro', {userID: userID});
    navigation.navigate("MenuTeste");


      const backAction = () => {
        Alert.alert("Descartar alterações", "Tem certeza que deseja voltar e cancelar o cadastro?", [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel"
          },
          { text: "Sim", onPress: () => descartarAlteracoes()}
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, []);
  
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
          <View style={{backgroundColor: '#FFF', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{position:'absolute', top: '10%', fontWeight: '700', fontSize: height*0.03, lineHeight: 29, color:'#06444C', textAlign:'center'}}>Como você quer{'\n'}começar?</Text>
            <TouchableOpacity 
              style={{position: 'absolute', width: '75%', height: '5.2%', top: '28%', backgroundColor: '#FF5F55', borderRadius: 12, justifyContent: 'center'}}
              onPress={()=>navigation.navigate('Forms_Passageiro', {email: email, senha: senha, userID: userID})}  
            >
              <Text style={{textAlign: 'center', fontWeight: '700', fontSize: height*0.02, lineHeight: 20, color:'white'}}>Sou passageiro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{position: 'absolute', width: '75%', height: '5.2%', top: '37%', backgroundColor: '#FF5F55', borderRadius: 12, justifyContent: 'center'}}
              onPress={()=>navigation.navigate('Forms_Motorista', {email: email, senha: senha, userID: userID})}  
            >
              <Text style={{textAlign: 'center', fontWeight: '700', fontSize: height*0.02, lineHeight: 20, color:'white'}}>Sou motorista</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{position:'absolute', top: 537}}>
              <Text style={{fontWeight: '700', fontSize: 16, lineHeight: 20, textAlign: 'center', color:'#06444C'}}>Avançar</Text>
            </TouchableOpacity> */}
             <Lottie 
                style={{height:height*0.35, width:width*0.35, top:'12%'}}
                source={require('../../assets/JSON/car.json')} 
                autoPlay 
                autoSize={false}
                loop = {true}
                speed = {1}
             /> 
          </View>
      </SafeAreaView>
    );
}

export default Como_Comecar;