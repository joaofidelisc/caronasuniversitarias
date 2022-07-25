import React, {useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, TouchableOpacity, Alert, BackHandler} from 'react-native';
import auth from '@react-native-firebase/auth';

function Como_Comecar({navigation, route}) {
  const email = route.params?.email;
  const senha = route.params?.senha;
  
  const descartarAlteracoes = async() =>{
    auth().currentUser.delete();
    navigation.navigate('Entrada');
  }

  useEffect(() => {
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
            <Text style={{position:'absolute', top: 78, fontWeight: '700', fontSize: 24, lineHeight: 29, color:'#06444C', textAlign:'center'}}>Como você quer{'\n'}começar?</Text>
            <TouchableOpacity 
              style={{position: 'absolute', width: 315, height: 39, top: 222, backgroundColor: '#FF5F55', borderRadius: 12, justifyContent: 'center'}}
              onPress={()=>navigation.navigate('Forms_Passageiro', {email: email, senha: senha})}  
            >
              <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, lineHeight: 20, color:'white'}}>Sou passageiro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{position: 'absolute', width: 315, height: 39, top: 300, backgroundColor: '#FF5F55', borderRadius: 12, justifyContent: 'center'}}
              onPress={()=>navigation.navigate('Forms_Motorista', {email: email, senha: senha})}  
            >
              <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, lineHeight: 20, color:'white'}}>Sou motorista</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{position:'absolute', top: 537}}>
              <Text style={{fontWeight: '700', fontSize: 16, lineHeight: 20, textAlign: 'center', color:'#06444C'}}>Avançar</Text>
            </TouchableOpacity> */}
          </View>
      </SafeAreaView>
    );
}

export default Como_Comecar;