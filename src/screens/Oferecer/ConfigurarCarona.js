import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, Dimensions, Modal, StyleSheet, Alert} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import config from '../../config';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth'

import EventSource from 'react-native-event-source';

import EstadoApp from '../../services/sqlite/EstadoApp';
// const queryHandler = require('../../services/node-server/index');
import serverConfig from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function ConfigurarCarona({navigation}) {
    const [vagas, setVagas] = useState(1);
    const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false);
    const [localizacaoMotorista, setlocalizacaoMotorista] = useState(null);
    const [nomeDestino, setNomeDestino] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [recuperouEstado, setRecuperouEstado] = useState(false);
    const [definiuEstado, setDefiniuEstado] = useState(false);
    const [aplicativoEstavaAtivo, setAplicativoEstavaAtivo] = useState(true);


    const netInfo = useNetInfo();


    const ligarLocalizacao = async()=>{
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2 style='color: #0af13e'>Usar localização</h2><br/>Deseja permitir que o aplicativo <b>Caronas Universitárias</b> acesse a sua localização?<br/><br/>",
        ok: "Permitir",
        cancel: "Negar",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
          openLocationServices: true, // false => Directly catch method is called if location services are turned off
          preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
          preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
          providerListener: false // true ==> Trigger locationProviderStatusChange listener when the location state changes
        }).then(function(success) {
          setLocalizacaoAtiva(true);
          estadoInicial();
          // console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
        }).catch((error) => {
          setLocalizacaoAtiva(false);  
          console.log(error.message); // error.message => "disabled"
        });
    }

    const estadoInicial = async()=>{
      if (localizacaoAtiva == true){
        try{
          Geolocation.getCurrentPosition(info=>{
            setlocalizacaoMotorista({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            })
          },
          ()=>{
            console.log('erro')}, {
              enableHighAccuracy:false,
              timeout:2000,
            })
          } catch(error){
            console.log(error.code); 
          }
      }
    }
  
    async function defineCidadeEstado(){
      var response = await Geocoder.from(localizacaoMotorista.latitude, localizacaoMotorista.longitude);
      var filtro_cidade = response.results[0].address_components.filter(function(address_component){
        return address_component.types.includes("administrative_area_level_2");
      }); 

      var filtro_estado = response.results[0].address_components.filter(function(address_component){
        return address_component.types.includes("administrative_area_level_1");
      });
      await EstadoApp.removeData(1).then(console.log('dados removidos!')).catch(console.log('algum erro ocorreu!'));
      if (nomeDestino != ''){
        // receberInfoPassageiro(filtro_estado, filtro_cidade);
        await EstadoApp.insertData({cidade: filtro_cidade[0].short_name, estado: filtro_estado[0].short_name, nomeDestino:nomeDestino, uidMotorista:'alterar', nomeMotorista:'alterar', veiculoMotorista:'alterar', placaVeiculoMotorista:'alterar', motoristaUrl:'alterar', numVagas:vagas, passageiros:'atualizar', id:1});
        navigation.navigate('OferecerCarona', {cidade:filtro_cidade[0].short_name, estado:filtro_estado[0].short_name, destino:nomeDestino, vagas:vagas})
      }else{
        setModalVisible(true);
      }

    }

    const receberInfoPassageiro = (estado, cidade)=>{
      //tratar cidade!
      console.log("estado:", estado);
      console.log('receberInfoPassageiro');
      console.log('ENTROU NA FUNÇÃO!!!!\n');
      try{
        const events = new EventSource(`${serverConfig.urlRootNode}api/rabbit/obterInfo/passageiro/${estado}/Sao_Carlos`);
        events.addEventListener('getInfoPassageiro', (event)=>{
          console.log('Atualização informações:\n');
          console.log('event.data:', event.data);
          // let objPassageiro = JSON.parse(event.data);
          // getCaronistasMarker(objPassageiro);
        })
        
      }catch(error){
        console.log(error);
      }
    }


    // const printValor = (valor) => {
    //   console.log('valor:')
    //   console.log(`cidade:${valor.cidade}, estado:${valor.estado}, id:${valor.id}`)
    // }

    // //TESTE BANCO
    // const testeBanco = async()=>{
    //   // await EstadoApp.createTable();
    //   console.log('----------------------------------');
    //   console.log('testando banco...');
    //   console.log('rodando getAll...')
    //   // EstadoApp.updateData(1, {cidade: 'Matão', estado: 'SP', id:1})
    //   // EstadoApp.insertData({cidade: 'São Carlos', estado: 'SP', nomeDestino: 'centro', localDestino: 'centro-2', id:1});
    //   EstadoApp.updateData({uidMotorista: '123456', nomeMotorista: 'joao', veiculoMotorista: 'ferrari', placaVeiculoMotorista: '123456', motoristaUrl: 123456}, 0);

    //   EstadoApp.findData(1).then(info => console.log(info)).catch(err=> console.log(err));
    //   // EstadoApp.getAll().then(info => printValor(info)).catch(err=> console.log(err));
    //   // console.log('rodando getAll2...')
    //   // EstadoApp.getAll2();
    //   // EstadoApp.getData();
    //   // EstadoApp.getData().then(info => info.forEach(c => console.log(c)));
      
    //   // EstadoApp.getData().then( 
    //   //   info => info.forEach( c => printValor(c) )
    //   //   )
    //   console.log('----------------------------------');

    // }
    // //TESTE BANCO
  useEffect(()=>{
    const recuperaEstadoApp = async()=>{
      console.log('rodando recuperaEstadoApp...');
      let Oferecer = await AsyncStorage.getItem("Oferecer");
      let ViagemMotorista = await AsyncStorage.getItem("ViagemMotorista");
      let ClassificarPassageiro = await AsyncStorage.getItem("ClassificarPassageiro");
      
      (Oferecer!=null && Oferecer!=undefined || 
        ViagemMotorista!=null && ViagemMotorista!=undefined ||
        ClassificarPassageiro !=null && ClassificarPassageiro!=undefined
        )?setAplicativoEstavaAtivo(true):setAplicativoEstavaAtivo(false);
        
        //aplicativoEstavaAtivo -> variável utilizada apenas para controlar a tela exibida, ou seja, se o app estava ativo, não exibir tela atual;
        //aguardar para exibir tela enquanto essa variável não é definida.
        if (Oferecer != null && Oferecer != undefined){
          navigation.navigate('OferecerCarona');
        }else if (ViagemMotorista != null && ViagemMotorista !=undefined){
          navigation.navigate('ViagemMotorista');
        }else if (ClassificarPassageiro != null && ClassificarPassageiro != undefined){
          navigation.navigate('ClassificarPassageiro');
        }
        setRecuperouEstado(true);
      }
      if (!recuperouEstado){
        recuperaEstadoApp().catch(console.error);
      }
    })

    useEffect(()=>{
      const defineEstadoAtual = async()=>{
        console.log('rodando defineEstado...');
        await AsyncStorage.removeItem('Oferecer');
      }
      if (!definiuEstado){
        defineEstadoAtual().catch(console.error);
      }
    }, [])

    useEffect(()=>{
      // const netInfo = useNetInfo();
      if (netInfo.isConnected == false){
        Alert.alert(
          "Sem conexão",
          "Para continuar a utilizar o aplicativo, conecte-se à internet!",
          [
            // { text: "OKs", onPress: () => verificarConexao()}
          ]
        );
      }
      // console.log('netInfo:', netInfo);
      // console.log('conectado:', netInfo.isConnected);
    })

    const testeNode = async()=>{

      /*
      ////EXEMPLO DE INSERÇÃO DE DADOS;
      // let reqs = await fetch(serverConfig.urlRootNode+'inserirUsuario',{
      //   method: 'POST',
      //   headers:{
      //     'Accept':'application/json',
      //     'Content-type':'application/json'
      //   },
      //   body: JSON.stringify({
      //     // id: Math.random().toString(),
      //     id: auth().currentUser.uid,
      //     nome: 'Inara Bueno',
      //     CPF:"414.386.918-74",
      //     dataNasc:"1998-06-10",
      //     email:"joao.fidelis@estudante.ufscar.br",
      //     numCel:'(16)99376-4191',
      //     token:'dusahdasdl',
      //     universidade:'UFSCar',
      //     classificacao:4.65,
      //     fotoPerfil:'duasdjasdl',
      //     motorista:true
      //   })
      // });

      // let res = await reqs.json();
      // console.log('req:', res);
      */
     
     //---------------------------------------------------------------------
      
      
      // let reqs = await fetch(serverConfig.urlRootNode+`buscarUsuario/0VtQXRifF8PdbcKCrthdOtlnah12`,{
      //     method: 'GET',
      //     mode: 'cors',
      //     headers:{
      //       'Accept':'application/json',
      //       'Content-type':'application/json'
      //     }
      //   });
        
      //   const res = await reqs.json();
      //   console.log('resposta:', res);
  
      //---------------------------------------------------------------------

      // ATUALIZA UMA INFORMAÇÃO DO BANCO
      let reqs = await fetch(serverConfig.urlRootNode+'atualizarModo',{
        method: 'PUT',
        headers:{
          'Accept':'application/json',
          'Content-type':'application/json'
        },
        body: JSON.stringify({
          id: auth().currentUser.uid,
          motorista:false
        })
      });

      let res = await reqs.json();

      console.log('req:', res);
      // console.log('passou!');


      // console.log()
     
    }

    useEffect(()=>{
      Geocoder.init(config.googleAPI, {language:'pt-BR'});
      ligarLocalizacao();
      console.log('localizacaoMotorista', localizacaoMotorista);
    }, [localizacaoAtiva])

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', fontWeight:'800', fontSize: 20, lineHeight:24, textAlign:'left', marginBottom: 16, marginTop: 30}}>Algumas perguntas importantes...</Text>
          <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, lineHeight:24, textAlign:'left'}}>Qual o seu destino final?</Text>
          <Image source={
            require('../../assets/images/duvidas-oferecer.png')} 
            style={{height:350, width: 350, alignSelf:'center', position: 'absolute', top: 190}}  
          />
          {
             localizacaoMotorista &&
             <GooglePlacesAutocomplete
               minLength={2}
               autoFocus={false}
               fetchDetails={true}
               onPress={(data, details = null) => {
                 setNomeDestino(data.description);
               }}
               textInputProps={{
                 onChangeText: (nomeDestino) =>{
                   setNomeDestino(nomeDestino)
                 }
               }}
               
               query={{
                 key: config.googleAPI,
                 language: 'pt-br',
                 components: 'country:br',
                 location: `${localizacaoMotorista.latitude}, ${localizacaoMotorista.longitude}`, //alterar aqui para coordenadas atuais
                 radius: "15000", //15km
                 strictbounds: true
               }}
         
               GooglePlacesSearchQuery={{
                 rankby: 'distance',
               }}
               styles={{
                 container: {
                  //  position: 'absolute', 
                   alignItems: 'center',
                  //  top: 120,
                   width: width,
                   marginTop: height*0.02,
                 },
                 textInputContainer: {
                   width: width*0.85,
                   height: height*0.06,
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
                   height: height*0.5,
                   width: width*0.85,
                 },
               }}
             />
          }
      
          <Text style={{color:'#06444C', fontWeight:'600', fontSize: 16, lineHeight:24, textAlign:'center', position: 'absolute', top: 530}}>Quantas vagas você tem disponível em seu carro?</Text>
          <View style={{flexDirection:'row', marginTop: 16, marginBottom: 16, position:'absolute', top: 550}}>
          <TouchableOpacity 
              style={{backgroundColor: '#FF5F55', width: 50, height: 30, borderRadius: 15, justifyContent: 'center', alignSelf:'center'}}
              onPress={()=>{
                if (vagas>1){
                  setVagas(vagas-1)}
                }
              }  
            >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 22, lineHeight: 24, textAlign: 'center'}}>-</Text>
            </TouchableOpacity>

            <Text style={{color: '#06444C', fontWeight: '600', fontSize: 16, lineHeight: 24, marginLeft: 10, marginRight: 10, alignSelf: 'center'}}>Vagas: {vagas}</Text>
            
            <TouchableOpacity 
              style={{backgroundColor: '#FF5F55', width: 50, height: 30, borderRadius: 15, justifyContent: 'center', alignSelf:'center'}}
              onPress={()=>{
                if (vagas<4){
                  setVagas(vagas+1)}
                }
              }  
            >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 22, lineHeight: 24, textAlign: 'center', alignSelf:'center'}}>+</Text>
            </TouchableOpacity>
            
            
        
          </View>
          
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 260, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', position: 'absolute', top: 620}}
            onPress={defineCidadeEstado}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Avançar
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 260, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', position: 'absolute', top: 670}}
            onPress={testeNode}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Teste Node
            </Text>
          </TouchableOpacity> */}
          <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, position: 'absolute', top: 190, alignSelf: 'center'}}>
                <View style={styles.modalView}>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15, fontWeight:'600'}}>Informações incompletas</Text>
                    <Text style={{color: 'black', textAlign: 'center', marginBottom: 15}}>Preencha o local de destino antes de prosseguir para a próxima etapa!</Text>
                    <TouchableOpacity
                        style={{backgroundColor:'#FF5F55', width: 200, height: 35, borderRadius: 15, justifyContent: 'center'}}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={{color: 'white', fontWeight:'bold', textAlign: 'center'}}>Entendi</Text>
                    </TouchableOpacity>
              </View>
            </View>
        </Modal>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});

export default ConfigurarCarona;