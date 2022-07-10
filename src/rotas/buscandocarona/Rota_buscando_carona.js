import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Procurar from '../../telas/Procurar';
import Buscando_Carona from '../../telas/Buscando_Carona';


const Stack = createStackNavigator();

function Rota_buscando_carona() {
  return (
    // <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Procurar" component={Procurar} options={{headerShown:false}} />
        <Stack.Screen name="Buscando_Carona" component={Buscando_Carona} options={{headerShown:false}}/>
      </Stack.Navigator>
    // </NavigationContainer>
  )
}

export default Rota_buscando_carona;