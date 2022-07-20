import React from 'react';

import Perfil_Conta from './src/screens/Perfil/Perfil_Conta';
import Perfil_Detalhes from './src/screens/Perfil/Perfil_Detalhes';

import Menu from './src/routes/app.private.routes';
import RotaEntrada from './src/routes/app.public.routes';
import RotaBuscandoCarona from './src/routes/app.private.routes';

export default function App() {
  return (
    <RotaEntrada/>
  );
}