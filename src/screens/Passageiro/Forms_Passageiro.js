import React, {useState, useEffect, useContext} from 'react';
import {View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Image, BackHandler, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TextInputMask } from 'react-native-masked-text'

function Forms_Passageiro({route, navigation}) {
    const [nome, setNome] = useState('');
    const [CPF, setCPF] = useState('');
    const [data_nasc, setDataNasc] = useState('');
    const [num_cel, setNumCel] = useState('');
    const [universidade, setUniversidade] = useState('');

    const userID = route.params?.userID;

    const descartarAlteracoes = async() =>{
        navigation.navigate('Como_Comecar', {email: route.params?.email, userID: route.params?.userID});
    }
    
        useEffect(() => {
            console.log(userID);
            const backAction = () => {
            Alert.alert("Descartar informações de passageiro", "Tem certeza que deseja voltar?\nSuas informações serão descartadas!", [
                {
                text: "Cancelar",
                onPress: () => null,
                style: "cancel"
                },
                { text: "Sim", onPress: () => descartarAlteracoes()}
            ]);
            return true;
            };
    
            const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
            );
    
            return () => backHandler.remove();
        }, []);
        

    
    const insertDataNewUser = async() => {
        firestore().collection('Users').doc(userID).set({
            nome: nome,
            CPF: CPF,
            data_nasc: data_nasc,
            num_cel: num_cel,
            universidade: universidade,
            email: route.params?.email,
            placa_veiculo: "",
            ano_veiculo: "",
            cor_veiculo: "",
            nome_veiculo: "",
            motorista: false,
        }).then(()=>{
            navigation.navigate('MenuPrincipal', {userID: userID});
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
                <Text style={{position: 'absolute', top: 158, textAlign: 'center', fontWeight: '700', fontSize: 18, lineHeight: 20, color: '#06444C'}}>Dados pessoais</Text>
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 222, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth:1, color:'black'}}
                    placeholderTextColor='black'
                    placeholder='Nome'
                    onChangeText={(nome)=>setNome(nome)}
                />
                <TextInputMask 
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:34, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth:1, color:'black'}}
                    placeholderTextColor='black'
                    type="cpf"
                    onChangeText={(CPF)=>setCPF(CPF)}
                    placeholder='CPF'
                />
                <TextInputMask
                    style={{position:'absolute', width: 139, height: 39, top: 280, left:210, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth:1, color:'black'}}
                    placeholderTextColor='black'
                    type="datetime"
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    placeholder='Nascimento'
                    onChangeText={(data_nasc)=>setDataNasc(data_nasc)}
                />
                <TextInputMask
                    style={{position:'absolute', width: 315, height: 39, top: 344, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth:1, color:'black'}}
                    placeholderTextColor='black'
                    type="cel-phone"
                    options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99)'
                    }}
                    placeholder='Número de celular'
                    onChangeText={(num_cel)=>setNumCel(num_cel)}
                />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 405, borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, borderWidth:1, color:'black'}}
                    placeholderTextColor='black'
                    placeholder='Universidade'
                    onChangeText={(universidade)=>setUniversidade(universidade)}
                    />
                <TextInput
                    style={{position:'absolute', width: 315, height: 39, top: 470, backgroundColor: '#D3D3D3', borderRadius: 12, textAlign: 'center', fontWeight: '400', fontSize: 16, color:'black'}}
                    placeholderTextColor='black'
                    placeholder='E-mail'
                    keyboardType='email-address'
                    value= {route.params?.email}
                    editable={false}
                />
                <TouchableOpacity 
                    style={{position: 'absolute', top: 542}}
                    onPress={insertDataNewUser}
                >
                    <Text style={{fontWeight: '700', fontSize: 18, color: '#06444C'}}>Salvar</Text>
                </TouchableOpacity>
            </View>
    </SafeAreaView>
    );
}

export default Forms_Passageiro;