import {
    StyleSheet, Dimensions 
  } 
  from 'react-native';

  const {height,width} = Dimensions.get('screen')

export default StyleSheet.create({
    imagem:{
      width:50,
      resizeMode:'contain'
    },
    imagemFundo:{
      flex:1,
      resizeMode:"cover",
      width:"100%"
    },
    botao:{
      flexDirection:'row',
      backgroundColor:'cd5c5c',
      alignItems:'center',
      justifyContent:'center',
      marginTop:120,
    },
    modal:{
      backgroundColor:`#cd5c5c`,
      margin:0,
      marginTop:250,
      marginVertical:50,
      padding:10,
      borderRadius:20,
      elevation:10
    },
    itens:{
      fontSize:20,
      color:'#2f4f4f',
      paddingHorizontal:-50,
      backgroundColor:'#c0c0c0',
      marginHorizontal:0,
      marginTop:20,
      paddingVertical:10,
      borderRadius:20,
      fontWeight:'bold'
    },
    botao2:{
      flexDirection:'row',
      
      alignItems:'center',
      justifyContent:'center',
      marginTop:200,
      marginVertical:50,
    },
    textstyle:{
      fontWeight:'bold',
      color:'#dc143c'
    },
    modal2:{
      backgroundColor:`#cd5c5c`,
      marginTop:320,
      padding:10,
      borderRadius:20,
      
    },
    TextoCiano:{
      fontSize:15,
      color:'#2f4f4f',
      paddingHorizontal:20, 
      fontWeight:'bold', 
      marginVertical:10,
      padding:5,
      paddingHorizontal:5,
      marginHorizontal:100,
      marginTop:1,
      fontWeight:'bold',
    },
    TextoCiano2:{
      fontSize:15,
      color:'#a52a2a',
      paddingHorizontal:10, 
      fontWeight:'bold', 
      marginVertical:10,
      padding:5,
      paddingHorizontal:5,
      marginHorizontal:100,
      marginTop:1,
      fontWeight:'bold',
    },
    TextoCiano3:{
      fontSize:15,
      color:'#2f4f4f',
      paddingHorizontal:10, 
      fontWeight:'bold', 
      marginVertical:10,
      padding:5,
      paddingHorizontal:5,
      marginHorizontal:10,
      marginTop:1,
      fontWeight:'bold',
    },
    TextoCiano4:{
      fontSize:22,
      color:'#2f4f4f',
      paddingHorizontal:10, 
      fontWeight:'bold', 
      marginVertical:10,
      padding:5,
      paddingHorizontal:5,
      marginHorizontal:100,
      marginTop:1,
      fontWeight:'bold',
    },
    CustomRatingBarStyle:{
      justifyContent:'center',
      flexDirection:'row',
      marginTop:40

    },
    StarImgStyle:{
      // width:height*0.06,
      // height:height*0.06,
      width:40,
      height:40,
      resizeMode:'cover',
      top:'50%'
    },
    styleOne:{
      flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    Style2:{
      position: 'absolute', top: '3%', left: '5%', fontWeight: '700', fontSize: height*0.017, lineHeight: 15, color:'#06444C'
    },
    Text1:{
      position: 'absolute', left: 61, top: 166, fontWeight: '800', fontSize: 12, lineHeight: 15, color:'#F9FEFF'
    },
    Text2:{
      position: 'absolute', left: 252, top: 141, fontWeight: '800', fontSize: 12, lineHeight: 15, color:'#F9FEFF'
    },
    Text3:{
      position: 'absolute', left: '5%', top: '28%', fontWeight: '700', fontSize: height*0.017, lineHeight: 18, color: '#06444C'
    },
    Text4:{
      position: 'absolute', left: '10%', top: '32%', fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color:'#06444C'
    },
    Text5:{
      position: 'absolute', left: '15%', top: '35%', fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color:'#FF5F55'
    },
    Text6:{
      position: 'absolute', left: '10%', top: '38%', fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color:'#06444C'
    },
    Text7:{
      position: 'absolute', left: '15%', top: '41%', fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color:'#FF5F55'
    },
    Text8:{
      position: 'absolute', left: '5%', top: '44%', fontWeight: '700', fontSize: height*0.017, lineHeight: 18, color:'#06444C'
    },
    Text9:{
      fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color: '#06444C'
    },
    Text10:{
      position: 'absolute', left: '15%', top: '51%', fontWeight: '600', fontSize: height*0.014, lineHeight: 15, color:'#FF5F55'
    },
    Text11:{
      fontWeight: '600', fontSize: 12, lineHeight: 15, color: '#06444C'
    },
    Text12:{
      position: 'absolute', left: 60, top: 445, fontWeight: '600', fontSize: 12, lineHeight: 15, color:'#FF5F55'
    },
    Text13:{
      position: 'absolute', left: '5%', top: '55%', fontWeight: '600', fontSize: height*0.017, lineHeight: 18, color: '#06444C'
    },
    Text14:{
      color: 'white', fontWeight: 'bold'
    },
    TouchbleOpct1:{
      position: 'absolute', width: '20%', height: '4%', left: '5%', top:'85%', backgroundColor: '#FF5F55', borderRadius: 57, alignItems: 'center', justifyContent: 'center'
    },
    retangulo:{
      position: 'absolute',
      height: '28%',
      left: 0,
      right: 0,
      top: 0,
      bottom: 473,
      backgroundColor: '#FF5F55',
      alignItems: 'center',
    },
    imgPerfil:{
      position: 'absolute',
      width: 63,
      height: 63,
      top: 49,
      borderRadius: 100,
    },
    textoUsuario:{
      position: 'absolute',
      top: 120,
      fontWeight: '800',
      fontSize: 10,
      lineHeight: 12,
      color: '#FFFFFF',
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    txtGeral: {
      position: 'absolute',
      width: 303,
      height: 51,
      left: 34,
      top: 65,
      fontSize: 24,
      lineHeight: 29,
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      color: '#06444C',
      fontWeight: '700',
    },
    input:{
      backgroundColor: '#C4C4C4',
      position: 'absolute',
      width: 291,
      height: 47,
      left: 34,
      top: 167,
      borderRadius: 15,
      color: 'white',
      textAlign:'center',
    },
    btnContinuar:{
      position: 'absolute',
      width: 291,
      height: 47,
      left: 34,
      top: 395,
      backgroundColor: "#C4C4C4",
      borderRadius: 15,
      justifyContent: 'center',
    },
    txtBtnContinuar:{
      textAlign: 'center',
      fontWeight: '400',
      fontSize: 16,
      lineHeight: 20,
      display: 'flex',
      alignItems: 'center',
      color: 'white',    
    },
    btnContinuarGoogle:{
      width: 291,
      height: 47,
      backgroundColor: '#C4C4C4',
      justifyContent: 'center',
      alignSelf: 'center'
    },
    txtBtnContinuarGoogle:{
      textAlign: 'center',
      fontSize: 16,
      lineHeight: 20,
    },
    btnFechar:{
      position: 'absolute',
      width: 14,
      height: 29,
      left: 22,
      top: 20,
    },
    txtBtnFechar:{
      fontWeight: '600',
      fontSize: 24,
      lineHeight: 29,
      alignItems: 'center',
      color: '#FF5F55',
    },
    TextInput1:{
      borderWidth:1, 
      borderColor:'#000', 
      alignItems:'center', 
      padding:18,
      borderTopRightRadius:20, 
      borderTopLeftRadius:20,
      borderBottomRightRadius:20,
      borderBottomLeftRadius:20,
      borderBottomStartRadius:20,
      borderBottomEndRadius:20,
      marginHorizontal:20,
      marginStart:20,
    }

})
