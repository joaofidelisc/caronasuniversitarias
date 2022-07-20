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
  import React,{useState} from 'react';
  import estilos from '../../estilos/estilos'

export default function TelaInfos({navigation}){
    return(
        <View>
        <View style={{fontsize:15, color:'#dc143c'}}>
        <Image
          source={require('../Buscar/perfil.png')}
          style={{resizeMode:'center',width:60, height:60, padding:35, paddingVertical:50, marginHorizontal:135, marginVertical:0}}
        />
        <Text style={estilos.TextoCiano}>Nome do motorista</Text>
        <TouchableOpacity
          style={{backfaceVisibility:'visible'}}
          onPress={()=>navigation.navigate('home')}
        >
        <Text style={estilos.TextoCiano2}>Entrar em contato</Text>
        </TouchableOpacity>
        </View>
        <Text style={estilos.TextoCiano3}>Veículo</Text>
        <Text style={estilos.TextoCiano3}>Placa</Text>

        <Text style={estilos.TextoCiano4}>Classificação</Text>
        <Image
          source={require('../Buscar/star.png')}
          style={{resizeMode:'center',width:110, height:110, padding:35, paddingVertical:50, marginHorizontal:110, marginVertical:0}}
        />
    </View>
    );
}