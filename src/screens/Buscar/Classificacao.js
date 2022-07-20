import {
    Text,
    View, 
    FlatList,
    TouchableOpacity ,
    StyleSheet, 
    Image, 
    Button, 
    Modal,
    Alert, 
    ImageBackground, 
    SafeAreaView, 
    ScrollView, 
    StatusBar,
    TextInput,
    RefreshControl
  } 
  from 'react-native';
  import { Node } from '@babel/types';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import React,{useState} from 'react';
  import estilos from '../../estilos/estilos'
  


function CustomRatingBar() {

  const [defaultRating, setDefaultRating] = useState(2); 
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png'
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png'

  return (
    <View style={estilos.CustomRatingBarStyle}>
      {
        maxRating.map((item, key) => {
          return(
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}
            >
              <Image
                style={estilos.StarImgStyle}
                source={
                  item <= defaultRating
                    ? {uri: starImgFilled}
                    : {uri:starImgCorner}
                }
              />
            </TouchableOpacity>
          );
        })
      }
    </View>
  );
}
  <CustomRatingBar/>

export default function Classificacao({navigation}){

  const [texto,setTexto]=useState("")
  const [defaultRating, setDefaultRating] = useState(2); 
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const starImgFilled = '../assets/star_filled.png'
  const starImgCorner = '../assets/star_corner.png'


    return(
        <View>
       <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10, marginHorizontal:15}}>
        Como foi sua viagem?</Text>
        <Text style={{fontSize:20, color:'#c0c0c0', paddingHorizontal:20, fontWeight:'normal',marginHorizontal:15}}>
        Feedback sobre como foi sua experiência durante a viagem</Text>
        <TextInput
        style={{

          borderWidth:1, 
          borderColor:'#000', 
          alignItems:'center', 
          padding:18,
          borderTopRightRadius:20, 
          borderTopLeftRadius:20,
          borderBottomRightRadius:20,
          borderBottomLeftRadius:20,
          borderBottomStartRadius:20,
          borderBottomEndRadius:20,
          borderTopLeftRadius:20,
          borderTopRightRadius:20,
          marginHorizontal:20,
          
        }}
        value={texto}
        onChangeText={text=>setTexto(text)}
        autoCapitalize="words"
        allowFontScaling={true}
        caretHidden={false}
        blurOnSubmit={true}
      
      />
      <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:20, marginHorizontal:15}}>
        Classifique o motorista!</Text>
      <View style={estilos.CustomRatingBarStyle}>
      {
        maxRating.map((item, key) => {
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}
            >
              <Image
                style={estilos.StarImgStyle}
                source={
                  item <= defaultRating
                    ? {uri: starImgFilled}
                    : {uri:starImgCorner}
                }
              />
            </TouchableOpacity>

        })
      }
      
      <CustomRatingBar/>
    </View>
  
      
      <View style={{ 
        flexDirection:'row',
        backgroundColor:'cd5c5c',
        alignItems:'center',
        justifyContent:'center',
        marginTop:100
        }}>
        <Button
          title="Finalizar"
          color={'#cd5c5c'}
          onPress={()=>navigation.navigate('Procurar')}
        />
      </View>  
    </View>

    );
}

  

      
