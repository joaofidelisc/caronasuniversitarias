import React from 'react';
import {View, Text, SafeAreaView, StatusBar} from 'react-native';

function Codigo_SMS() {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
          <View style={{backgroundColor: '#FFF', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color:'black'}}>Codigo_SMS</Text>
      </View>
      </SafeAreaView>
    );
}

export default Codigo_SMS;