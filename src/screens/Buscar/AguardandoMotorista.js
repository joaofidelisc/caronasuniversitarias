import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, PermissionsAndroid, Dimensions, Modal} from 'react-native';
import database from '@react-native-firebase/database';
import MapView, { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Geolocation from '@react-native-community/geolocation';
import storage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('screen');


function AguardandoMotorista({navigation, route}){
    const [motoristaAcaminho, setMotoristaAcaminho] = useState(false);
    const [posicaoMotorista, setPosicaoMotorista] = useState(null);
    const [posicaoPassageiro, setPosicaoPassageiro] = useState(null);
    const [viagemEmAndamento, setViagemEmAndamento] = useState(null);

    const cidade = route.params?.cidade;
    const estado = route.params?.estado;
    const uidMotorista = route.params?.uidMotorista;
    const currentUser = route.params?.currentUser;
    const nomeMotorista = route.params?.nomeMotorista;
    const veiculoMotorista = route.params?.veiculoMotorista;
    const placaVeiculoMotorista = route.params?.placaVeiculoMotorista;
    const motoristaUrl = route.params?.urlIMG;
    const nomeDestino = route.params?.nomeDestino;

    //Função responsável por solicitar ao motorista para ligar sua localização.
    const localizacaoLigada = async()=>{
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2 style='color: #0af13e'>Usar localização</h2><br/>Deseja permitir que o aplicativo <b>Caronas Universitárias</b> acesse a sua localização?<br/><br/>",
            ok: "Permitir",
            cancel: "Negar",
            enableHighAccuracy: true, 
            showDialog: true,
            openLocationServices: true, 
            preventOutSideTouch: false,
            preventBackClick: false, 
            providerListener: false
        }).catch((error) => {
            console.log(error.message); // error.message => "disabled"
        });
    }

    const motoristaMeBuscando = async()=>{
        const reference = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}/buscandoCaronista`);
        reference.on('value', function(snapshot){
          if (snapshot.exists()){
            if (snapshot.val().includes(currentUser) && !motoristaAcaminho){
              setMotoristaAcaminho(true);
            }
          }
        })
      }
      
    
    const navigateToViagemEmAndamento = async()=>{
      const reference_motorista = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
      if (viagemEmAndamento){
        reference_motorista.off();
        // await AsyncStorage.removeItem('AguardandoMotorista');
        // await AsyncStorage.setItem('ViagemEmAndamento', true);
        navigation.navigate('ViagemEmAndamento', {uidMotorista: uidMotorista, currentUser: currentUser, cidade: cidade, estado: estado, nomeMotorista: nomeMotorista, veiculoMotorista: veiculoMotorista, placaVeiculoMotorista: placaVeiculoMotorista, motoristaUrl: motoristaUrl, nomeDestino: nomeDestino});
      }
    }

    const viagemIniciada = async()=>{
        const reference = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
        try{
          reference.on('value', function(snapshot){
            if (snapshot.child('caronistasAbordo').exists()){
              if (snapshot.val().caronistasAbordo.includes(currentUser) && !viagemEmAndamento){
                setViagemEmAndamento(true);
                navigateToViagemEmAndamento();
              }else{
                console.log('viagem ainda não começou!');
                if (viagemEmAndamento){
                  navigateToViagemEmAndamento();
                }
              }  
            }
          })
        }catch(error){
          console.log('erro em viagemIniciada');
        }

    }
    

    function atualizaEstado(){
        const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
        try{
          reference.update({
            latitudePassageiro: posicaoPassageiro.latitude,
            longitudePassageiro: posicaoPassageiro.longitude,
            ativo: true,
           });
         }catch(error){
           console.log('atualizaEstado, ERRO:', error.code);
         }
       }

    function getMyLocation(){
        try{
          Geolocation.getCurrentPosition(info=>{
            setPosicaoPassageiro({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            })
          },
          ()=>{console.log('Atualizando...')}, {
            enableHighAccuracy:false,
            timeout:2000,
          })
          atualizaEstado();
        }catch(error){
          console.log(error.code);
        }
      }
    
    function getPosicaoMotorista(){
      const reference = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
      try{
        reference.on('value', function(snapshot){
          setPosicaoMotorista({
            latitude: snapshot.val().latitudeMotorista,
            longitude: snapshot.val().longitudeMotorista,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          })
        })
      }catch(error){
          console.log('erro em getPosicaoMotorista');
      }
    }

    // useEffect(()=>{
    //   const defineEstadoAtual = async()=>{
    //     await AsyncStorage.removeItem('CaronaEncontrada');
    //     await AsyncStorage.setItem('AguardandoMotorista', 'true');
    //   }
    //   defineEstadoAtual().catch(console.error);
    // }, [])
    
    useEffect(()=>{
        getMyLocation();
        getPosicaoMotorista();
        motoristaMeBuscando();
        viagemIniciada();
    }, [motoristaAcaminho, viagemEmAndamento])

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          {
            posicaoMotorista &&
            <MapView
                onMapReady={()=>{
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                    .then(()=>{
                    console.log('Permissão aceita');  
                    localizacaoLigada();
                    })
                }}
                style={{width:width, height:height, flex:1}}
                region={posicaoPassageiro}
                zoomEnabled={true}
                minZoomLevel={17}
                showsUserLocation={true}
                loadingEnabled={true}
                onRegionChange={getMyLocation}
                initialRegion={{
                latitude: -21.983311,
                longitude: -47.883154,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    key={uidMotorista}
                    coordinate={{ latitude : posicaoMotorista.latitude , longitude : posicaoMotorista.longitude}}
                    tappable={false}
                    icon={
                        require('../../assets/icons/motorista.png')
                    }
                />
                {/* {
                //utilizado para traçar a rota
                destination &&
                <MapViewDirections
                    origin={region}
                    destination={destination}
                    apikey={config.googleAPI}
                    strokeWidth={3}
                    strokeColor='#FF5F55'
                    />
                } */}
            </MapView>
          }
        </View>
      </SafeAreaView>
    );
}

export default AguardandoMotorista;