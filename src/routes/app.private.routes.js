import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Procurar from '../screens/Procurar/Procurar';
import Buscando_Carona from '../screens/Buscar/Buscando_Carona';
import Oferecer from '../screens/Oferecer/Oferecer';
import Suas_Viagens from '../screens/Suas_Viagens/Suas_Viagens';
import Perfil from '../screens/Perfil/Perfil_Conta';
import Mensagens from '../screens/Mensagens/Mensagens';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//nested navigation https://www.youtube.com/watch?v=SPzjttByz6E

function RotaBuscandoCarona(){
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName="Procurar">
        <Stack.Screen name="Procurar" component={Procurar} />
        <Stack.Screen name="Buscando_Carona" component={Buscando_Carona} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default function AppRoutes() {
  return (
    <NavigationContainer
      independent={true}
    >
      <Tab.Navigator initialRouteName='Buscar'>
        <Tab.Screen name="Buscar" component={RotaBuscandoCarona} />
        <Tab.Screen name="Oferecer" component={Oferecer} />
        <Tab.Screen name="Suas Viagens" component={Suas_Viagens} />
        <Tab.Screen name="Mensagens" component={Mensagens} />
        <Tab.Screen name="Perfil" component={Perfil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}