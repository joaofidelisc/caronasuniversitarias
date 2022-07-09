import * as React from 'react';

import RotasPublicas from './src/rotas/public';
import RotasPrivadas from './src/rotas/private_logado';

export default function App() {
  return (
    <RotasPrivadas/>
  );
}
