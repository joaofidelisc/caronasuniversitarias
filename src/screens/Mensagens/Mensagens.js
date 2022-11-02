import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, Dimensions, Image, StatusBar, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const {height,width} = Dimensions.get('screen');

export default function Mensagens({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const [currentChatID, setCurrentChatID] = useState(null);
  const [imageUser, setImageUser] = useState('');
  const [existeChat, setExisteChat] = useState(false);
  const [infoChatrooms, setinfoChatrooms] = useState([]);
  const [ocultarChat, setOcultarChat] = useState(true);
  const [listener, setListener] = useState(null);
  const [secondUser, setSecondUser] = useState(null);
  const [reference, setReference] = useState(null);
  
  const currentUser = auth().currentUser.uid;
  
  useEffect(()=>{
    const exibirChat = route.params?.ocultarChat;
    const idChat = route.params?.idChat;
    if (exibirChat != null && exibirChat != undefined && idChat != null && idChat != undefined){
      setOcultarChat(exibirChat);
      setCurrentChatID(idChat);
    }  
  }, [])
  
  useEffect(()=>{
    buscaChat();
  })

  const getFotoStorage = async(userUID)=>{
    var caminhoFirebase = userUID.concat('Perfil');    
    var url = '';
    try{
      url = await storage().ref(caminhoFirebase).getDownloadURL();
      setImageUser(url); 
    } catch (error){
      if (error.code == 'storage/object-not-found'){
        url = await storage().ref('user_undefined.png').getDownloadURL(); 
        setImageUser(url); 
      }
    }
    return url;
  }

  // const renderMessages = useCallback((msgs)=>{
  //   console.log('secondUser:', secondUser);
  //   return msgs != undefined? (
  //     msgs.reverse().map((msg, index)=>({
  //       ...msg,
  //       _id: index,
  //       user: {
  //         _id: msg.sender == currentUser? currentUser:secondUser,
  //         name: msg.sender == currentUser? currentUser:secondUser,
  //         avatar:'',
  //       }
  //     }))
  //     ):[];    
  // })
  
  const renderMessages = msgs =>{
    // console.log('---------------------------------')
    // console.log('dentro de renderMessages:');
    // console.log('currentCHAT:', chatroomID);
    // console.log('---------------------------------')
    return msgs != undefined? (
      msgs.reverse().map((msg, index)=>({
        ...msg,
        _id: index,
        user: {
          _id: msg.sender == currentUser? currentUser:secondUser,
          name: msg.sender == currentUser? currentUser:secondUser,
          avatar:'',
        }
      }))
      ):[];
    }
    
    //ok
    const fetchMessages = useCallback(async(chatroomID)=>{
      // const ref = database().ref(`chatrooms/${chatroomID}`);
      // const ref = database().ref(`chatrooms/${chatroomID}`);
      const snapshot = await reference.once('value').then(snapshot=>{
        return snapshot.val();
      });
      console.log('---------------------------------')
      console.log('dentro de fetchMessages:');
      console.log('currentCHAT:', chatroomID);
      console.log('---------------------------------')
      return snapshot;
    });

    //ok
    const loadData = async(chatroomID)=>{
      console.log('---------------------------------')
      console.log('dentro de loadData:');
      console.log('currentCHAT:', chatroomID);
      console.log('---------------------------------')
      const myChatroom = await fetchMessages(chatroomID);
      setMessages(renderMessages(myChatroom.messages));
    }


  //ok
  const listenerChatroom = (chatroomID)=>{
    const ref = database().ref(`chatrooms/${chatroomID}`);
    try{
      ref.on('value', snapshot=>{
        const data = snapshot.val();
        setMessages(renderMessages(data.messages));
      })
    }catch(error){
      console.log('erro em listenerChatroom');
    }
  }
  
  //ok
  const removeListener = (ref)=>{
    try{
      database().ref(`chatrooms/${currentChatID}`).off('value');
    }catch(error){
      console.log('erro em removeListener')
    }
  }
  



  //ok
  const buscaChat = ()=>{
    let jaExiste = false;
    if (jaExiste == true){
      jaExiste = false;
    }
    try{
      database().ref().child('chatrooms/').on('value', snapshot=>{
        if (snapshot.exists()){
          snapshot.forEach(idChat=>{
            if (idChat.val().firstUser == currentUser || idChat.val().secondUser == currentUser){
              if (!existeChat){
                setExisteChat(true);
              }
              infoChatrooms.some(infoChat =>{
                if (infoChat.idChat == idChat.key){
                  jaExiste = true;
                }
              })
              if (!jaExiste){
                setinfoChatrooms([...infoChatrooms, {
                  idChat:idChat.key,
                  firstUser:idChat.val().firstUser,
                  secondUser:idChat.val().secondUser,
                }])
              }
            }
          })
        }
      })      
    }catch(error){
      console.log('erro em buscaChat');
    }
  }



  // const attSecondUser = (user)=>{
  //   if (secondUser == null && !ocultarChat){
  //     setSecondUser(user);
  //   }
  // }


  //ok
  const onSend = useCallback(async (messages = []) => {
    // const ref = database().ref(`chatrooms/${currentChatID}`);
    console.log('onSend:--------------------------');
    console.log('currentCHATID:', currentChatID);
    // const lastMessages = currentChatroom.messages || [];
    const currentChatroom = await fetchMessages(currentChatID);
    console.log('onSend:--------------------------');
    try{
      reference.update({
        messages: [
          ...lastMessages, {
            text: messages[0].text,
            sender: currentUser,
            createdAt: new Date(),
          }
        ]
      })
    }catch(error){
      console.log("erro em onSend");
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  
  function renderInputToolbar (props) {
    return (
      <InputToolbar {...props} containerStyle={styles.toolbar} />
    )
  }

  const abrirConversa = async(chatroomID)=>{
    console.log('---------------------------------')
    console.log('dentro de abrir conversa:');
    console.log('currentCHAT:', chatroomID);
    console.log('---------------------------------')
    // setCurrentChatID(chatroomID);
    setOcultarChat(!ocultarChat);
    loadData(chatroomID);
    listenerChatroom(chatroomID);
  }

  const fecharConversa = ()=>{
    removeListener();
    setOcultarChat(true);
    setCurrentChatID(null);
    setSecondUser(null);
  }

  useEffect(()=>{
    console.log('--------------------------------------------------')
    console.log('currentChatID:', currentChatID);
    if (currentChatID != null && ocultarChat){
      console.log('entrou na conversa!!!');
      abrirConversa(currentChatID);
    }
    console.log('--------------------------------------------------')
  }, [currentChatID])

  return (
    <>
      <StatusBar barStyle={'light-content'} />
        {
          !existeChat &&
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', position: 'absolute', top:100, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Você conseguirá enviar mensagens para{'\n'} passageiros ou motoristas, assim que{'\n'} fizer sua primeira viagem.</Text>
          <Image source={
            require('../../assets/images/message.png')} 
            style={{height:350, width: 350, position: 'absolute', top: 220, alignSelf: 'center'}}  
            />
        </View>
      }
      {
        existeChat && ocultarChat &&
        <SafeAreaView>

        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: '100%'}}>
          <Text style={{color:'#06444C', position: 'absolute', top:100, left: 24, fontWeight:'600', fontSize: 18, lineHeight:24, textAlign:'left'}}>Aqui estão suas conversas recentes</Text>
          <ScrollView style={styles.scrollView}>
          {
            infoChatrooms && infoChatrooms.map(id=>(
              <View style={styles.viewMensagens}
              key={id.idChat}
              >
                <Text style={{color:'#06444C', left: '10%', fontWeight:'600', fontSize: height*0.02, textAlign:'left'}}>ID CHAT:</Text>
                <Text style={{color:'#06444C', left: '10%', fontWeight:'600', fontSize: height*0.02, textAlign:'left'}}>{id.idChat}:</Text>
                <Text style={{color:'#06444C', left: '10%', fontWeight:'600', fontSize: height*0.02, textAlign:'left'}}>First User:</Text>
                <Text style={{color:'#06444C', left: '10%', fontWeight:'600', fontSize: height*0.02, textAlign:'left'}}>{id.firstUser}</Text>
                <Text style={{color:'#06444C', left: '10%', fontWeight:'600', fontSize: height*0.02, textAlign:'left'}}>secondUser:</Text>
                <Text style={{color:'#06444C', left: '10%', fontWeight:'600', fontSize: height*0.02, textAlign:'left'}}>{id.secondUser}</Text>
                <TouchableOpacity 
                  style={{width: '90%', justifyContent: 'center', alignSelf:'center'}}
                  onPress={()=>{
                    let anotherUser = currentUser==id.firstUser?id.secondUser:id.firstUser;
                    setSecondUser(anotherUser);
                    if (currentChatID == null){
                      setCurrentChatID(id.idChat);
                      setReference(database().ref(`chatrooms/${id.idChat}`));
                    }
                    // abrirConversa(id.idChat, anotherUser);
                    // setOcultarChat(!ocultarChat);
                  }}
                >
                  <Text style={{color: '#FF5F55', textAlign: 'center', fontSize: height*0.02, fontWeight: 'bold'}}>Abrir conversa</Text>
                </TouchableOpacity>
              </View>
            ))
          }
        </ScrollView>
        </View>
        </SafeAreaView>

      
      }
      {
        existeChat && !ocultarChat && currentChatID &&
        <>
        <GiftedChat
        renderInputToolbar={renderInputToolbar}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUser,
        }}
        />
        <TouchableOpacity
              style={{backgroundColor: 'white', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', position: 'absolute', top: 10, left: 10, borderWidth: 1, borderColor: '#FF5F55'}}
              onPress={()=>{
                fecharConversa()
              }}
          >
             <Icon name="arrow-left" size={30} color="#FF5F55" style={{alignSelf:'center'}}/>
          </TouchableOpacity>
        </>
        }
    </>
  )
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FF5F55',
  },
  scrollView: {
    top: '20%',
    width: width,
    height: height
  },
  viewMensagens:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width*0.9, 
    height: height*0.2, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    alignSelf:'center', 
    marginTop: '1%',
    borderBottomWidth: 1,
    borderBottomColor: '#FF5F55'
  }
})