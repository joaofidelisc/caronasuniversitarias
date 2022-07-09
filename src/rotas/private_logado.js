import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons'

import Procurar from '../telas/Procurar';
import Oferecer from '../telas/Oferecer';
import Suas_Viagens from '../telas/Oferecer';
import Mensagens from '../telas/Mensagens';
import Perfil from '../telas/Perfil';


import { LogBox } from "react-native";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

const {Navigator, Screen} = createBottomTabNavigator();

function AppRoutes(){
    // const route = useRoute();
    // const {token} = route.params as Params;
    // // console.log(token);
    
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
                options={{
                    tabBarIcon:(({size, color})=>
                        <MaterialIcons
                            name="person"
                            size={size}
                            color={color}
                        />
                    )
                }}
                // initialParams={route.params}
            />
        </Navigator>
    )
}

export default AppRoutes();