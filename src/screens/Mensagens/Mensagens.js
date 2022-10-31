import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { StyleSheet } from 'react-native'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


export default function Mensagens() {
  const [messages, setMessages] = useState([]);
  const [chatroomID, setChatroomID] = useState(null);
  
  const currentUser = auth().currentUser.uid;
  const uidGuilherme = '24Yqq2s4auM58cVGSrLfre2fHqo2';

  const renderMessages = msgs =>{
    return msgs != undefined? (
      msgs.reverse().map((msg, index)=>({
        ...msg,
        _id: index,
        user: {
          _id: msg.sender == currentUser? currentUser:uidGuilherme,
          name: msg.sender == currentUser? currentUser:uidGuilherme,
          avatar:'',
        }
      }))
      ):[];
    }
    

    const fetchMessages = useCallback(async()=>{
      const ref = database().ref('chatrooms/-NFk1Tl2t_59ajHoOnfq');
      const snapshot = await ref.once('value').then(snapshot=>{
        return snapshot.val();
      });
      return snapshot;
    });


    const loadData = async()=>{
      const myChatroom = await fetchMessages();
      setMessages(renderMessages(myChatroom.messages));
    }


  
  const listenerChatroom = ()=>{
    const ref = database().ref('chatrooms/-NFk1Tl2t_59ajHoOnfq');
    try{
      ref.on('value', snapshot=>{
        const data = snapshot.val();
        setMessages(renderMessages(data.messages));
      })
    }catch(error){
      console.log('erro em listenerChatroom');
    }
  }

  const removeListener = (ref)=>{
    ref.off('value', ref);
  }
  

  //ref.push cria um chat com uma chave única
  const newChatroom = (user1, user2)=>{
    const ref = database().ref(`chatrooms/`);
    user1 = currentUser;
    user2 = '24Yqq2s4auM58cVGSrLfre2fHqo2';
    try{
      const newChatroomRef = ref.push({
        firstUser: user1,
        secondUser: user2,
        chatRoomID: '',
        messages: [],
      })
      setChatroomID(newChatroomRef.key);
    }catch(error){
      console.log('erro em newChatRoom');
    }
  }


  useEffect(() => {
    loadData();  
    listenerChatroom();
  }, [])

  //ok
  const onSend = useCallback(async (messages = []) => {
    const ref = database().ref('chatrooms/-NFk1Tl2t_59ajHoOnfq');
    const currentChatroom = await fetchMessages();
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

  return (
    <GiftedChat
      renderInputToolbar={renderInputToolbar}
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: currentUser,
      }}
    />
  )
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FF5F55',
  }
})