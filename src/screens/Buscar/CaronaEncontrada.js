import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, StyleSheet, CameraRoll} from 'react-native';

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';


function Options({navigation, route}) {

    const [vetorMotoristas, setMotoristas] = useState([]);    

    const currentUser = auth().currentUser.uid;
    
    const cidade = route.params?.cidade;
    const estado = route.params?.estado;


    /*
    Função responsável por definir o vetor de motoristas e atualizar em tempo real conforme mais caronas forem oferecidas.
    */
    async function getDadosMotorista(){
      let listaCaronas = '';
      let arrayUIDs = [];
      let jaExiste = false;
      if (jaExiste == true){
        jaExiste = false;
      }
      const reference = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
      try{
        reference.on('value', function(snapshot){
          if (snapshot.exists() && snapshot.val().ofertasCaronas != undefined){
            listaCaronas = snapshot.val().ofertasCaronas;
          }
          arrayUIDs = listaCaronas.split(', ');
          arrayUIDs.forEach(async uid =>{
            if (vetorMotoristas.length == 0){
              setMotoristas([{
                url: await recuperarFotoMotorista(uid),
                uid: uid,
                nome: await recuperarNomeMotorista(uid),
                carro:'ATUALIZAR',
                placa:'ATUALIZAR',
              }])
            }else{
              vetorMotoristas.some(motorista=>{
                if (motorista.uid == uid){
                  jaExiste = true;
                }
              })
              if (!jaExiste){
                setMotoristas([...vetorMotoristas, {
                  url: await recuperarFotoMotorista(uid),
                  uid: uid,
                  nome: await recuperarNomeMotorista(uid),
                  carro:'ATUALIZAR',
                  placa:'ATUALIZAR',
                }])
              }
            }
          });
        })
      } catch(error){
        console.log('error.code:', error.code);
      }
    }



  //Função responsável por recuperar o nome do motorista e atualizar no vetor;
  async function recuperarNomeMotorista(motoristaUID){
    let nomeMotorista = '';
    let docRef = firestore().collection('Users').doc(motoristaUID);
    return docRef.get().then((doc)=>{
      if (doc.exists){
        nomeMotorista = doc.data().nome;
        return nomeMotorista;
      }else{
        return '';
      }
    })
  }


  //Função responsável por receber um UID e retornar a url para a imagem do motorista.
  const recuperarFotoMotorista = async(motoristaUID)=>{
    const uidMotorista = motoristaUID;
    var caminhoFirebase = uidMotorista.concat('Perfil');    
    var url = '';
    try{
      url = await storage().ref(caminhoFirebase).getDownloadURL();
    } catch (error){
      if (error.code == 'storage/object-not-found'){
        url = await storage().ref('user_undefined.png').getDownloadURL(); 
      }
    }
   return url;
  }


  //Função responsável por recusar carona. O ato de recusar carona de um motorista, implica em remover o seu UID do banco de dados e do vetor corrente de motoristas.
  function recusarCarona(motoristaUID){
    let totalOfertas = '';
    let arrayOfertasRestantes = [];
    let ofertasRestantes = '';

    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
      reference_passageiro.once('value').then(snapshot=>{
        if (snapshot.exists() && snapshot.val().ofertasCaronas != undefined){
          totalOfertas = snapshot.val().ofertasCaronas;
        }
        if (totalOfertas != '' || totalOfertas.split(', ').length>1){
          arrayOfertasRestantes = totalOfertas.split(', ');
          if (totalOfertas.includes(motoristaUID)){
            arrayOfertasRestantes.splice(arrayOfertasRestantes.indexOf(motoristaUID), 1);
            ofertasRestantes = arrayOfertasRestantes.join(', ');
            reference_passageiro.update({
              ofertasCaronas: ofertasRestantes,
            })
            vetorMotoristas.some(motorista=>{
              if (motorista.uid == motoristaUID){
                vetorMotoristas.splice(vetorMotoristas.indexOf(motorista), 1);
              }
            })
          }
        }else{
          console.log('entrou aqui!!!');
          setMotoristas([]);
        }
      })
    }catch(error){
      console.log('error.code', error.code);
    }
    console.log('Carona recusada!');
  }

  //Função responsável por complementar a função abaixo.
  //Escreve no banco do motorista o UID do passageiro.
  function aceitarCarona_(uidMotorista){
    const reference_motorista = database().ref(`${estado}/${cidade}/Motoristas/${uidMotorista}`);
    try{
        reference_motorista.update({        
        caronasAceitas:currentUser,
      });
    
    }catch(error){
        console.log('ERRO:', error.code);
    }
    navigation.navigate('CaronaEncontrada');
  }
  
  //Função responsável por aceitar carona - escreve no banco do banco do passageiro o uid do motorista e reseta o vetor de ofertas de caronas;
  //Além disso, invoca a função aceitarCarona_ (complementar desta), que é responsável por escrever no banco do motorista o uid do passageiro;
  function aceitarCarona(uidMotorista){
    const reference_passageiro = database().ref(`${estado}/${cidade}/Passageiros/${currentUser}`);
    try{
        reference_passageiro.update({        
        caronasAceitas:uidMotorista,
        ofertasCaronas:''
      });
      navigation.navigate('CaronaEncontrada');
    }catch(error){
        console.log('ERRO:', error.code);
    }
    aceitarCarona_(uidMotorista);
  }
    
  
  useEffect(()=>{
    getDadosMotorista();
  }, [vetorMotoristas]);

    return (
       <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} />
          <Image source={
              require('../../assets/images/carona-encontrada.png')} 
              style={{height:450, width: 450, alignSelf: 'center', top: -80}}  
          />
          <Text style={{color:'#06444C', left: 24, fontWeight:'700', fontSize: 20, lineHeight:24, textAlign:'left', top: -120}}>Carona encontrada!</Text>
          <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 20, lineHeight:24, textAlign:'left', top: -110}}>Motoristas disponíveis:</Text>
   
          <ScrollView style={[styles.scrollView,{top:-100}]}>
          {
            vetorMotoristas.map((motorista, uid)=>(
              <>
              <View style={styles.viewMotoristas}
                  // key={motorista.uid}
                  >
                  <Image 
                    source={{
                      uri: motorista.url
                    }}
                    style={{height:70, width: 70, borderRadius: 100, marginBottom:10, alignSelf:'center', marginTop: 18}}  
                  />
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Nome: {motorista.nome}</Text>
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Carro:{motorista.carro}</Text>
                  <Text style={{color:'#06444C', left: 24, fontWeight:'600', fontSize: 18, textAlign:'left'}}>Placa:{motorista.placa}</Text>
                  <View style={{flexDirection:'row', alignSelf:'center'}}>
                  <TouchableOpacity
                    style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop:10, marginRight: 20}}
                    onPress={()=>{aceitarCarona(motorista.uid)}}
                  >
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                      Aceitar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: '#FF5F55', width: 80, height: 25, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 10}}
                    onPress={()=>{recusarCarona(motorista.uid)}}
                    >
                    <Text style={{color: 'white', fontWeight: '600', fontSize: 16, lineHeight: 24, textAlign: 'center'}}>
                      Recusar
                    </Text>
                  </TouchableOpacity>
                  </View>
                </View>
                </>
            ))
          }
            <Text style={styles.text}>
            
            {'\n\n\n\n'}
            {'\n\n\n\n\n'}
            </Text>
          </ScrollView>
    </SafeAreaView>
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