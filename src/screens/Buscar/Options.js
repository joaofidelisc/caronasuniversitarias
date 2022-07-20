import {
    Text,
    View, 
    FlatList,
    TouchableOpacity ,
    StyleSheet, 
    Image, 
    Button, 
    Modal,
    Alert, 
    ImageBackground, 
    SafeAreaView, 
    ScrollView, 
    StatusBar,
    TextInput,
    RefreshControl
  } 
  from 'react-native';
  import React,{useState} from 'react';
  import estilos from '../../estilos/estilos'

export default function Options({navigation}){

    const [visivel,setVisivel]=useState(true)

  const infos=[{
    id:'001',
    desc:[" Guilherme", ' 2']
  },
  {
    id:'002',
    desc:[' Josefânia Alves', ' 3']
  },
  {
    id:'003',
    desc:[' Astolfo Nunes', ' 4']
  },
]

    return(
        <SafeAreaView>
      <Text style={{fontSize:25, color:'#2f4f4f', paddingHorizontal:20, fontWeight:'bold', marginVertical:10}}>
        Você recebeu oferta(s) de carona!</Text>
      <View style={estilos.botao2}>
        <Button
          title="Mostrar lista "
          color={'#2f4f4f'}
          onPress={()=>{setVisivel(true)}}
        />
      </View>
      <Modal 
        animationType="none"
        transparent={true}
        visible={visivel}
        style={{}}
      >
      <View style={{
        backgroundColor:`#cd5c5c`,
        margin:0,
        marginTop:110,
        marginVertical:90,
        padding:10,
        borderRadius:20,
        elevation:10

      }}>
      <Button
        title="Fechar Lista "
        color={'#c0c0c0'}
        onPress={()=>{setVisivel(false)}}
      />
      <FlatList
        data={infos}
        keyExtractor={item=>item.id}
        renderItem={
          ({item})=><View style={estilos.itens}>
                      <Text style={estilos.itens}>Motorista:{item.desc[0]}  Vagas:{item.desc[1]}
                    <View>
          <TouchableOpacity
            style={{backfaceVisibility:'visible'}}
            onPress={()=>navigation.navigate('CaronaEncontrada')}
          >
          <Text style={estilos.textstyle}>                    Confirmar</Text>
          </TouchableOpacity>
          </View>
          <View style={{fontsize:15, color:'#dc143c'}}>
          <TouchableOpacity
            style={{backfaceVisibility:'visible'}}
            onPress={()=>navigation.navigate('Procurar')}
          >
          <Text style={estilos.textstyle}>                    Negar</Text>
          </TouchableOpacity>
          </View>
          </Text>
          </View>
        }
        />
      </View>
      </Modal>  
    </SafeAreaView>

    );
}