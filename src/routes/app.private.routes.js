import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Procurar from '../screens/Procurar/Procurar';
import Buscando_Carona from '../screens/Buscar/Buscando_Carona';
import Oferecer from '../screens/Oferecer/Oferecer';
import Suas_Viagens from '../screens/Suas_Viagens/Suas_Viagens';
import Mensagens from '../screens/Mensagens/Mensagens';
import Perfil_Conta from '../screens/Perfil/Perfil_Conta';
import Perfil_Detalhes from '../screens/Perfil/Perfil_Detalhes';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//nested navigation https://www.youtube.com/watch?v=SPzjttByz6E

function RotaBuscandoCarona(){
  return (
    // <NavigationContainer>
      <Stack.Navigator initialRouteName="Procurar" options={{headerShown:false}}>
        <Stack.Screen name="Procurar" component={Procurar} options={{headerShown:false}}/>
        <Stack.Screen name="Buscando_Carona" component={Buscando_Carona} options={{headerShown:false}} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}

//Tá com problema aqui:
/**
 * Quando coloco RotaPerfil no component da linha 69, a tela não aparece
 * 
*/
function RotaPerfil(){
  <Tab.Navigator 
    initialRouteName='Perfil_Conta'
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#FF5F55',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {position:'absolute', top:141}
    }}  
    >
      <Tab.Screen name="Conta" component={Perfil_Conta} />
      <Tab.Screen name="Detalhes" component={Perfil_Detalhes} />
    </Tab.Navigator>
}

function AppRoutes() {
  return (
    <NavigationContainer
      independent={true}
    >
      <Tab.Navigator 
        initialRouteName='Buscar'
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF5F55',
          tabBarInactiveTintColor: 'gray'
        }}  
      >
        <Tab.Screen name="Buscar" component={RotaBuscandoCarona} />
        <Tab.Screen name="Oferecer" component={Oferecer} />
        <Tab.Screen name="Suas Viagens" component={Suas_Viagens} />
        <Tab.Screen name="Mensagens" component={Mensagens} />
        <Tab.Screen name="Perfil" component={Perfil_Conta} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;