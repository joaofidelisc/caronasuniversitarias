import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {Image} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Oferecer from '../screens/Oferecer/Oferecer';
import Suas_Viagens from '../screens/Suas_Viagens/Suas_Viagens';
import Mensagens from '../screens/Mensagens/Mensagens';
import Perfil_Conta from '../screens/Perfil/Perfil_Conta';
import Perfil_Detalhes from '../screens/Perfil/Perfil_Detalhes';
import ConfigurarCarona from '../screens/Oferecer/ConfigurarCarona';
import ClassificarPassageiro from '../screens/Oferecer/ClassificarPassageiro';
import ViagemMotorista from '../screens/Oferecer/ViagemMotorista';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RotaOferecerCarona() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="ConfigurarCarona"
        options={{headerShown: false}}>
        <Stack.Screen
          name="ConfigurarCarona"
          component={ConfigurarCarona}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OferecerCarona"
          component={Oferecer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ViagemMotorista"
          component={ViagemMotorista}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ClassificarPassageiro"
          component={ClassificarPassageiro}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function RotaPerfil() {
  return (
    <Tab.Navigator
      initialRouteName="Perfil_Conta"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF5F55',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {position: 'absolute', top: '28%'},
      }}>
      <Tab.Screen
        name="Conta"
        component={Perfil_Conta}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={require('../assets/icons/conta.png')}
              style={{height: 22, width: 22, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Detalhes"
        component={Perfil_Detalhes}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={require('../assets/icons/detalhes.png')}
              style={{height: 22, width: 22, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppRoutes() {
  useEffect(() => {
    BackHandler.addEventListener('backPress', () => true);
    return () => BackHandler.removeEventListener('backPress', () => true);
  }, []);
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName="Oferecer"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF5F55',
          tabBarInactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="Oferecer"
          component={RotaOferecerCarona}
          options={{
            tabBarIcon: ({color}) => (
              <Image
                source={require('../assets/icons/oferecer.png')}
                style={{height: 22, width: 22, tintColor: color}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Suas Viagens"
          component={Suas_Viagens}
          options={{
            tabBarIcon: ({color}) => (
              <Image
                source={require('../assets/icons/viagens.png')}
                style={{height: 22, width: 22, tintColor: color}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Mensagens"
          component={Mensagens}
          options={{
            tabBarIcon: ({color}) => (
              <Image
                source={require('../assets/icons/mensagens.png')}
                style={{height: 22, width: 22, tintColor: color}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={RotaPerfil}
          options={{
            tabBarIcon: ({color}) => (
              <Image
                source={require('../assets/icons/perfil.png')}
                style={{height: 22, width: 22, tintColor: color}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;
