import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

//mudar de lugar isso dps
//
import config from '../../config';
import Geocoder from 'react-native-geocoding';
//

function Options({navigation, route}) {

    const [nomeMotorista, setNomeMotorista] = useState('');
    const [uidMotorista, setUidMotorista] = useState('');
    const currentUser = auth().currentUser.uid;
    const [imageUser, setImageUser] = useState('');
    // const [recusouCarona, setRecusouCarona] = useState(false);

    const cidade = route.params?.cidade;
    const estado = route.params?.estado;

    const buscaMotorista = async()=>{
      // const currentUser = auth().currentUser.uid;
      // console.log('Rodou!');
      // if (!recusouCarona){
      try{
        database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`).on('value', function(snapshot){
          if (snapshot.val().ofertasCaronas != ''){
            setUidMotorista(snapshot.val().ofertasCaronas);
            recuperarFotoMotorista(snapshot.val().ofertasCaronas);
            try{
              // console.log('Entrou no segundo!');
              firestore().collection('Users').doc(snapshot.val().ofertasCaronas).onSnapshot(documentSnapshot=>{
                if (documentSnapshot.exists == true){
                  setNomeMotorista(documentSnapshot.data().nome)
                }
                // console.log(documentSnapshot.data());
            });
            }catch(error){
              console.log(error.code);
            }
          }
        })
      } catch(error){
        console.log('Error', error.code);
      }
      // }
  }

  function escreverBancoMotorista(){
    console.log('Escrevendo no banco de motorista');
    const reference_motorista = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
    try{
      reference_motorista.update({        
        caronasAceitas:currentUser,
      });
   
    }catch(error){
      console.log('ERRO:', error.code);
    }
  }
  
  function aceitarCarona(){
    console.log('Carona aceita!');
    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference_passageiro.update({        
        caronasAceitas:uidMotorista,
      });
      navigation.navigate('CaronaEncontrada');
    }catch(error){
      console.log('ERRO:', error.code);
    }
    escreverBancoMotorista();
  }
  
  
  //avisar motorista que a carona foi recusada pelo usuário x (?);
  //voltar para a tela de buscando carona
  //tratar banco de dados
  function recusarCarona(){
    // setRecusouCarona(true);
    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference_passageiro.update({        
        ofertasCaronas:'',
      });
      // navigation.navigate('CaronaEncontrada');
      navigation.navigate('Buscando_Carona', {recusou: true});
    }catch(error){
      console.log('ERRO:', error.code);
    }
    // database().ref(`Passageiros/${currentUser}`).update({
    //   ofertasCaronas: ''
    // });
    console.log('Carona recusada!');
  }

  const recuperarFotoMotorista = async(userUID)=>{
    const uidMotorista = userUID;
    var caminhoFirebase = uidMotorista.concat('Perfil');    
    var url = '';
    try{
      url = await storage().ref(caminhoFirebase).getDownloadURL();
      setImageUser(url); 
    } catch (error){
      if (error.code == 'storage/object-not-found'){
        url = await storage().ref('user_undefined.png').getDownloadURL(); 
        setImageUser(url); 
      }
    }
  }
  
  // //mudar de lugar isso dps
  // const geolocalizacaoTeste = async()=>{
  //   console.log('testando geolocalização!');
  //   Geocoder.init(config.googleAPI, {language:'pt-BR'});
  //   var cidade = (await Geocoder.from(-21.98104, -47.89139)).results[0].address_components[1].short_name;
  //   var estado = (await Geocoder.from(-21.98104, -47.89139)).results[0].address_components[3].short_name;
  //   console.log(cidade, estado);
  //   // console.log((await Geocoder.from(-21.98104, -47.89139)).results[0].address_components);
  //   // Geocoder.from(-21.98104, -47.89139)
	// 	// .then(json => {
  //   //     		var addressComponent = json.results[0].address_components[0];
	// 	// 	console.log(addressComponent);
	// 	// })
	// 	// .catch(error => console.warn(error));
  // }


  useEffect(()=>{
    console.log('Tela: CaronaEncontrada!');
    console.log('estado:', estado, 'cidade:', cidade);
    buscaMotorista();
  }, [])

    return (
       <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} />
          <Image source={
              require('../../assets/images/carona-encontrada.png')} 
              style={{height:450, width: 450, alignSelf: 'center', top: -80}}  
          />
          <Text style={{color:'#06444C', left: 24, fontWeight:'700', fontSize: 20, lineHeight:24, textAlign:'left', top: -120}}>Carona encontrada!</Text>
          <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 20, lineHeight:24, textAlign:'left', top: -110}}>Motoristas disponíveis:</Text>
          {/* <TouchableOpacity 
            style={{backgroundColor:'black', top:-100, alignSelf:'center'}}
            onPress={geolocalizacaoTeste}  
          >
            <Text>Geolocalização</Text>
          </TouchableOpacity> */}
        <ScrollView style={[styles.scrollView,{top:-100}]}>
          <View style={styles.viewMotoristas}>
            <Image 
              source={
                imageUser!=''?{uri:imageUser}:null}
                style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
            />
            {
              nomeMotorista &&
              <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Nome: {nomeMotorista}</Text>
            }
            <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Carro:</Text>
            <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Placa:</Text>
            <View style={{flexDirection:'row', alignSelf:'center'}}>
            <TouchableOpacity
              style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10, marginRight: 20}}
              onPress={()=>{aceitarCarona()}}
              >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                Aceitar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 10}}
              
              // onPress={()=>navigation.navigate('ConfirmarSolicitacao', {nomeDestino: nomeDestino, localDestino: localDestino})}
              // onPress={getLocalPassageiro}
              // onPress={()=>{setModalVisible(true)}}
              onPress={()=>{recusarCarona()}}
              >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                Recusar
              </Text>
            </TouchableOpacity>
              </View>
          </View>

          {/* <View style={styles.viewMotoristas}>
            <Image 
              source={
                imageUser!=''?{uri:imageUser}:null}
                style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
            />
            {
              nomeMotorista &&
              <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Nome: {nomeMotorista}</Text>
            }
            <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Carro:</Text>
            <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Placa:</Text>
            <View style={{flexDirection:'row', alignSelf:'center'}}>
            <TouchableOpacity
              style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10, marginRight: 20}}
              onPress={()=>{aceitarCarona()}}
              >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                Aceitar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 10}}
              
              // onPress={()=>navigation.navigate('ConfirmarSolicitacao', {nomeDestino: nomeDestino, localDestino: localDestino})}
              // onPress={getLocalPassageiro}
              // onPress={()=>{setModalVisible(true)}}
              onPress={()=>{recusarCarona()}}
              >
              <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                Recusar
              </Text>
            </TouchableOpacity>
              </View>
          </View> */}
         
          
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
    </SafeAreaView>
      // <SafeAreaView style={styles.container}>
      //   <StatusBar barStyle={'light-content'} />
      //   {/* <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}> */}
      //     <ScrollView style={styles.scrollView}>
      //     <Image source={
      //       require('../../assets/images/carona-encontrada.png')} 
      //       style={{height:450, width: 450, position: 'absolute', top: 0, alignSelf: 'center'}}  
      //     />

    
      //     <Text style={{color:'#06444C', position: 'absolute', top:400, left: 24, fontWeight:'700', fontSize: 20, lineHeight:24, textAlign:'left'}}>Carona encontrada!</Text>
      //     <Text style={{color:'#06444C', position: 'absolute', top:426, left: 24, fontWeight:'600', fontSize: 20, lineHeight:24, textAlign:'left'}}>Motoristas disponíveis:</Text>
      //     {
      //       nomeMotorista &&
      //       <Text style={{color:'#06444C', position: 'absolute', top:452, left: 24, fontWeight:'600', fontSize: 20, lineHeight:24, textAlign:'left'}}>Nome: {nomeMotorista}</Text>
      //     }
      //     <TouchableOpacity
      //       style={{position: 'absolute', backgroundColor: '#FF5F55', top: 500, width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
            
      //       // onPress={()=>navigation.navigate('ConfirmarSolicitacao', {nomeDestino: nomeDestino, localDestino: localDestino})}
      //       // onPress={getLocalPassageiro}
      //       // onPress={()=>{setModalVisible(true)}}
      //       onPress={()=>{aceitarCarona()}}
      //     >
      //       <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
      //         Aceitar
      //       </Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       style={{position: 'absolute', backgroundColor: '#FF5F55', top: 560, width: 280, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center'}}
            
      //       // onPress={()=>navigation.navigate('ConfirmarSolicitacao', {nomeDestino: nomeDestino, localDestino: localDestino})}
      //       // onPress={getLocalPassageiro}
      //       // onPress={()=>{setModalVisible(true)}}
      //       onPress={()=>{recusarCarona()}}
      //     >
      //       <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
      //         Recusar
      //       </Text>
      //     </TouchableOpacity>
      //     </ScrollView>
      //   {/* </View> */}
      // </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    // backgroundColor: 'white',
    // flex: 1,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 42,
  },
  viewMotoristas:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 330, 
    height: 220, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    alignSelf:'center', 
    marginTop: 10
  }
});


export default Options;

// import {
//     Text,
//     View, 
//     FlatList,
//     TouchableOpacity ,
//     StyleSheet, 
//     Image, 
//     Button, 
//     Modal,
//     Alert, 
//     ImageBackground, 
//     SafeAreaView, 
//     ScrollView, 
//     StatusBar,
//     TextInput,
//     RefreshControl
//   } 
//   from 'react-native';
//   import React,{useState} from 'react';
//   import estilos from '../../estilos/estilos'

// export default function Options({navigation}){

//     const [visivel,setVisivel]=useState(true)

//   const infos=[{
//     id:'001',
//     desc:[" Guilherme", ' 2']
//   },
//   {
//     id:'002',
//     desc:[' Josefânia Alves', ' 3']
//   },
//   {
//     id:'003',
//     desc:[' Astolfo Nunes', ' 4']
//   },
// ]

//     return(
//         <SafeAreaView>
//       <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10}}>
//         Você recebeu oferta(s) de carona!</Text>
//       <View style={estilos.botao2}>
//         <Button
//           title="Mostrar lista "
//           color={'#2f4f4f'}
//           onPress={()=>{setVisivel(true)}}
//         />
//       </View>
//       <Modal 
//         animationType="none"
//         transparent={true}
//         visible={visivel}
//         style={{}}
//       >
//       <View style={{
//         backgroundColor:`#cd5c5c`,
//         margin:0,
//         marginTop:110,
//         marginVertical:90,
//         padding:10,
//         borderRadius:20,
//         elevation:10

//       }}>
//       <Button
//         title="Fechar Lista "
//         color={'#c0c0c0'}
//         onPress={()=>{setVisivel(false)}}
//       />
//       <FlatList
//         data={infos}
//         keyExtractor={item=>item.id}
//         renderItem={
//           ({item})=><View style={estilos.itens}>
//                       <Text style={estilos.itens}>Motorista:{item.desc[0]}  Vagas:{item.desc[1]}
//                     <View>
//           <TouchableOpacity
//             style={{backfaceVisibility:'visible'}}
//             onPress={()=>navigation.navigate('CaronaEncontrada')}
//           >
//           <Text style={estilos.textstyle}>                    Confirmar</Text>
//           </TouchableOpacity>
//           </View>
//           <View style={{fontsize:15, color:'#dc143c'}}>
//           <TouchableOpacity
//             style={{backfaceVisibility:'visible'}}
//             onPress={()=>navigation.navigate('Procurar')}
//           >
//           <Text style={estilos.textstyle}>                    Negar</Text>
//           </TouchableOpacity>
//           </View>
//           </Text>
//           </View>
//         }
//         />
//       </View>
//       </Modal>  
//     </SafeAreaView>

//     );
// }