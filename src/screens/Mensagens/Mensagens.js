import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {DATE_FORMAT, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import Lottie from 'lottie-react-native';

const {height, width} = Dimensions.get('screen');

import serverConfig from '../../../config/config.json';

export default function Mensagens({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const [currentChatID, setCurrentChatID] = useState(null);
  const [existeChat, setExisteChat] = useState(false);
  const [infoChatrooms, setinfoChatrooms] = useState([]);
  const [ocultarChat, setOcultarChat] = useState(true);
  const [secondUser, setSecondUser] = useState(null);
  const [avatarAnotherUser, setAvatarAnotherUser] = useState(null);
  const [carregarTela, setCarregarTela] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [atualizarChats, setAtualizarChats] = useState(true);

  const [testeLottie, setTesteLottie] = useState(true);

  const currentUser = auth().currentUser.uid;
  const chatIDRef = useRef(null);

  const getFotoStorage = async (userUID1, userUID2) => {
    console.log('Renderizando...1');
    const userUID = userUID1 == currentUser ? userUID2 : userUID1;
    var caminhoFirebase = userUID.concat('Perfil');
    var url = '';
    try {
      url = await storage().ref(caminhoFirebase).getDownloadURL();
      // setImageUser(url);
    } catch (error) {
      if (error.code == 'storage/object-not-found') {
        url = await storage().ref('user_undefined.png').getDownloadURL();
        // setImageUser(url);
      }
    }
    return url;
  };

  // async function getNomeStorage(userUID1, userUID2){
  //   console.log('Renderizando...2');
  //   const userUID = userUID1==currentUser?userUID2:userUID1;
  //   let nomeUsuario = '';
  //   let docRef = firestore().collection('Users').doc(userUID);
  //   return docRef.get().then((doc)=>{
  //     if (doc.exists){
  //       nomeUsuario = doc.data().nome;
  //       return nomeUsuario;
  //     }else{
  //       return '';
  //     }
  //   })
  // }

  async function getNomeStorage(userUID1, userUID2) {
    console.log('Renderizando...2');
    const userUID = userUID1 == currentUser ? userUID2 : userUID1;
    let reqs = await fetch(
      serverConfig.urlRootNode + `buscarUsuario/${userUID}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      },
    );
    const res = await reqs.json();
    if (res != 'Falha') {
      return res.nome;
    } else {
      return '';
    }
  }

  const renderMessages = useCallback(msgs => {
    console.log('Renderizando...3');

    return msgs != undefined
      ? msgs.reverse().map((msg, index) => ({
          ...msg,
          _id: index,
          user: {
            _id: msg.sender == currentUser ? currentUser : secondUser,
            name: msg.sender == currentUser ? currentUser : secondUser,
            avatar: avatarAnotherUser,
          },
        }))
      : [];
  });

  //ok
  const fetchMessages = useCallback(async chatroomID => {
    console.log('Renderizando...4');

    const ref = database().ref(`chatrooms/${chatroomID}`);
    const snapshot = await ref.once('value').then(snapshot => {
      return snapshot.val();
    });
    return snapshot;
  });

  //ok
  const loadData = async chatroomID => {
    console.log('Renderizando...5');

    const myChatroom = await fetchMessages(chatroomID);
    setMessages(renderMessages(myChatroom.messages));
  };

  //ok
  const listenerChatroom = chatroomID => {
    console.log('Renderizando...6');

    const ref = database().ref(`chatrooms/${chatroomID}`);
    try {
      ref.on('value', snapshot => {
        const data = snapshot.val();
        setMessages(renderMessages(data.messages));
      });
    } catch (error) {
      console.log('erro em listenerChatroom');
    }
  };

  //ok
  const removeListener = () => {
    console.log('Renderizando...7');

    try {
      database().ref(`chatrooms/${chatIDRef.current}`).off('value');
    } catch (error) {
      console.log('erro em removeListener');
    }
  };

  //ok
  const buscaChat = useCallback(async () => {
    // const buscaChat = async()=>{

    console.log('Renderizando...8');

    let jaExiste = false;
    if (jaExiste == true) {
      jaExiste = false;
    }
    try {
      database()
        .ref()
        .child('chatrooms/')
        .on('value', snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(async idChat => {
              if (
                idChat.val().firstUser == currentUser ||
                idChat.val().secondUser == currentUser
              ) {
                if (!existeChat) {
                  console.log('não existe chat!');
                  setExisteChat(true);
                  setCarregarTela(true);
                }
                infoChatrooms.some(infoChat => {
                  console.log('info já existente!');
                  if (infoChat.idChat == idChat.key) {
                    jaExiste = true;
                  }
                });
                if (!jaExiste) {
                  console.log('atualizando...');
                  setinfoChatrooms([
                    ...infoChatrooms,
                    {
                      idChat: idChat.key,
                      firstUser: idChat.val().firstUser,
                      secondUser: idChat.val().secondUser,
                      urlIMG: await getFotoStorage(
                        idChat.val().firstUser,
                        idChat.val().secondUser,
                      ),
                      name: await getNomeStorage(
                        idChat.val().firstUser,
                        idChat.val().secondUser,
                      ),
                    },
                  ]);
                }
              }
            });
          } else {
            setCarregarTela(false);
          }
        });
    } catch (error) {
      console.log('erro em buscaChat');
    }
  });
  // }

  //ok
  const onSend = useCallback(async (messages = []) => {
    console.log('Renderizando...9');

    const data = new Date().toString();
    const ref = database().ref(`chatrooms/${chatIDRef.current}`);
    const currentChatroom = await fetchMessages(chatIDRef.current);
    const lastMessages = currentChatroom.messages || [];
    try {
      ref.update({
        messages: [
          ...lastMessages,
          {
            text: messages[0].text,
            sender: currentUser,
            createdAt: data,
          },
        ],
      });
    } catch (error) {
      console.log('erro em onSend');
    }
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  function renderInputToolbar(props) {
    console.log('Renderizando...10');

    return <InputToolbar {...props} containerStyle={styles.toolbar} />;
  }

  const abrirConversa = async chatroomID => {
    console.log('Renderizando...11');

    database().ref().child('chatrooms/').off('value');
    setOcultarChat(!ocultarChat);
    loadData(chatroomID);
    listenerChatroom(chatroomID);
  };

  const fecharConversa = () => {
    console.log('Renderizando...12');
    console.log('Fechando conversa...');

    removeListener();
    setOcultarChat(true);
    setCurrentChatID(null);
    chatIDRef.current = null;
    setSecondUser(null);
    setAvatarAnotherUser(null);
  };

  useEffect(() => {
    console.log('useEffect...1');

    setTimeout(() => setLoading(false), 8000);
    console.log('carregou!');
  }, []);

  useEffect(() => {
    buscaChat();
    // if (atualizarChats){
    //   console.log('useEffect...2');
    //   setAtualizarChats(!atualizarChats);
    // }
  });

  useEffect(() => {
    console.log('useEffect...3');
    if (currentChatID != null && ocultarChat) {
      abrirConversa(currentChatID);
    }
  }, [currentChatID]);

  //Vem da tela de Suas Viagens
  useEffect(() => {
    console.log('useEffect...4');

    const exibirChat = route.params?.ocultarChat;
    const idChat = route.params?.idChat;
    if (
      exibirChat != null &&
      exibirChat != undefined &&
      idChat != null &&
      idChat != undefined
    ) {
      setCurrentChatID(idChat);
      chatIDRef.current = idChat;
      setOcultarChat(exibirChat);
    }
  }, []);

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      {loading && (
        // testeLottie &&
        <View style={{marginVertical: height * 0.3}}>
          {/* <Text style={{color:'#06444C', fontWeight:'600', fontSize: 20, lineHeight:24, textAlign:'center'}}>Verificando se existem conversas...</Text> */}
          <Lottie
            style={{
              height: height * 0.3,
              width: height * 0.3,
              alignSelf: 'center',
            }}
            source={require('../../assets/JSON/loading_1.json')}
            autoPlay
            loop
            speed={0.6}
          />
        </View>
      )}
      {!existeChat && !carregarTela && !loading && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            height: '100%',
          }}>
          <Text
            style={{
              color: '#06444C',
              position: 'absolute',
              top: 100,
              left: 24,
              fontWeight: '600',
              fontSize: 18,
              lineHeight: 24,
              textAlign: 'left',
            }}>
            Você conseguirá enviar mensagens para{'\n'} passageiros ou
            motoristas, assim que{'\n'} fizer sua primeira viagem.
          </Text>
          <Image
            source={require('../../assets/images/message.png')}
            style={{
              height: 350,
              width: 350,
              position: 'absolute',
              top: 220,
              alignSelf: 'center',
            }}
          />
        </View>
      )}
      {existeChat && ocultarChat && !loading && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            height: '100%',
          }}>
          <Text
            style={{
              color: '#06444C',
              position: 'absolute',
              top: height * 0.05,
              left: width * 0.0625,
              fontWeight: '600',
              fontSize: width * 0.0469,
              lineHeight: 24,
              textAlign: 'left',
            }}>
            Aqui estão suas conversas recentes
          </Text>
          <ScrollView style={styles.scrollView}>
            {infoChatrooms &&
              infoChatrooms.map(id => (
                <View style={styles.viewMensagens} key={id.idChat}>
                  {id.urlIMG != '' ? (
                    <Image
                      source={{uri: id.urlIMG}}
                      style={{
                        height: 70,
                        width: 70,
                        borderRadius: 100,
                        alignSelf: 'center',
                        marginBottom: '4%',
                        marginTop: '4%',
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/icons/user_undefined.png')}
                      style={{
                        height: 70,
                        width: 70,
                        borderRadius: 100,
                        alignSelf: 'center',
                        marginBottom: '4%',
                        marginTop: '4%',
                      }}
                    />
                  )}

                  <Text
                    style={{
                      color: '#06444C',
                      fontWeight: '600',
                      fontSize: height * 0.02,
                      textAlign: 'center',
                      marginBottom: '4%',
                    }}>
                    {id.name}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: '90%',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                    onPress={() => {
                      let anotherUser =
                        currentUser == id.firstUser
                          ? id.secondUser
                          : id.firstUser;
                      setSecondUser(anotherUser);
                      setAvatarAnotherUser(id.urlIMG);
                      if (currentChatID == null) {
                        setCurrentChatID(id.idChat);
                        chatIDRef.current = id.idChat;
                      }
                    }}>
                    <Text
                      style={{
                        color: '#FF5F55',
                        textAlign: 'center',
                        fontSize: height * 0.02,
                        fontWeight: 'bold',
                      }}>
                      Abrir conversa
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      )}
      {existeChat && !ocultarChat && currentChatID && (
        <View
          style={{
            position: 'absolute',
            width: width,
            height: height * 0.8,
          }}>
          <GiftedChat
            renderInputToolbar={renderInputToolbar}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: currentUser,
            }}
            placeholder={'Digite uma mensagem'}
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              position: 'absolute',
              top: 10,
              left: 10,
              borderWidth: 1,
              borderColor: '#FF5F55',
            }}
            onPress={() => {
              fecharConversa();
            }}>
            <Icon
              name="arrow-left"
              size={30}
              color="#FF5F55"
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FF5F55',
  },
  scrollView: {
    top: '12%',
    width: width,
    height: height,
  },
  viewMensagens: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: height * 0.02,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
    height: height * 0.2,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '1%',
    borderBottomWidth: 1,
    borderBottomColor: '#FF5F55',
  },
});
