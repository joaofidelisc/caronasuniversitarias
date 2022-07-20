import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import Entrada from '../screens/Tela_Inicial/Entrada';
import Cadastro_1 from '../screens/Cadastro/Cadastro_1';
import Cadastro_2 from '../screens/Cadastro/Cadastro_2';
import Cadastro_3 from '../screens/Cadastro/Cadastro_3';
import Login from '../screens/Login/Login';
import MenuPrincipal from '../routes/app.private.routes';
import Options from '../screens/Buscar/Options';

const Stack = createNativeStackNavigator();

function RotaEntrada() {
    return (
      <NavigationContainer
        independent={true}
      >
        <Stack.Navigator initialRouteName="Entrada">
          <Stack.Screen name="Entrada" component={Entrada} options={{headerShown:false}} />
          <Stack.Screen name="Cadastro_1" component={Cadastro_1} options={{headerShown:false}} />
          <Stack.Screen name="Cadastro_2" component={Cadastro_2} options={{headerShown:false}} />
          <Stack.Screen name="Cadastro_3" component={Cadastro_3} options={{headerShown:false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="MenuPrincipal" component={MenuPrincipal}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default RotaEntrada;