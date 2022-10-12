import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import Entrada from '../screens/Tela_Inicial/Entrada';
import Login from '../screens/Login/Login';
import MenuPrincipal from '../routes/app.private.routes';
import Cadastro_Celular from '../screens/Cadastro/Cadastro_Celular';
import Cadastro_Email from '../screens/Cadastro/Cadastro_Email';
import Cadastro_Inicio from '../screens/Cadastro/Cadastro_Inicio';
import Codigo_SMS from '../screens/Cadastro/Codigo_SMS';
import Como_Comecar from '../screens/Cadastro/Como_Comecar';
import Forms_Passageiro from '../screens/Passageiro/Forms_Passageiro';
import Forms_Motorista from '../screens/Motorista/Forms_Motorista';
import Forms_Motorista_Veiculo from '../screens/Motorista/Forms_Motorista_Veiculo';
import { Splash } from '../screens/SplashScreen/SplashScreen';

const Stack = createNativeStackNavigator();

function RotaEntrada() {
    return (
      <NavigationContainer
        independent={true}
      >
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name= "Splash" component={Splash} options={{headerShown:false}}/>
          <Stack.Screen name="Entrada" component={Entrada} options={{headerShown:false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="Cadastro_Inicio" component={Cadastro_Inicio} options={{headerShown:false}} />
          <Stack.Screen name="Cadastro_Email" component={Cadastro_Email} options={{headerShown:false}} />
          <Stack.Screen name="Cadastro_Celular" component={Cadastro_Celular} options={{headerShown:false}} />
          <Stack.Screen name="Codigo_SMS" component={Codigo_SMS} options={{headerShown:false}} />
          <Stack.Screen name="Como_Comecar" component={Como_Comecar} options={{headerShown:false}} />
          <Stack.Screen name="Forms_Passageiro" component={Forms_Passageiro} options={{headerShown:false}} />
          <Stack.Screen name="Forms_Motorista" component={Forms_Motorista} options={{headerShown:false}} />
          <Stack.Screen name="Forms_Motorista_Veiculo" component={Forms_Motorista_Veiculo} options={{headerShown:false}} />
          <Stack.Screen name="MenuPrincipal" component={MenuPrincipal} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default RotaEntrada;