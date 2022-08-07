import React from 'react';
import {View, Text, SafeAreaView, StatusBar, Image} from 'react-native';

function Mensagens() {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', position: 'absolute', top:100, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Você conseguirá enviar mensagens para{'\n'} passageiros ou motoristas, assim que{'\n'} fizer sua primeira viagem.</Text>
          <Image source={
            require('../../assets/images/message.png')} 
            style={{height:350, width: 350, position: 'absolute', top: 220, alignSelf: 'center'}}  
          />
          {/* <Text style={{color:'#06444C', position: 'absolute', top:570, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>
            E aí, o que está esperando?
          </Text>
          <Text style={{color:'#06444C', position: 'absolute', top:610, left: 24, fontWeight:'500', fontSize: 18, lineHeight:24, textAlign: 'center'}}>
            Procure já por uma carona ou ofereça{'\n'} uma para destinos próximos!
          </Text> */}
        </View>
      </SafeAreaView>
    );
}

export default Mensagens;