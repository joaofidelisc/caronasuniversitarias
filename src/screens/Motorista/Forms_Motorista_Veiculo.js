import React, {useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';


function Forms_Motorista_Veiculo({navigation, route}) {
    
    const [placa_veiculo, setPlacaVeiculo] = useState('');
    const [ano_veiculo, setAnoVeiculo] = useState('');
    const [cor_veiculo, setCorVeiculo] = useState('');
    const [nome_veiculo, setNomeVeiculo] = useState('');

    const userID = route.params?.userID;
    const nome = route.params?.nome;
    const CPF = route.params?.cpf;
    const data_nasc = route.params?.data_nasc;
    const num_cel = route.params?.num_cel;
    const universidade = route.params?.universidade;
    const email = route.params?.email;

    const insertDataNewUser = async() => {
        firestore().collection('Users').doc(userID).set({
            nome: nome,
            CPF: CPF,
            data_nasc: data_nasc,
            num_cel: num_cel,
            universidade: universidade,
            email: email,
            placa_veiculo: placa_veiculo,
            ano_veiculo: ano_veiculo,
            cor_veiculo: cor_veiculo,
            nome_veiculo: nome_veiculo,
            motorista: true,
        }).then(()=>{
            navigation.navigate('MenuPrincipal');
        });
    }

    return (
    <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
            <View style={{backgroundColor: '#FF5F55', width: '100%', height:48, justifyContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: '700', fontSize: 16, lineHeight: 20, textAlign: 'center', color: 'white'}}>Formulário do motorista</Text>
            </View>
            <View style={{backgroundColor: '#FFF', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={
                    require('../../assets/icons/car-icon.png')} 
                    style={{height:63, width: 63, position: 'absolute', top:70}}  
                />
                <Text style={{position: 'absolute', top: 158, textAlign: 'center', fontWeight: '700', fontSize: 18, lineHeight: 20, color: '#06444C'}}>Dados do veículo</Text>
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 222, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth: 1, color:'black'}}
                    placeholderTextColor='black'
                    placeholder='Nome'
                />
                <TextInput
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:34, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth: 1, color:'black'}}
                    placeholderTextColor='black'
                    placeholder='Ano'
                    keyboardType='numeric'
                    maxLength={4}
                />
                <TextInput
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:210, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth: 1, color:'black'}}
                    placeholderTextColor='black'
                    placeholder='Cor'
                    maxLength={15}
                    // keyboardType='numbers-and-punctuation'
                    />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 344, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth: 1, color:'black'}}
                    placeholderTextColor='black'
                    placeholder='Placa'
                    maxLength={15}
                />
                <TouchableOpacity style={{position: 'absolute', top: 403}}>
                    <Text style={{fontWeight: '700', fontSize: 18, color: '#06444C'}}>Anexar foto</Text>
                </TouchableOpacity>
                <Image source={
                    require('../../assets/icons/anexar.png')} 
                    style={{height:55, width: 54, position: 'absolute', top:442}}  
                />
                <TouchableOpacity 
                    style={{position: 'absolute', top: 542}}
                    onPress={insertDataNewUser}    
                >
                    <Text style={{fontWeight: '700', fontSize: 18, color: '#06444C'}}>Avançar</Text>
                </TouchableOpacity>
            
            
            </View>
    </SafeAreaView>
    );
}

export default Forms_Motorista_Veiculo;