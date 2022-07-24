import React from 'react';
import {View, Text, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';

function Como_Comecar({navigation, route}) {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
          <View style={{backgroundColor: '#FFF', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{position:'absolute', top: 78, fontWeight: '700', fontSize: 24, lineHeight: 29, color:'#06444C', textAlign:'center'}}>Como você quer{'\n'}começar?</Text>
            <TouchableOpacity 
              style={{position: 'absolute', width: 315, height: 39, top: 222, backgroundColor: '#FF5F55', borderRadius: 12, justifyContent: 'center'}}
              onPress={()=>navigation.navigate('Forms_Passageiro', {email: route.params?.email, senha: route.params?.senha})}  
            >
              <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 16, lineHeight: 20, color:'white'}}>Sou passageiro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{position: 'absolute', width: 315, height: 39, top: 300, backgroundColor: '#FF5F55', borderRadius: 12, justifyContent: 'center'}}
              onPress={()=>navigation.navigate('Forms_Motorista', {email: route.params?.email, senha: route.params?.senha})}  
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