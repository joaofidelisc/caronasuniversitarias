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
//   import { Node } from '@babel/types';
//   import { NavigationContainer } from '@react-navigation/native';
//   import { createStackNavigator } from '@react-navigation/stack';
//   import React,{useState} from 'react';
//   import estilos from '../../estilos/estilos'
  


// function CustomRatingBar() {

//   const [defaultRating, setDefaultRating] = useState(2); 
//   const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
//   const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png'
//   const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png'



//   //componentizar aqui!
//   return (
//     <View style={estilos.CustomRatingBarStyle}>
//       {
//         maxRating.map((item, key) => {
//           return(
//             <TouchableOpacity
//               activeOpacity={0.7}
//               key={item}
//               onPress={() => setDefaultRating(item)}
//             >
//               <Image
//                 style={estilos.StarImgStyle}
//                 source={
//                   item <= defaultRating
//                     ? {uri: starImgFilled}
//                     : {uri:starImgCorner}
//                 }
//               />
//             </TouchableOpacity>
//           );
//         })
//       }
//     </View>
//   );
// }
//   <CustomRatingBar/>

// export default function Classificacao({navigation, route}){

//   const [texto,setTexto]=useState("")
//   const [defaultRating, setDefaultRating] = useState(2); 
//   const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
//   const starImgFilled = '../assets/star_filled.png'
//   const starImgCorner = '../assets/star_corner.png'

//   const uidMotorista = route.params?.uidMotorista;
  

//     return(
//         <View>
//        <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10, marginHorizontal:15}}>
//         Como foi sua viagem?</Text>
//         <Text style={{fontSize:20, color:'#c0c0c0', paddingHorizontal:20, fontWeight:'normal',marginHorizontal:15}}>
//         Feedback sobre como foi sua experiência durante a viagem</Text>
//         <TextInput
//         style={{

//           borderWidth:1, 
//           borderColor:'#000', 
//           alignItems:'center', 
//           padding:18,
//           borderTopRightRadius:20, 
//           borderTopLeftRadius:20,
//           borderBottomRightRadius:20,
//           borderBottomLeftRadius:20,
//           borderBottomStartRadius:20,
//           borderBottomEndRadius:20,
//           borderTopLeftRadius:20,
//           borderTopRightRadius:20,
//           marginHorizontal:20,
          
//         }}
//         value={texto}
//         onChangeText={text=>setTexto(text)}
//         autoCapitalize="words"
//         allowFontScaling={true}
//         caretHidden={false}
//         blurOnSubmit={true}
      
//       />
//       <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:20, marginHorizontal:15}}>
//         Classifique o motorista!</Text>
//       <View style={estilos.CustomRatingBarStyle}>
//       {
//         maxRating.map((item, key) => {
//             <TouchableOpacity
//               activeOpacity={0.7}
//               key={item}
//               onPress={() => setDefaultRating(item)}
//             >
//               <Image
//                 style={estilos.StarImgStyle}
//                 source={
//                   item <= defaultRating
//                     ? {uri: starImgFilled}
//                     : {uri:starImgCorner}
//                 }
//               />
//             </TouchableOpacity>

//         })
//       }
      
//       <CustomRatingBar/>
//     </View>
  
      
//       <View style={{ 
//         flexDirection:'row',
//         backgroundColor:'cd5c5c',
//         alignItems:'center',
//         justifyContent:'center',
//         marginTop:100
//         }}>
//         <Button
//           title="Finalizar"
//           color={'#cd5c5c'}
//           onPress={()=>navigation.navigate('Buscar')}
//         />
//       </View>  
//     </View>

//     );
// }

import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, TextInput, TouchableOpacity} from 'react-native';

function Classificacao({navigation, route}){
    const [descricaoViagem, setDescricaoViagem] = useState('');

    const classificarMotorista = async()=>{
      console.log('classificando motorista...');
      navigation.navigate('Buscar')
    }

    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: 24, lineHeight:29, top: 52}}>Como foi sua viagem?</Text>
          <Text style={{color:'#C4C4C4', fontWeight:'600', fontSize: 16, lineHeight:20, marginTop: 64, width: 292, textAlign: 'center'}}>Feedback sobre como foi sua experiência durante a viagem.</Text>
          <TextInput
              style={{width: 315, height: 80, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth: 1, color:'black', marginTop: 15}}
              placeholderTextColor='gray'
              placeholder='Digite aqui sua avaliação...'
              keyboardType='default'
              onChangeText={(descricaoViagem)=>setDescricaoViagem(descricaoViagem)}
          />
          <Text style={{color:'#06444C', fontWeight:'700', fontSize: 24, lineHeight:29, marginTop: 52}}>Classifique o(a) motorista</Text>
          <TouchableOpacity
            style={{backgroundColor: '#FF5F55', width: 240, height: 47, alignItems: 'center', alignSelf:'center', borderRadius: 15, justifyContent: 'center', marginTop: 100}}
            onPress={classificarMotorista}
          >
            <Text style={{color: 'white', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center'}}>
              Finalizar
            </Text>
          </TouchableOpacity>
          {/* <Image source={
            require('../../assets/images/message.png')} 
            style={{height:350, width: 350, position: 'absolute', top: 220, alignSelf: 'center'}}  
          /> */}
          {/* <Text style={{color:'#06444C', position: 'absolute', top:570, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>
            E aí, o que está esperando?
          </Text>
          <Text style={{color:'#06444C', position: 'absolute', top:610, left: 24, fontWeight:'500', fontSize: 18, lineHeight:24, textAlign: 'center'}}>
            Procure já por uma carona ou ofereça{'\n'} uma para destinos próximos!
          </Text> */}
        </View>
      </SafeAreaView>
    );
}

export default Classificacao;

  

      
