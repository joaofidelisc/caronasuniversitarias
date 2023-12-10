import React, {useState} from 'react';
import axios from 'axios';
import {View, TextInput, Button, StyleSheet} from 'react-native';
const App = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [token, setToken] = useState('');

  const handleSendNotification = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/sendNotification',
        {
          title: 'a',
          body: 'teste',
          token:
            'AAAAFrUbP_c:APA91bHWUpnHEgGUrHl0ZhJDOlAdF1cJSlZYbwlo5avmuybQH6aHDgKlLeesxtm2NgYNNXeKm6Z4vd-Ue9HMaBsgBkANPiK4rPYpwiGHs60Uz-a3vA0k9DvPihr-MQMU2fNHIjrBONZi',
        },
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{backgroundColor: 'red'}}>
      <Button title="Send Notification" onPress={handleSendNotification} />
    </View>
  );
};

export default App;
