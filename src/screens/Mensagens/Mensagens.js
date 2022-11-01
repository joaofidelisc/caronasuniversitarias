import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, Dimensions, Image, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const {height,width} = Dimensions.get('screen');

export default function Mensagens() {
  const [messages, setMessages] = useState([]);
  const [currentChatID, setCurrentChatID] = useState(null);
  const [imageUser, setImageUser] = useState('');
  const [existeChat, setExisteChat] = useState(false);
  const [infoChatrooms, setinfoChatrooms] = useState([]);
  const [ocultarChat, setOcultarChat] = useState(true);
  const [listener, setListener] = useState(null);
  const [secondUser, setSecondUser] = useState(null);

  const currentUser = auth().currentUser.uid;
  const uidGuilherme = '24Yqq2s4auM58cVGSrLfre2fHqo2';

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

  const renderMessages = useCallback((msgs)=>{
    console.log('secondUser:', secondUser);
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
  })
  
  // const renderMessages = (msgs, firstUser, secondUser) =>{
  //   const anotherUser = firstUser != currentUser? firstUser:secondUser;
  //   console.log('secondUSER:', secondUser);
  //   console.log('anotherUSER:', anotherUser);
  //   return msgs != undefined? (
  //     msgs.reverse().map((msg, index)=>({
  //       ...msg,
  //       _id: index,
  //       user: {
  //         _id: msg.sender == currentUser? currentUser:anotherUser,
  //         name: msg.sender == currentUser? currentUser:anotherUser,
  //         avatar:'',
  //       }
  //     }))
  //     ):[];
  //   }
    
    //ok
    const fetchMessages = useCallback(async(chatroomID)=>{
      const ref = database().ref(`chatrooms/${chatroomID}`);
      const snapshot = await ref.once('value').then(snapshot=>{
        return snapshot.val();
      });
      return snapshot;
    });

    //ok
    const loadData = async(chatroomID)=>{
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
  

  //ref.push cria um chat com uma chave única
  const newChatroom = (user2)=>{
    const ref = database().ref(`chatrooms/`);
    try{
      const newChatroomRef = ref.push({
        firstUser: currentUser,
        secondUser: user2,
        messages: [],
      })
    }catch(error){
      console.log('erro em newChatRoom');
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


  useEffect(()=>{
    buscaChat();
    console.log('ids chats:', infoChatrooms);
  })

  // const attSecondUser = (user)=>{
  //   if (secondUser == null && !ocultarChat){
  //     setSecondUser(user);
  //   }
  // }


  //ok
  const onSend = useCallback(async (messages = []) => {
    const ref = database().ref(`chatrooms/${currentChatID}`);
    console.log('currentChatID:', currentChatID);
    const currentChatroom = await fetchMessages(currentChatID);
    const lastMessages = currentChatroom.messages || [];
    try{
      ref.update({
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

  const abrirConversa = (chatroomID)=>{
    setCurrentChatID(chatroomID);
    loadData(chatroomID);
    listenerChatroom(chatroomID);
  }

  const fecharConversa = ()=>{
    removeListener();
    setOcultarChat(true);
    setCurrentChatID(null);
    setSecondUser(null);
  }

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
                  abrirConversa(id.idChat);
                  setOcultarChat(!ocultarChat);
                  // attSecondUser(anotherUser);
                }}
              >
                <Text style={{color: '#FF5F55', textAlign: 'center', fontSize: height*0.02, fontWeight: 'bold'}}>Abrir conversa</Text>
              </TouchableOpacity>
            </View>

          ))
        }
        </ScrollView>
      
        </View>
      
      }
      {
        existeChat && !ocultarChat &&
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
    marginTop: '1%'
  }
})