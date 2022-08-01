import React from 'react';
import {View, Text, SafeAreaView, StatusBar, Image} from 'react-native';

function Suas_Viagens() {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Image source={
            require('../../assets/images/viagens-futuras.png')} 
            style={{height:300, width: 300, position: 'absolute', top: 10, alignSelf: 'center'}}  
          />
          <Text style={{color:'#06444C', position: 'absolute', top:310, left: 24, fontWeight:'700', fontSize: 20, lineHeight:24}}>Suas viagens futuras{'\n'}aparecerão aqui</Text>
          <Text style={{color: '#C4C4C4', position: 'absolute', top:400, left: 24, fontWeight: '600', fontSize: 14, lineHeight:17}}>
            Encontre a viagem para a sua cidade entre{'\n'}milhares de destinos ou publique sua{'\n'}carona para dividir os custos.
          </Text>
          <Image source={
            require('../../assets/icons/mask-covid.png')} 
            style={{height:60, width: 60, position: 'absolute', top: 522, left:24}}  
          />
          <Text style={{color: '#06444C', position: 'absolute', top:538, left: 84, fontWeight: '600', fontSize: 14, lineHeight:17}}>
           COVID-19: Seja consciente, siga{'\n'} as orientações da universidade!
          </Text>
          <View style={{position: 'absolute', top: 502, width:300, height: 100, left:24, borderWidth:1}}>
          </View>
        </View>
      </SafeAreaView>
    );
}

export default Suas_Viagens;