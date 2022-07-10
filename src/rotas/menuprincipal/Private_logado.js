import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons';

import Oferecer from '../../telas/Oferecer';
import Suas_Viagens from '../../telas/Suas_Viagens';
import Mensagens from '../../telas/Mensagens';

import PrivatePerfil from '../perfil/Private.perfil';
import Rota_buscando_carona from '../buscandocarona/Rota_buscando_carona';



const Tab = createBottomTabNavigator();

export default function RotasPrivadas() {
  return (
    // <NavigationContainer>
      <Tab.Navigator
       screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF5F55',
        tabBarInactiveTintColor: 'gray'
    }}
      >
        <Tab.Screen 
            name="Buscar"
            component={Rota_buscando_carona}
            options={{
                tabBarIcon:(({size, color})=>
                    <MaterialIcons
                        name="search"
                        size={size}
                        color={color}
                    />
                )
            }}
        />
         <Tab.Screen 
            name="Oferecer"
            component={Oferecer}
            options={{
                tabBarIcon:(({size, color})=>
                    <MaterialIcons
                        name="car-repair"
                        size={size}
                        color={color}
                    />
                )
            }}
        />
        <Tab.Screen
            name="Suas Viagens"
            component={Suas_Viagens}
            options={{
                tabBarIcon:(({size, color})=>
                    <MaterialIcons
                        name="transit-enterexit"
                        size={size}
                        color={color}
                    />
                )
            }}
        />
        <Tab.Screen
            name="Mensagens"
            component={Mensagens}
            options={{
                tabBarIcon:(({size, color})=>
                    <MaterialIcons
                        name="message"
                        size={size}
                        color={color}
                    />
                )
            }}
        />
        <Tab.Screen
            name="Perfil"
            component={PrivatePerfil}
            // initialParams={route.params}
            options={{
                tabBarIcon:(({size, color})=>
                    <MaterialIcons
                        name="person"
                        size={size}
                        color={color}
                    />
                )
            }}
        />
      </Tab.Navigator>
    // </NavigationContainer>
  );
}
