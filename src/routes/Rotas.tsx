import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Entrada from '../screens/Entrada';
import Login from '../screens/Login';
import Cadastro_1 from '../screens/Cadastro_1';
import Procurar from '../screens/Procurar';
import Buscando_Carona from '../screens/Buscando_Carona';

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
        <Stack.Screen name="Procurar" component={Procurar} options={{headerShown:false}}/>
        <Stack.Screen name="Buscando_Carona" component={Buscando_Carona} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Rotas;