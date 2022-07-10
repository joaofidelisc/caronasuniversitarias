import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons';
import { StyleSheet } from 'react-native';


import Perfil_Detalhes from '../../telas/Perfil_Detalhes';
import Perfil_Conta from '../../telas/Perfil_Conta';

const Tab = createBottomTabNavigator();

export default function RotasPrivadas() {
  return (
    // <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
        tabBarStyle:{position: 'absolute', top: 141},
        headerShown: false,
        tabBarActiveTintColor: '#FF5F55',
        tabBarInactiveTintColor: 'gray'
    }}
      >
        <Tab.Screen 
            name="Detalhes"
            component={Perfil_Detalhes}
            options={{
                tabBarIcon:(({size, color})=>
                    <MaterialIcons
                        name="details"
                        size={size}
                        color={color}
                    />
                )
            }
        }
        />
         <Tab.Screen 
            name="Conta"
            component={Perfil_Conta}
            options={{
                tabBarIcon:(({size, color})=>
                    <MaterialIcons
                        name="verified-user"
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
