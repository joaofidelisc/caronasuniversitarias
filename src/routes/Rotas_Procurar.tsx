import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Procurar from '../screens/Procurar';
import Buscando_Carona from '../screens/Buscando_Carona';

import { RootStackParamList } from '../types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Rotas_Procurar() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Procurar" component={Procurar} options={{headerShown:false}}/>
        <Stack.Screen name="Buscando_Carona" component={Buscando_Carona} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Rotas_Procurar;