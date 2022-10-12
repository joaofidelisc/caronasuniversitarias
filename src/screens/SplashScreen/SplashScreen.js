import React from "react";
import Lottie from 'lottie-react-native';
import { View, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

const {height, width}= Dimensions.get('screen')

export function Splash(){

    const navigation = useNavigation()

    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'white', padding:20}}>
        <Lottie 
            style={{height:height, width:width}}
            source={require('../../assets/JSON/splash3.json')} 
            autoPlay 
            autoSize={false}
            loop = {false}
            speed = {1}
            onAnimationFinish={()=> navigation.navigate('Entrada')}
        /> 
        </View>
)
}
