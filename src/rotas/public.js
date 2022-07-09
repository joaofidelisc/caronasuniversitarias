import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Entrada from '../telas/Entrada';
import Cadastro_1 from '../telas/Cadastro_1';
import Login from '../telas/Login';

import {AppRoutes} from '../rotas/private_logado';

const Stack = createStackNavigator();

function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Entrada" component={Entrada} options={{headerShown:false}} />
        <Stack.Screen name="Cadastro_1" component={Cadastro_1} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        {/* <Stack.Screen name="MenuPrincipal" component={AppRoutes} options={{headerShown:false}}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Rotas;