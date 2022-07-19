import React from 'react';
import {View, Text, SafeAreaView, StatusBar} from 'react-native';

function Suas_Viagens() {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'black'}}>Suas Viagens</Text>
        </View>
      </SafeAreaView>
    );
}

export default Suas_Viagens;