import React from 'react';
import {View, Text, SafeAreaView, StatusBar} from 'react-native';

function Procurar() {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'black'}}>Procurar</Text>
        </View>
      </SafeAreaView>
    );
}

export default Procurar;