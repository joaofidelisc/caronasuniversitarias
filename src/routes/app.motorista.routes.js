import React, {useEffect} from 'react';
import { BackHandler, Dimensions } from 'react-native';
import { Image } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';

import Buscar from '../screens/Buscar/Buscar';
import Buscando_Carona from '../screens/Buscar/BuscandoCarona';
import Oferecer from '../screens/Oferecer/Oferecer';
import Suas_Viagens from '../screens/Suas_Viagens/Suas_Viagens';
import Mensagens from '../screens/Mensagens/Mensagens';
import Perfil_Conta from '../screens/Perfil/Perfil_Conta';
import Perfil_Detalhes from '../screens/Perfil/Perfil_Detalhes';
import BuscandoCarona from '../screens/Buscar/BuscandoCarona'
import CaronaEncontrada from '../screens/Buscar/CaronaEncontrada';
import AguardandoMotorista from '../screens/Buscar/AguardandoMotorista';
import Classificacao from '../screens/Buscar/Classificacao';
import ConfigurarCarona from '../screens/Oferecer/ConfigurarCarona';
import ViagemEmAndamento from '../screens/Buscar/ViagemEmAndamento';
import ClassificarPassageiro from '../screens/Oferecer/ClassificarPassageiro';
import ViagemMotorista from '../screens/Oferecer/ViagemMotorista';
import RotaPassageiro from './app.passageiro.routes';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// const DrawerNavigationMethod = createDrawerNavigator();

//nested navigation https://www.youtube.com/watch?v=SPzjttByz6E
// const {height, width} = Dimensions.get('screen');

// function RotaBuscandoCarona(){
//   return (
//     <NavigationContainer
//       independent={true}
//     >
//       <Stack.Navigator initialRouteName="Buscar" options={{headerShown:false}}>
//         <Stack.Screen name="Buscar" component={Buscar} options={{headerShown:false}}/>
//         <Stack.Screen name="Buscando_Carona" component={BuscandoCarona} options={{headerShown:false}} />
//         <Stack.Screen name="CaronaEncontrada" component={CaronaEncontrada} options={{headerShown:false}}/>
//         <Stack.Screen name="AguardandoMotorista" component={AguardandoMotorista} options={{headerShown:false}}/>
//         <Stack.Screen name="ViagemEmAndamento" component={ViagemEmAndamento} options={{headerShown:false}}/>
//         <Stack.Screen name="Classificacao" component={Classificacao} options={{headerShown:false}}/>
//       </Stack.Navigator>
//    </NavigationContainer>
//   );
// }

function RotaOferecerCarona(){
  return (
    <NavigationContainer
      independent={true}
    >
      <Stack.Navigator initialRouteName="ConfigurarCarona" options={{headerShown:false}}>
        <Stack.Screen name="ConfigurarCarona" component={ConfigurarCarona} options={{headerShown:false}}/>
        <Stack.Screen name="OferecerCarona" component={Oferecer} options={{headerShown:false}}/>
        <Stack.Screen name="ViagemMotorista" component={ViagemMotorista} options={{headerShown:false}}/>
        <Stack.Screen name="ClassificarPassageiro" component={ClassificarPassageiro} options={{headerShown:false}}/>
      </Stack.Navigator>
   </NavigationContainer>
  );
}

// function RotaTrocaDeModo(){
//   return (
//     <NavigationContainer
//       independent={true}
//     >
//       <Stack.Navigator initialRouteName="Perfil_Conta" options={{headerShown:false}}>
//         <Stack.Screen name="Perfil_Conta" component={Perfil_Conta} options={{headerShown:false}}/>
//         <Stack.Screen name="RotaPassageiro" component={RotaPassageiro} options={{headerShown:false}}/>
//       </Stack.Navigator>
//    </NavigationContainer>
//   );
// }




function RotaPerfil(){
  return(
    <Tab.Navigator 
    initialRouteName='Perfil_Conta'
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#FF5F55',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {position:'absolute', top: '28%'}
    }}  
    >
      <Tab.Screen name="Conta" component={Perfil_Conta} 
        options={{
          tabBarIcon:(({color})=>
          <Image source={
            require('../assets/icons/conta.png')} 
            style={{height:22, width: 22, tintColor:color}}  
          />
            )
        }}
      />
      <Tab.Screen name="Detalhes" component={Perfil_Detalhes} 
        options={{
          tabBarIcon:(({color})=>
          <Image source={
            require('../assets/icons/detalhes.png')} 
            style={{height:22, width: 22, tintColor:color}}  
          />
            )
        }}
      />
    </Tab.Navigator>
  )
}

// function RotaPerfil(){
//   return(
//     // <NavigationContainer independent={true}>
//       <DrawerNavigationMethod.Navigator initialRouteName='Perfil_Detalhes'>
//         <DrawerNavigationMethod.Screen name="Conta" component={Perfil_Conta}/>
//         <DrawerNavigationMethod.Screen name="Detalhes" component={Perfil_Detalhes}/>
//       </DrawerNavigationMethod.Navigator>
//     // </NavigationContainer>
//   )
// }

function AppRoutes({route, navigation}) {
  useEffect(() => {
    BackHandler.addEventListener('backPress', () => true)
    return () => BackHandler.removeEventListener('backPress', () => true)
  }, [])
  return (
    <NavigationContainer
      independent={true}
    >
      <Tab.Navigator 
        initialRouteName='Oferecer'
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF5F55',
          tabBarInactiveTintColor: 'gray'
        }}  
      >
        {/* <Tab.Screen name="Buscar" component={RotaBuscandoCarona} 
          options={{
            tabBarIcon:(({color})=>
            <Image source={
              require('../assets/icons/search.png')} 
              style={{height:22, width: 22, tintColor: color}}  
            />
              )
          }}
        /> */}
        <Tab.Screen name="Oferecer" component={RotaOferecerCarona} 
          options={{
            tabBarIcon:(({color})=>
            <Image source={
              require('../assets/icons/oferecer.png')} 
              style={{height:22, width: 22, tintColor: color}}  
            />
              )
          }}
        />
        <Tab.Screen name="Suas Viagens" component={Suas_Viagens} 
          options={{
            tabBarIcon:(({color})=>
            <Image source={
              require('../assets/icons/viagens.png')} 
              style={{height:22, width: 22, tintColor: color}}  
            />
              )
          }}
        />
        <Tab.Screen name="Mensagens" component={Mensagens} 
          options={{
            tabBarIcon:(({color})=>
            <Image source={
              require('../assets/icons/mensagens.png')} 
              style={{height:22, width: 22, tintColor: color}}  
            />
              )
          }}
        />
        <Tab.Screen name="Perfil" component={RotaPerfil} 
          options={{
            tabBarIcon:(({color})=>
            <Image source={
              require('../assets/icons/perfil.png')} 
              style={{height:22, width: 22, tintColor:color}}  
            />
              )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;