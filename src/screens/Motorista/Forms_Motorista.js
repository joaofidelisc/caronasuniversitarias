import React, {useState} from 'react';
import {View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TextInputMask } from 'react-native-masked-text'


function Forms_Motorista({route, navigation}) {
    const [nome, setNome] = useState('');
    const [CPF, setCPF] = useState('');
    const [data_nasc, setDataNasc] = useState('');
    const [num_cel, setNumCel] = useState('');
    const [universidade, setUniversidade] = useState('');

    
    const insertDataNewUser = async() => {
        firestore().collection('Motorista').add({
            email: route.params?.email,
            senha: route.params?.senha,
            nome: nome,
            CPF: CPF,
            data_nasc: data_nasc,
            num_cel: num_cel,
            universidade: universidade
        }).then(()=>{
            navigation.navigate('Forms_Motorista_Veiculo');
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
                <TextInputMask 
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:34, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    type="cpf"
                    onChangeText={(CPF)=>setCPF(CPF)}
                    placeholder='CPF'
                    placeholderTextColor='white'
                />
                <TextInputMask
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:210, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    type="datetime"
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    placeholder='Nascimento'
                    placeholderTextColor='white'
                    onChangeText={(data_nasc)=>setDataNasc(data_nasc)}
                />
                <TextInputMask
                    style={{position:'absolute', width: 315, height: 39, top: 344, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    type="cel-phone"
                    options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99)'
                    }}
                    placeholder='Número de celular'
                    placeholderTextColor='white'
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

export default Forms_Motorista;