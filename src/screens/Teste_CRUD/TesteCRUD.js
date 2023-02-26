import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth'
// import WebSocket from 'react-native-websocket';

import serverConfig from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function TesteCRUD() {
  const [coordenadas, setCoordenadas] = useState(null);      
   
    const atualizarCoordenadas = (userId, coordenadas)=>{
      console.log('typeOFUSERID:', typeof(userId));
      console.log('atualizarCoordenadas');
      let reqs = fetch(serverConfig.urlRootNode+'coordenadas',{
       method: 'PUT',
       headers:{
         'Accept':'application/json',
         'Content-type':'application/json',
         'user-id': userId
       },
       body: JSON.stringify(coordenadas)
     }).then(res => res.json()).then(data=> console.log(data)).catch(error => console.log(error))
    }

    // useEffect(() => {
    //   const ws = new WebSocket('ws://localhost:8080');
    //   ws.onopen = () => {
    //     console.log('Conexão estabelecida com o websocket');
    //   };
    //   ws.onmessage = (event) => {
    //     setCoordenadas(JSON.parse(event.data));
    //   };
    //   return () => {
    //     ws.close();
    //   }
    // }, []);

    useEffect(() => {
      const ws = new WebSocket(`ws://192.168.15.165:8080?user-id=0VtQXRifF8PdbcKCrthdOtlnah12`);
  
      ws.onopen = () => {
        console.log('Conexão estabelecida com o websocket');
      };
  
      ws.onmessage = (event) => {
        setCoordenadas(JSON.parse(event.data));
      };
  
      ws.onclose = () => {
        console.log('Conexão fechada com o websocket');
      };
  
      ws.onerror = (error) => {
        console.log(`Erro na conexão com o websocket: ${error.message}`);
      };
  
      return () => {
        ws.close();
      }
    }, []);
    
    //----------------------------------------------------
    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          {/* <WebSocket
            url="ws://192.168.15.165:8080"
            headers={{'user-id': '0VtQXRifF8PdbcKCrthdOtlnah12'}}
            onOpen={() => console.log('WebSocket connection opened')}
            onClose={() => console.log('WebSocket connection closed')}
            onMessage={(event) => setCoordenadas(event.data)}
            onError={(error) => console.log(error)}
          /> */}
          <Text style={{color:'black', fontSize: width*0.05}}>Coordenadas:{coordenadas}</Text>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            // onPress={()=>{console.log('Teste!')}}  
            onPress={()=>{
              atualizarCoordenadas("0VtQXRifF8PdbcKCrthdOtlnah12", { coordenadas:{lat: -23.567, lng: -46.789 }});
            }}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Coordenadas</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default TesteCRUD