import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';

type ProcurarScreenProps = NativeStackScreenProps<RootStackParamList, 'Procurar'>;


const Procurar: React.FC<ProcurarScreenProps> = (props) =>{
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../assets/carropesquisa.png')}
        style={{resizeMode:'center',width:100, height:100, padding:70, paddingVertical:100, marginHorizontal:100, marginVertical:15}}
      />
      <Text style={{position: 'absolute', left: 54, top: 188, fontWeight: '700', fontSize: 20, lineHeight: 24, color: '#06444C'}}>Para onde pretende ir?</Text>
      <Text style={{position: 'absolute', left: 65, top: 263, fontWeight: '600', fontSize: 14, lineHeight: 17, color: '#C4C4C4'}}>Ex: Universidade Federal {'\n'}de São Carlos</Text>
      <TouchableOpacity 
        style={{position: 'absolute', width: 315, height: 39, left: 23, top: 453, backgroundColor: '#FF5F55', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}
        onPress={()=>props.navigation.push('Buscando_Carona')}
        >
        
        
        <Text style={{fontWeight: '700', fontSize: 16, lineHeight: 20, color:'white'}}>Buscar carona</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

export default Procurar;