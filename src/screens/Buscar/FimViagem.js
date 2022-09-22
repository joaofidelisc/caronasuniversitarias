import {
    Text,
    View, 
    FlatList,
    TouchableOpacity ,
    StyleSheet, 
    Image, 
    Button, 
    Modal,
    Alert, 
    ImageBackground, 
    SafeAreaView, 
    ScrollView, 
    StatusBar,
    TextInput,
    RefreshControl
  } 
  from 'react-native';
  import { Node } from '@babel/types';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import React,{useState} from 'react';
  import estilos from '../../estilos/estilos'
  
  export default function CaronaEncontrada({navigation}){
    return(
        <SafeAreaView>
      <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10}}>
        Você encontrou sua carona!</Text>
      <Image
        source={require('../../assets/icons/checkcar.png')}
        // source={require('../Buscar/checkcar.png')}
        style={{resizeMode:'center',width:100, height:100, padding:70, paddingVertical:100, marginHorizontal:100, marginVertical:15}}
      />
      <Modal 
        animationType="none"
        transparent={true}
        
        style={estilos.modal}
      >
      <View style={estilos.modal}>
        <Text style={estilos.itens}> Motorista:</Text>
        <Text style={estilos.itens}> Veículo:</Text>
        <TouchableOpacity
          style={{backfaceVisibility:'visible'}}
          onPress={()=>navigation.navigate('InfosMotorista')}
          >
          <Text style={{fontWeight:'bold', color:'#c0c0c0', marginTop:10}}>Entrar em contato com o motorista</Text>      
        </TouchableOpacity>
      </View>
      <View style={{margintop:200}}> 
      <Button 
        
        title='Confirmar fim da viagem'
        color={'#cd5c5c'}
        onPress={()=>navigation.navigate('Classificacao')}
        
      />
      </View> 
     </Modal>
    </SafeAreaView>
    );

}