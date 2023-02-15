import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import Entrada from '../screens/Tela_Inicial/Entrada';
import Login from '../screens/Login/Login';
import ModoMotorista from './app.motorista.routes';
import ModoPassageiro from '../routes/app.passageiro.routes';
import MenuTeste from '../routes/app.private.routes';
import Cadastro_Celular from '../screens/Cadastro/Cadastro_Celular';
import Cadastro_Email from '../screens/Cadastro/Cadastro_Email';
import Cadastro_Inicio from '../screens/Cadastro/Cadastro_Inicio';
import Codigo_SMS from '../screens/Cadastro/Codigo_SMS';
import Como_Comecar from '../screens/Cadastro/Como_Comecar';
import Forms_Passageiro from '../screens/Passageiro/Forms_Passageiro';
import Forms_Motorista from '../screens/Motorista/Forms_Motorista';
import Forms_Motorista_Veiculo from '../screens/Motorista/Forms_Motorista_Veiculo';
import Erro from '../screens/Erro/Erro';
import Teste from '../services/Socketio/Teste'

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
          <Stack.Screen name="ModoPassageiro" component={ModoPassageiro} options={{headerShown:false}}/>
          <Stack.Screen name="ModoMotorista" component={ModoMotorista} options={{headerShown:false}}/>
          {/*  */}
          <Stack.Screen name="MenuTeste" component={MenuTeste} options={{headerShown:false}}/>
          {/*  */}
          <Stack.Screen name="Erro" component={Erro} options={{headerShown:false}} />
          <Stack.Screen name= "Teste" component={Teste} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default RotaEntrada;