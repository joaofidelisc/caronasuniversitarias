import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native';

const {Navigator, Screen} = createBottomTabNavigator();

import Procurar from '../screens/Procurar';
import Oferecer from '../screens/Oferecer';
import Suas_Viagens from '../screens/Suas_Viagens';
import Mensagens from '../screens/Mensagens';
import Perfil from '../screens/Perfil';
import { LogBox } from "react-native";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

type Params = {
    token: string;
}

export default function AppRoutes(){
    const route = useRoute();
    const {token} = route.params as Params;
    // console.log(token);
    
    return(
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF5F55',
                tabBarInactiveTintColor: 'gray'
            }}
        >
            <Screen
                name="Procurar"
                component={Procurar}
                options={{
                    tabBarIcon:(({size, color})=>
                        <MaterialIcons
                            name="search"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
             <Screen
                name="Oferecer"
                component={Oferecer}
                options={{
                    tabBarIcon:(({size, color})=>
                        <MaterialIcons
                            name="car-repair"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
              <Screen
                name="Suas Viagens"
                component={Suas_Viagens}
                options={{
                    tabBarIcon:(({size, color})=>
                        <MaterialIcons
                            name="transit-enterexit"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
              <Screen
                name="Mensagens"
                component={Mensagens}
                options={{
                    tabBarIcon:(({size, color})=>
                        <MaterialIcons
                            name="message"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
              <Screen
                name="Perfil"
                component={Perfil}
                initialParams={route.params}
                options={{
                    tabBarIcon:(({size, color})=>
                        <MaterialIcons
                            name="person"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            
        </Navigator>
    )
}

