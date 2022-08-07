import React, {useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Button, Image, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import config from '../../config';

const {width, height} = Dimensions.get('screen');


export default function Procurar({navigation}) {

  const [lugar,setLugar]=useState("")

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%',}}>
        {/* <Image
          source={require('../Buscar/carropesquisa.png')}
          style={{resizeMode:'center',width:100, height:100, padding:100, paddingVertical:90, marginVertical:0}}
        /> */}
        <Image source={
          require('../../assets/images/buscar-carona.png')} 
          style={{height:350, width: 350, position: 'absolute', top: 260, alignSelf: 'center'}}  
        />
        <Text style={{fontSize:20, color:'#2f4f4f', paddingHorizontal:70, fontWeight:'bold', position: 'absolute', top: 65}}>Para onde pretende ir?</Text>
        <Text style={{fontSize:15, color:'#c0c0c0', paddingHorizontal:70, fontWeight:'normal', marginVertical:15, position: 'absolute', top: 170, fontWeight: '600'}}>Ex: Universidade fereral de São Carlos</Text>
        {/* <TextInput
          style={{

          borderWidth:1, 
          borderColor:'#000', 
          alignItems:'center', 
          padding:20,
          paddingHorizontal:150,
          paddingVertical:20,
          borderTopRightRadius:15, 
          borderTopLeftRadius:15,
          borderBottomRightRadius:15,
          borderBottomLeftRadius:15,
          borderBottomStartRadius:15,
          borderBottomEndRadius:15,
          borderTopLeftRadius:15,
          borderTopRightRadius:15,
          marginHorizontal:0,
          color:'black'
      
        }}
          value={lugar}
          onChangeText={text=>setLugar(text)}
          autoCapitalize="words"
          allowFontScaling={true}
          caretHidden={false}
          blurOnSubmit={true}
  
        /> */}
        <GooglePlacesAutocomplete
          minLength={2}
          autoFocus={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log(details.geometry.location.lat);
            console.log(details.geometry.location.lng);
            // setDestination({
            //   latitude: details.geometry.location.lat,
            //   longitude: details.geometry.location.lng,
            //   latitudeDelta: 0.0922,
            //   longitudeDelta: 0.0421
            // })
          }}
          query={{
            key: config.googleAPI,
            language: 'pt-br',
          }}
          styles={{
            container: {
              position:'absolute',
              alignItems: 'center',
              top: 120,                   
              width: width,
              justifyContent: 'center',
            },
            textInputContainer: {
              width: 312,
              height: 50,
              borderColor: 'rgba(83, 83, 83, 0.8)',
              borderWidth:2,
              borderRadius: 8,
              backgroundColor: 'white',
            },
            textInput:{
              color: 'black',
            },
            description: {
              color: 'black'
            },
            listView: {
              elevation: 1,
              height: 100,
              width: 312
            },
          }}
        />
        
        <View style={{marginVertical:50}}>
        <TouchableOpacity
          style={{position: 'absolute', backgroundColor: '#FF5F55', top: 260, width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
          onPress={()=>navigation.navigate('Buscando_Carona')}
        >
          <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
            Buscar Carona
          </Text>
        </TouchableOpacity>
        {/* <Button 
          
          title='Buscar Carona'
          color={'#cd5c5c'}
          onPress={()=>navigation.navigate('Buscando_Carona')}
        /> */}
        </View>
        </View>
      </SafeAreaView>
    );
}

