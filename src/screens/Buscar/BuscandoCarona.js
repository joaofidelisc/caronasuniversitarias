import React from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Button} from 'react-native';

function BuscandoCarona({navigation}) {
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
        <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10}}>
          Buscando caronas para você. Isso pode levar alguns minutos...
        </Text>
        <Image
            source={require('../Procurar/carropesquisa.png')}
            style={{resizeMode:'center',width:100, height:100, padding:70, paddingVertical:80, marginHorizontal:100, marginVertical:1}}
        />
        <Text style={{fontSize:20, color:'#c0c0c0', paddingHorizontal:10, fontWeight:'normal',marginVertical:35 }}>
          Exibiremos uma lista de propostas assim que possível!
        </Text>
        <Button 
          title='Exibir lista'
          color={'#cd5c5c'}
          onPress={()=>navigation.navigate('Options')}
        />
      </View>
    </SafeAreaView>
  );
}

export default BuscandoCarona;