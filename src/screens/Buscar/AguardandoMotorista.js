import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, PermissionsAndroid, Dimensions, Modal} from 'react-native';
import database from '@react-native-firebase/database';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import storage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('screen');


function AguardandoMotorista({navigation, route}){
    const [motoristaAcaminho, setMotoristaAcaminho] = useState(false);
    const [posicaoMotorista, setPosicaoMotorista] = useState(null);

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
    
    function getPosicaoMotorista(){
        const reference = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
        try{
            reference.on('value', function(snapshot){
                console.log('latitudeMotorista:', snapshot.val().latitudeMotorista);
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
        getPosicaoMotorista();
        motoristaMeBuscando();
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
                region={posicaoMotorista}
                zoomEnabled={true}
                minZoomLevel={17}
                showsUserLocation={true}
                loadingEnabled={true}
                onRegionChange={getPosicaoMotorista}
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
                    
                    // icon={
                    //     caronista.caronasAceitas==''?require('../../assets/icons/caronista.png'):caronista.caronasAceitas.includes(currentUser)?require('../../assets/icons/carona_aceita.png'):require('../../assets/icons/caronista-nao-clicavel.png')
                    // }
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