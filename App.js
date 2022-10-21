import React, {useEffect} from 'react';
import { LogBox } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import Perfil_Conta from './src/screens/Perfil/Perfil_Conta';
import Perfil_Detalhes from './src/screens/Perfil/Perfil_Detalhes';

import Menu from './src/routes/app.private.routes';
import RotaEntrada from './src/routes/app.public.routes';
import RotaBuscandoCarona from './src/routes/app.private.routes';
import Classificacao from './src/screens/Buscar/Classificacao';
import Como_Comecar from './src/screens/Cadastro/Como_Comecar';
import Forms_Passageiro from './src/screens/Passageiro/Forms_Passageiro';
import Forms_Motorista_Veiculo from './src/screens/Motorista/Forms_Motorista_Veiculo';
import Forms_Motorista from './src/screens/Motorista/Forms_Motorista';
import Cadastro_Email from './src/screens/Cadastro/Cadastro_Email';
import BuscandoCarona from './src/screens/Buscar/BuscandoCarona';

LogBox.ignoreAllLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <RotaEntrada/>
  );
}