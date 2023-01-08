import React from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';

import configBD from '../../../config/config.json';

const {width, height} = Dimensions.get('screen');

function TesteCRUD() {      
    //   {
    //       //LER MODO DO APP (MOTORISTA OU PASSAGEIRO);
    //       //LER NOME DO MOTORISTA;
    //       //LER TOKEN DO USUÁRIO;
    //       //LER CLASSIFICACAO DO USUÁRIO;
    //   }
    const buscarUsuario = async()=>{
        console.log('lerModoApp');
        let reqs = await fetch(configBD.urlRootNode+`buscarUsuario/0VtQXRifF8PdbcKCrthdOtlnah12`,{
            method: 'GET',
            mode: 'cors',
            headers:{
              'Accept':'application/json',
              'Content-type':'application/json'
            }
        });
        const res = await reqs.json();
        console.log('resposta:', res);
        //   if (res == 'Falha'){
        //     console.log('Busca falhou!');
        //   }
        //duas possíveis respostas:
        //1ª os dados do usuário dentro de um objeto;
        //2ª Falha

        //RETORNANDO MODO DO APP:
        if (res != 'Falha'){
            console.log(res.motorista);
            console.log(res.nome);
            console.log(res.token);
            console.log(res.classificacao);
        }
    }

    
    //ATUALIZAR MODO DO APP (DE MOTORISTA PARA PASSAGEIRO E DE PASSAGEIRO PARA MOTORISTA);
    const atualizarModoApp = async()=>{
        console.log('atualizarModoApp');
           let reqs = await fetch(configBD.urlRootNode+'atualizarModoApp',{
            method: 'PUT',
            headers:{
              'Accept':'application/json',
              'Content-type':'application/json'
            },
            body: JSON.stringify({
              id: '0VtQXRifF8PdbcKCrthdOtlnah12',
              motorista:true
            })
          });
    
          let res = await reqs.json();
          console.log('req:', res);
          // console.log('passou!');
    }


    //ATUALIZAR TOKEN DO USUÁRIO;
    const atualizarToken = async()=>{
        console.log('atualizarToken');
        let reqs = await fetch(configBD.urlRootNode+'atualizarToken',{
        method: 'PUT',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        },
        body: JSON.stringify({
            id: '0VtQXRifF8PdbcKCrthdOtlnah12',
            token: 'novo token'
        })
        });

        let res = await reqs.json();
        console.log('req:', res);
        // console.log('passou!');
    }
      
    
    //ATUALIZAR CLASSIFICAÇÃO DO USUÁRIO;
    const atualizarClassificacao = async()=>{
        console.log('atualizarClassificacao');
        let reqs = await fetch(configBD.urlRootNode+'atualizarToken',{
         method: 'PUT',
         headers:{
           'Accept':'application/json',
           'Content-type':'application/json'
         },
         body: JSON.stringify({
           id: '0VtQXRifF8PdbcKCrthdOtlnah12',
           classificacao: 5
         })
       });
 
       let res = await reqs.json();
       console.log('req:', res);
       // console.log('passou!');
    }
    
    //CADASTRAR USUARIO COMUM;
    const cadastrarUsuario = async()=>{
        let reqs = await fetch(configBD.urlRootNode+'cadastrarUsuario',{
            method: 'POST',
            headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
            },
            body: JSON.stringify({
            id: Math.random().toString(),
            // id: auth().currentUser.uid,
            nome: 'JOÃO',
            CPF:"414.386.918-75",
            dataNasc:"1998-06-10",
            email:"joao.fidelis@estudante.ufscar.br",
            numCel:'(16)99376-4191',
            token:'dusahdasdl',
            universidade:'UFSCar',
            classificacao:4.65,
            fotoPerfil:'duasdjasdl',
            motorista:true
        })
        });

        let res = await reqs.json();
        console.log('req:', res);
    }

    //VERIFICAR SE USUÁRIO EXISTE PELO EMAIL;
    const buscarEmail = async()=>{
        console.log('Buscar Email');
        let reqs = await fetch(configBD.urlRootNode+`buscarPorEmail/joao.fidelis@estudante.ufscar.brr`,{
            method: 'GET',
            mode: 'cors',
            headers:{
              'Accept':'application/json',
              'Content-type':'application/json'
            }
        });
        const res = await reqs.json();
        console.log('resposta:', res[0]);
        if (res[0] == undefined || res == 'Falha'){
            console.log('Usuário não encontrado!');
        }
    }


    //LER NOME DO CARRO DO MOTORISTA;
    //LER PLACA DO CARRO DO MOTORISTA;
    
    //VIAGEM(?)
    
    
    
    //ATUALIZAR DADOS DO USUÁRIO;
        //dados do veículo que devem ser atualizados!


    return (
      <SafeAreaView>
        <StatusBar barStyle={'light-content'} />
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.4, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center'}}
            onPress={buscarUsuario}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Buscar Usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={atualizarModoApp}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Atualizar Modo App</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={cadastrarUsuario}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Cadastrar Usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={buscarEmail}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Buscar E-mail</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default TesteCRUD