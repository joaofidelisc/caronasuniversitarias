import React, {useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function Forms_Passageiro({route, navigation}) {
    const [nome, setNome] = useState('');
    const [CPF, setCPF] = useState('');
    const [data_nasc, setDataNasc] = useState('');
    const [num_cel, setNumCel] = useState('');
    const [universidade, setUniversidade] = useState('');
    
    const insertDataNewUser = async() => {
        firestore().collection('Passageiro').add({
            email: route.params?.email,
            senha: route.params?.senha,
            nome: nome,
            CPF: CPF,
            data_nasc: data_nasc,
            num_cel: num_cel,
            universidade: universidade
        }).then(()=>{
            navigation.navigate('MenuPrincipal', {email: route.params?.email})
        });
    }
    return (
    <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
            <View style={{backgroundColor: '#FF5F55', width: '100%', height:48, justifyContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: '700', fontSize: 16, lineHeight: 20, textAlign: 'center', color: 'white'}}>Formulário do passageiro</Text>
            </View>
            <View style={{backgroundColor: '#FFF', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={
                    require('../../assets/icons/user_undefined.png')} 
                    style={{height:63, width: 63, position: 'absolute', top:70}}  
                />
                <Text style={{position: 'absolute', top: 158, textAlign: 'center', fontWeight: '700', fontSize: 16, lineHeight: 20, color: '#06444C'}}>Dados pessoais</Text>
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 222, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='Nome'
                    onChangeText={(nome)=>setNome(nome)}
                    />
                <TextInput
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:34, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='CPF'
                    keyboardType='numeric'
                    onChangeText={(CPF)=>setCPF(CPF)}
                    />
                <TextInput
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:210, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='Nascimento'
                    onChangeText={(data_nasc)=>setDataNasc(data_nasc)}
                    // keyboardType='numbers-and-punctuation'
                    />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 344, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='Número de celular'
                    onChangeText={(num_cel)=>setNumCel(num_cel)}
                    />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 405, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='Universidade'
                    onChangeText={(universidade)=>setUniversidade(universidade)}
                    />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 470, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='E-mail'
                    keyboardType='email-address'
                    value= {route.params?.email}
                    editable={false}
                />
                <TouchableOpacity 
                    style={{position: 'absolute', top: 542}}
                    onPress={insertDataNewUser}
                >
                    <Text style={{fontWeight: '700', fontSize: 16, color: '#06444C'}}>Salvar</Text>
                </TouchableOpacity>
            </View>
    </SafeAreaView>
    );
}

export default Forms_Passageiro;