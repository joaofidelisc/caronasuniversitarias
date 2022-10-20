import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, PermissionsAndroid, Dimensions, Modal} from 'react-native';
import database from '@react-native-firebase/database';
import MapView, { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";


import Geolocation from '@react-native-community/geolocation';
import storage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('screen');


function AguardandoMotorista({navigation, route}){
    const [motoristaAcaminho, setMotoristaAcaminho] = useState(false);
    const [posicaoMotorista, setPosicaoMotorista] = useState(null);
    const [posicaoPassageiro, setPosicaoPassageiro] = useState(null);

    const cidade = route.params?.cidade;
    const estado = route.params?.estado;
    const uidMotorista = route.params?.uidMotorista;
    const currentUser = route.params?.currentUser;

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
                if (snapshot.val().includes(currentUser)){
                    setMotoristaAcaminho(true);
                }
            }
        })
    }
    
    const distanciaPassageiroMotorista = async()=>{
        const latitudePassageiro = posicaoPassageiro.latitude;
        const longitudePassageiro = posicaoPassageiro.longitude;
        const latitudeMotorista = posicaoMotorista.latitude;
        const longitudeMotorista = posicaoMotorista.longitude;
        let distancia = 0;
        var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        R = 6371,
        dLat = deg2rad(latitudePassageiro - latitudeMotorista),
        dLng = deg2rad(longitudePassageiro - longitudeMotorista),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(latitudeMotorista))
            * Math.cos(deg2rad(latitudeMotorista))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distancia = ((R * c *1000).toFixed());
            return distancia;
        }

    const passageiroAbordo = async()=>{
        const reference = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
        const distancia = distanciaPassageiroMotorista();
        // if (distancia <= 2){
        //     try{
        //         reference.set
        //     }catch(error){
        //         console.log();
        //     }
        // }

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
    
    const getDadosMotorista = async(uidMotorista)=>{
        console.log('obtendo dados motorista...')
    }

    useEffect(()=>{
        getMyLocation();
        getPosicaoMotorista();
        motoristaMeBuscando();
        passageiroAbordo();
    }, [motoristaAcaminho])

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
                    // tappable={false}
                    onPress={()=>{
                        getDadosMotorista(uidMotorista);
                    }}

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