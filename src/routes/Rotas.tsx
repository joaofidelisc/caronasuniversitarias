import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Entrada from '../screens/Entrada';
import Login from '../screens/Login';
import Cadastro_1 from '../screens/Cadastro_1';
import AppRoutes from '../routes/app.routes';
import { RootStackParamList } from '../types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Entrada" component={Entrada} options={{headerShown:false}} />
        <Stack.Screen name="Cadastro_1" component={Cadastro_1} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="MenuPrincipal" component={AppRoutes} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Rotas;