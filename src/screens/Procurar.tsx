import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, Button, Platform, Image, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';

import { TokenResponse } from 'expo-auth-session';

import estilos from '../Estilos/estilos'

type ProcurarScreenProps = NativeStackScreenProps<RootStackParamList, 'Procurar'>;
const CarSearch = 'https://cdn-icons.flaticon.com/png/512/2954/premium/2954190.png?token=exp=1657078124~hmac=1f34cfd26cd31261cc9e7f916f79ea46'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//ALGUNS BUGS NA TIPAGEM (CORRIGIR)

const Procurar: React.FC<ProcurarScreenProps> = (props) =>{
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [lugar, setLugar] = useState("")

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{position: 'absolute', left: 54, top: 188, fontWeight: '700', fontSize: 20, lineHeight: 24, color: '#06444C'}}>Para onde pretende ir?</Text>
      <Image
        source={{uri:CarSearch}}
        style={{resizeMode:'center',width:100, height:100, padding:70, paddingVertical:100, marginHorizontal:100, marginVertical:15}}
      />
      <Text style={{position: 'absolute', left: 65, top: 263, fontWeight: '600', fontSize: 14, lineHeight: 17, color: '#C4C4C4'}}>Ex: Universidade Federal {'\n'}de São Carlos</Text>
      {/* <TextInput
        style={estilos.TextInput1}   
      
        value={lugar}
        onChangeText={text=>setLugar(text)}
        autoCapitalize="words"
        allowFontScaling={true}
        caretHidden={false}
        blurOnSubmit={true}
      
      /> */}
      <TouchableOpacity 
        style={{position: 'absolute', width: 315, height: 39, left: 23, top: 453, backgroundColor: '#FF5F55', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}
        // onPress={()=>props.navigation.push('Buscando_Carona')}
        onPress={async () => {
          await schedulePushNotification();
        }}
        >
        
        
        <Text style={{fontWeight: '700', fontSize: 16, lineHeight: 20, color:'white'}}>Buscar carona</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
      {/* <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
        /> */}
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "SOLICITAÇÃO DE CARONA",
      body: 'Sua solicitação de carona foi feita com sucesso!',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default Procurar;