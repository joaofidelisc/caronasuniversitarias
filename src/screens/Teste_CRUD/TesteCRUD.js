import React from 'react';
import {View, Text, SafeAreaView, StatusBar, Image, Dimensions, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth'


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
        // console.log('lerModoApp');
        const userID = auth().currentUser.uid;
        console.log('tipo',typeof(userID));
        console.log('userID:', userID);
        let reqs = await fetch(configBD.urlRootNode+`buscarUsuario/${userID}`,{
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
            // id: Math.random().toString(),
            id: '0VtQXRifF8PdbcKCrthdOtlnah12',
            nome: 'João Cardozo',
            CPF:"414.386.918-75",
            dataNasc:"1998-06-10",
            email:"joao.fidelis@estudante.ufscar.br",
            numCel:'(16)99376-4191',
            token:`fmKly7zzT52ImztuxXN8sY:APA91bE_ikS-rcAvO63OTgmo93DADw1msFKOau_X1s7Te9sziw0WFZyDb5tEQnHAA81dkquFv58UB6jZe2-vQGJlm6d1D47lH0z-8yhmZxwjJBH7kqHITLe8sPi01U8vyeL3ConZlLVF`,
            universidade:'UFSCar',
            classificacao:4.65,
            fotoPerfil:'NULO',
            motorista:true
        })
        });

        let res = await reqs.json();
        console.log('req:', res);
    }


      //CADASTRAR VIAGEM
      const cadastrarViagem = async()=>{
        let reqs = await fetch(configBD.urlRootNode+'cadastrarViagem',{
            method: 'POST',
            headers:{
              'Accept':'application/json',
              'Content-type':'application/json'
            },
            body: JSON.stringify({
              nomeMotorista: 'João Cardozo',
              uidPassageiro2: '0VtQXRifF8PdbcKCrthdOtlnah12',
              uidMotorista: '0VtQXRifF8PdbcKCrthdOtlnah12',
              fotoPerfil: 'linkFoto',
              destino: 'UFSCar',
              dataViagem: "2023-01-10"
            })
        });

        let res = await reqs.json();
        console.log('req:', res);
    }


    const buscarViagem = async()=>{
      console.log('Buscar Viagem');
      let reqs = await fetch(configBD.urlRootNode+`buscarViagem/0VtQXRifF8PdbcKCrthdOtlnah12`,{
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
          console.log('Viagem não encontrada!');
      }
    }


    const contarViagem = async()=>{
      console.log('Contar Viagem');
      let reqs = await fetch(configBD.urlRootNode+`contarViagens/0VtQXRifF8PdbcKCrthdOtlnah12`,{
          method: 'GET',
          mode: 'cors',
          headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
          }
      });
      const res = await reqs.json();
      console.log('resposta:', res);
      // console.log(res);
      if (res == 3){
        console.log('retornou 3!!');
      }
      // console.log('resposta:', res[0]);
      if (res == 'Falha'){
          console.log(0);
      }
    }


    //VERIFICAR SE USUÁRIO EXISTE PELO EMAIL;
    const buscarEmail = async()=>{
        console.log('Buscar Email');
        let reqs = await fetch(configBD.urlRootNode+`buscarPorEmail/joao.fidelis@estudante.ufscar.br`,{
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
        }else{
          return res;
        }
    }



    const teste = async()=>{
      let objUsuario = await buscarEmail();
      console.log('objUsuario', objUsuario[0].CPF);
      console.log('tipo objUsuario:', typeof(objUsuario));

    }
    //LER NOME DO CARRO DO MOTORISTA;
    //LER PLACA DO CARRO DO MOTORISTA;
    //CADASTRAR VEÍCULO
    
    //VIAGEM(?)
    
    
    
    //ATUALIZAR DADOS DO USUÁRIO;
        //dados do veículo que devem ser atualizados!

    //CRUD VEICULO
    const cadastrarVeiculo = async()=>{
        let reqs = await fetch(configBD.urlRootNode+'cadastrarVeiculo',{
            method: 'POST',
            headers:{
                'Accept':'application/json',
                'Content-type':'application/json'
            },
            body: JSON.stringify({
                userId: '0VtQXRifF8PdbcKCrthdOtlnah12',
                nomeVeiculo: 'Del Rei',
                anoVeiculo: 1992,
                corVeiculo: 'cinza',
                placaVeiculo: 'JJJJJJJ',
             })
        });

        let res = await reqs.json();
        console.log('req:', res);
    }

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
            // onPress={buscarEmail}  
            onPress={teste}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Buscar E-mail</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={cadastrarVeiculo}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Cadastrar Veiculo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={cadastrarViagem}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Cadastrar Viagem</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={buscarViagem}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Buscar Viagem</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{backgroundColor:'#FF5F55', width: width*0.5, height: height*0.05, borderRadius: 15, justifyContent:'center', alignItems:'center', marginTop: width*0.04}}
            onPress={contarViagem}  
          >
            <Text style={{color:'white', fontSize: width*0.05}}>Contar Viagem</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
}

export default TesteCRUD