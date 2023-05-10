import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth'
// import WebSocket from 'react-native-websocket';

import serverConfig from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function TesteCRUD() {
  const [coordenadas, setCoordenadas] = useState(null);      
   
  async function buscarCarona(){
    let cidade = "São Carlos";
    cidade = encodeURIComponent(cidade);
    
    let reqs = await fetch(serverConfig.urlRootNode + `buscarCarona/SP/${cidade}/0VtQXRifF8PdbcKCrthdOtlnah12`, {
      method: 'GET',
      mode: 'cors',
      headers:{
        'Accept':'application/json',
        'Content-type':'application/json'
      }
    });
    const res = await reqs.json();
  }
  

    
    //----------------------------------------------------
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'black', fontSize: width*0.05}}>Teste!</Text>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={()=>{
              buscarCarona();
            }}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Teste</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default TesteCRUD