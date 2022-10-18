import React from "react";
import Lottie from 'lottie-react-native';
import { View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

const {height, width}= Dimensions.get('screen')

export function Splash(){

    const navigation = useNavigation()

    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#F15151', padding:20}}>
        <Lottie 
            style={{height:height*0.35, width:width*0.35}}
            source={require('../../assets/JSON/splash5.json')} 
            autoPlay 
            autoSize={false}
            loop = {false}
            speed = {1}
            onAnimationFinish={()=> navigation.navigate('Entrada')}
        /> 
        </View>
    )
}
