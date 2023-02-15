import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.31.37:3000');

export default function App() {
  const [num, setNum] = useState(0);

  useEffect(() => {
    socket.emit('loop');
    socket.on('numero', (data) => {
      console.log('Mensagem recebida: ' + data);
      setNum(data);
    });
  }, []);

  socket.on('connect', () => {
    console.log('Conectado ao servidor');
  });

  socket.on('disconnect', () => {
    console.log('Desconectado do servidor');
  });

  return (
    <Text style={{color:'red', fontSize:30, textAlign:'center'}}>Número: {num}</Text>
  );
}
