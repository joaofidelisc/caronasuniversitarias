import React, {useEffect} from 'react';
import { BackHandler, Dimensions } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Buscar from '../screens/Buscar/Buscar';
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

import TesteCRUD from '../screens/Teste_CRUD/TesteCRUD';
import RabbitMQEnviar from '../screens/RabbitMQEnviar/RabbitMQEnviar';
import RabbitMQReceber from '../screens/RabbitMQReceber/RabbitMQReceber';

import Erro from '../screens/Erro/Erro';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import Icon from 'react-native-vector-icons/FontAwesome';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';


const {height, width} = Dimensions.get('screen');
const theme = {
  colors: {
    background: "transparent",
  },
};


function RotaBuscandoCarona(){
  return (
    <NavigationContainer
      independent={true}
    >
      <Stack.Navigator initialRouteName="Buscar" options={{headerShown:false}}>
        <Stack.Screen name="Buscar" component={Buscar} options={{headerShown:false}}/>
        <Stack.Screen name="Buscando_Carona" component={BuscandoCarona} options={{headerShown:false}} />
        <Stack.Screen name="CaronaEncontrada" component={CaronaEncontrada} options={{headerShown:false}}/>
        <Stack.Screen name="AguardandoMotorista" component={AguardandoMotorista} options={{headerShown:false}}/>
        <Stack.Screen name="ViagemEmAndamento" component={ViagemEmAndamento} options={{headerShown:false}}/>
        <Stack.Screen name="Classificacao" component={Classificacao} options={{headerShown:false}}/>
      </Stack.Navigator>
   </NavigationContainer>
  );
}

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


function RotaPerfil(){
  return(
    <Tab.Navigator 
    initialRouteName='Perfil_Conta'
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#FF5F55',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        position:'absolute', 
        top: '28%',
        backgroundColor:'white',
        height:height*0.06      
      },
      tabBarLabelStyle:{
        fontSize: width*0.026,
      }
    }}  
    >
      <Tab.Screen name="Conta" component={Perfil_Conta} 
        options={{
          tabBarIcon:(({color})=>
            <Icon name="user-circle" size={height*0.025} color = {color}/>
            )
          }}
      />
      <Tab.Screen name="Detalhes" component={Perfil_Detalhes} 
        options={{
          tabBarIcon:(({color})=>
            <IconCommunity name="account-details" size={height*0.025} color = {color}/>
            )
        }}
      />
    </Tab.Navigator>
  )
}

function AppRoutes({route, navigation}) {
  useEffect(() => {
    BackHandler.addEventListener('backPress', () => true)
    return () => BackHandler.removeEventListener('backPress', () => true)
  }, [])
  return (
    <NavigationContainer
      independent={true}
      theme={theme}
    >
      <Tab.Navigator 
        initialRouteName='Buscar'
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF5F55',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle:{
            backgroundColor:'white',
            borderWidth: height*0.001,
            borderColor: '#FF5F55',
            borderRadius: 50,
            height: height*0.08,
            width: width*0.95,
            top: height*0.82,
            elevation:0,
            position:'absolute',
            left: width*0.025,
          },
          tabBarLabelStyle:{
            fontSize: width*0.026,
            top: -width*0.02,
          }
        }}
      >
        <Tab.Screen name="Buscar" component={RotaBuscandoCarona} 
          options={{
            tabBarIcon:(({color})=>
              <Icon name="search" size={height*0.025} color = {color}/>
              )
            }}
        />
        <Tab.Screen name="Oferecer" component={RotaOferecerCarona} 
          options={{
            tabBarIcon:(({color})=>
              <Icon name="car" size={height*0.025} color = {color}/>
              )
            }}
        />
        {/* <Tab.Screen name="Suas Viagens" component={Suas_Viagens}  */}
        {/* <Tab.Screen name="CRUD" component={TesteCRUD} 
        // <Tab.Screen name="Erro" component={Erro} 
          options={{
            tabBarIcon:(({color})=>
              <Icon name="list-alt" size={height*0.025} color = {color}/>
                )
          }}
        /> */}
         <Tab.Screen name="Enviar" component={RabbitMQEnviar} 
        // <Tab.Screen name="Erro" component={Erro} 
          options={{
            tabBarIcon:(({color})=>
              <Icon name="send" size={height*0.025} color = {color}/>
                )
          }}
        />
          <Tab.Screen name="Receber" component={RabbitMQReceber} 
        // <Tab.Screen name="Erro" component={Erro} 
          options={{
            tabBarIcon:(({color})=>
              <Icon name="cloud-download" size={height*0.025} color = {color}/>
                )
          }}
        />
        <Tab.Screen name="Mensagens" component={Mensagens} 
          options={{
            tabBarIcon:(({color})=>
            <Icon name="comment-o" size={height*0.025} color = {color}/>
              )
            }}
        />
        <Tab.Screen name="Perfil" component={RotaPerfil} 
          options={{
            tabBarIcon:(({color})=>
              <Icon name="user-o" size={height*0.025} color = {color}/>
              )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;