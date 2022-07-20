import React from 'react';
import {View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image} from 'react-native';

function Forms_Motorista({navigation}) {
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
                />
                <TextInput
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:34, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='CPF'
                    keyboardType='numeric'
                />
                <TextInput
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:210, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='Nascimento'
                    // keyboardType='numbers-and-punctuation'
                />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 344, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='Número de celular'
                />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 405, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='Universidade'
                />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 470, backgroundColor: '#FF5F55', borderRadius: 12, textAlign: 'center', fontWeight: '700', fontSize: 16}}
                    placeholderTextColor='white'
                    placeholder='E-mail'
                    keyboardType='email-address'
                />
                <TouchableOpacity 
                  style={{position: 'absolute', top: 542}}
                  onPress={()=>{navigation.navigate('Forms_Motorista_Veiculo')}}
                >
                    <Text style={{fontWeight: '700', fontSize: 16, color: '#06444C'}}>Avançar</Text>
                </TouchableOpacity>
            
            
            </View>
    </SafeAreaView>
    );
}

export default Forms_Motorista;