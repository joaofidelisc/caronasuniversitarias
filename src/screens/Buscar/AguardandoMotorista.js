import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, PermissionsAndroid, Dimensions, Modal} from 'react-native';
import database from '@react-native-firebase/database';
import MapView, { Marker, Callout } from 'react-native-maps';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from '@react-native-community/geolocation';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('screen');


function AguardandoMotorista({navigation, route}){
    const [motoristaAcaminho, setMotoristaAcaminho] = useState(false); //Utilizado para definir se o motorista está a caminho do passageiro;
    const [posicaoMotorista, setPosicaoMotorista] = useState(null); //Utilizado para atualizar a posição do motorista em tempo real;
    const [posicaoPassageiro, setPosicaoPassageiro] = useState(null); //Utilizado para atualizar a posição do passageiro em tempo real;
    const [viagemEmAndamento, setViagemEmAndamento] = useState(null); //Utilizado para definir se a viagem começou ou não.

    const cidade = route.params?.cidade;
    const estado = route.params?.estado;
    const uidMotorista = route.params?.uidMotorista;
    const currentUser = route.params?.currentUser;
    const nomeMotorista = route.params?.nomeMotorista;
    const veiculoMotorista = route.params?.veiculoMotorista;
    const placaVeiculoMotorista = route.params?.placaVeiculoMotorista;
    const urlMotorista = route.params?.urlIMG;

    /*
      Função responsável por solicitar ao passageiro para ligar sua localização.
    */
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

    /*
      Função responsável por definir se o motorista está indo até o passageiro ou não.
      OBS: Ainda não foi foi utilizada em alguma funcionalidade desta tela.
    */
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
      
    /*
      Função responsável para navegar para a tela de Viagem Em Andamento, passando os parâmetros necessários.
    */
    const navigateToViagemEmAndamento = async()=>{
      if (viagemEmAndamento){
        // await AsyncStorage.removeItem('AguardandoMotorista');
        // await AsyncStorage.setItem('ViagemEmAndamento', true);
        navigation.navigate('ViagemEmAndamento', {uidMotorista: uidMotorista, currentUser: currentUser, cidade: cidade, estado: estado, nomeMotorista: nomeMotorista, veiculoMotorista: veiculoMotorista, placaVeiculoMotorista: placaVeiculoMotorista, urlMotorista: urlMotorista});
      }
    }

    /*
      Função responsável por definir se a viagem foi iniciada ou não;
      A viagem é definida como iniciada para um caronista, quando ele está a bordo do veículo;
      Quando a viagem é iniciada, o aplicativo redirecionada para a tela de Viagem Em Andamento.
    */
    const viagemIniciada = async()=>{
        const reference = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
        try{
          reference.on('value', function(snapshot){
            if (snapshot.child('caronistasAbordo').exists()){
              if (snapshot.val().caronistasAbordo.includes(currentUser) && !viagemEmAndamento){
                setViagemEmAndamento(true);
                navigateToViagemEmAndamento();
              }else{
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
    
    /*
      Função responsável por atualizar o local do caronista em tempo real.
    */
    const atualizaEstado = ()=>{
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

    /*
      Função responsável por obter a posição do passageiro em tempo real.
    */
    const getMyLocation = ()=>{
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


    /*
      Função responsável por testar se o banco de dados do motorista foi removido;
      OBS: Esta tela estava dando erro ao apagar o banco dos motoristas.
    */
    const bancoRemovido = ()=>{
      let filhoRemovido = '';
      try{
        database().ref().child(`${estado}/${cidade}/Motoristas`).on('child_removed', function(snapshot){
          filhoRemovido = snapshot.key;
          if (filhoRemovido == uidMotorista){
            console.log('BANCO REMOVIDO DENTRO DA FUNÇÃO:', filhoRemovido);
            return true;
          }
        })
      }catch(error){
        console.log('erro em bancoRemovido')
      }
      return false;
    }
    
    /*
      Função responsável por obter a posição do motorista em tempo real.
    */
    const getPosicaoMotorista = ()=>{
      const bancoFoiRemovido = bancoRemovido(uidMotorista);  
      const reference = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
      if (bancoFoiRemovido == false){
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
    }

    
    useEffect(()=>{
        getMyLocation();
        getPosicaoMotorista();
        motoristaMeBuscando();
        viagemIniciada();
    });

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