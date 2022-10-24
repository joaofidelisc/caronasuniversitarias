import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { StyleSheet } from 'react-native'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


export default function Mensagens() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Bem vindo ao aplicativo caronas universitárias!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'João',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
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
        _id: 1,
      }}
    />
  )
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FF5F55',
  }
})