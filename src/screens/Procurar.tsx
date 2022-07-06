import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import estilos from '../Estilos/estilos'


type ProcurarScreenProps = NativeStackScreenProps<RootStackParamList, 'Procurar'>;
const CarSearch = 'https://cdn-icons.flaticon.com/png/512/2954/premium/2954190.png?token=exp=1657078124~hmac=1f34cfd26cd31261cc9e7f916f79ea46'

const Procurar: React.FC<ProcurarScreenProps> = (props) =>{
  const [lugar, setLugar] = useState("")
  return (

    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{position: 'absolute', left: 54, top: 188, fontWeight: '700', fontSize: 20, lineHeight: 24, color: '#06444C'}}>Para onde pretende ir?</Text>
      <Image
        source={{uri:CarSearch}}
        style={{resizeMode:'center',width:100, height:100, padding:70, paddingVertical:100, marginHorizontal:100, marginVertical:15}}
      />
      <Text style={{position: 'absolute', left: 65, top: 263, fontWeight: '600', fontSize: 14, lineHeight: 17, color: '#C4C4C4'}}>Ex: Universidade Federal {'\n'}de São Carlos</Text>
      <TextInput
        style={estilos.TextInput1}   
      
        value={lugar}
        onChangeText={text=>setLugar(text)}
        autoCapitalize="words"
        allowFontScaling={true}
        caretHidden={false}
        blurOnSubmit={true}
      
      />
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